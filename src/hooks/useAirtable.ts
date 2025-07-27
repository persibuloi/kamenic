import { useState, useEffect } from 'react';
import { Product, AirtableRecord } from '../types/product';

const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

function transformAirtableRecord(record: AirtableRecord): Product {
  // Manejar campo Foto con búsqueda robusta
  let imagen = '';
  const imageUrl = getImageValue(record.fields);
  
  if (imageUrl) {
    imagen = imageUrl;
  } else {
    // Si no hay foto, usar imagen por marca
    const marcaValue = getMarcaValue(record.fields);
    imagen = getDefaultImage(marcaValue);
  }

  // Obtener el valor de marca de manera más robusta
  const tipoMarca = getMarcaValue(record.fields);
  
  // Obtener existencia actual con mejor manejo de valores
  const existenciaActual = getExistenciaValue(record.fields);

  const product = {
    id: record.id,
    descripcion: record.fields['Descripción'] || '',
    precio1: record.fields['Precio1'] || 0,
    precioOferta: record.fields['Precio Oferta'] || undefined,
    tipoMarca,
    codigoKame: record.fields['CODIGO KAME'] || '',
    imagen,
    existenciaActual
  };

  // Log para debugging - solo en desarrollo
  if (import.meta.env.DEV) {
    console.log('Producto procesado:', {
      id: product.id,
      descripcion: product.descripcion,
      tipoMarca: product.tipoMarca,
      existenciaActual: product.existenciaActual,
      rawFields: record.fields
    });
  }

  return product;
}

// Función auxiliar para obtener el valor de marca de manera robusta
function getMarcaValue(fields: any): string {
  // Intentar diferentes variaciones del campo marca
  const marcaFields = ['MARCA', 'Marca', 'marca', 'tipo marca', 'Tipo Marca', 'TIPO MARCA'];
  
  for (const fieldName of marcaFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue) {
      if (Array.isArray(fieldValue) && fieldValue.length > 0) {
        return String(fieldValue[0]).trim();
      } else if (typeof fieldValue === 'string' && fieldValue.trim()) {
        return fieldValue.trim();
      }
    }
  }
  
  return ''; // Valor por defecto si no se encuentra marca
}

// Función auxiliar para obtener el valor de existencia
function getExistenciaValue(fields: any): number {
  const existenciaFields = ['Existencia Actual', 'existencia actual', 'Existencia', 'existencia'];
  
  for (const fieldName of existenciaFields) {
    const fieldValue = fields[fieldName];
    if (typeof fieldValue === 'number') {
      return fieldValue;
    } else if (typeof fieldValue === 'string') {
      const parsed = parseInt(fieldValue, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }
  
  return 0; // Valor por defecto
}

// Función auxiliar para obtener el valor de imagen de manera robusta
function getImageValue(fields: any): string {
  // Intentar diferentes variaciones del campo imagen
  const imageFields = ['Foto', 'foto', 'Imagen', 'imagen', 'Image', 'image', 'FOTO', 'IMAGEN'];
  
  for (const fieldName of imageFields) {
    const fieldValue = fields[fieldName];
    
    if (fieldValue) {
      // Si es un array de attachments de Airtable
      if (Array.isArray(fieldValue) && fieldValue.length > 0) {
        const firstAttachment = fieldValue[0];
        if (firstAttachment && firstAttachment.url) {
          if (import.meta.env.DEV) {
            console.log(`Imagen encontrada en campo '${fieldName}' (array):`, firstAttachment.url);
          }
          return firstAttachment.url;
        }
      }
      // Si es una URL directa como string
      else if (typeof fieldValue === 'string' && fieldValue.trim()) {
        const url = fieldValue.trim();
        // Verificar que parece una URL válida
        if (url.startsWith('http') || url.startsWith('/')) {
          if (import.meta.env.DEV) {
            console.log(`Imagen encontrada en campo '${fieldName}' (string):`, url);
          }
          return url;
        }
      }
    }
  }
  
  // Log para debugging cuando no se encuentra imagen
  if (import.meta.env.DEV) {
    console.log('No se encontró imagen válida. Campos disponibles:', Object.keys(fields));
    // Mostrar campos que podrían contener imágenes
    const possibleImageFields = Object.keys(fields).filter(key => 
      key.toLowerCase().includes('foto') || 
      key.toLowerCase().includes('imagen') || 
      key.toLowerCase().includes('image')
    );
    if (possibleImageFields.length > 0) {
      console.log('Campos que podrían contener imágenes:', possibleImageFields.map(field => ({
        field,
        value: fields[field]
      })));
    }
  }
  
  return ''; // No se encontró imagen válida
}

function getDefaultImage(marca: any): string {
  const imageMap: { [key: string]: string } = {
    'premium': '/images/product-sample-1.jpg',
    'lujoso': '/images/product-sample-2.png',
    'exclusivo': '/images/featured-perfume.png',
    'clasico': '/images/product-sample-3.jpg'
  };
  
  const normalizedType = (typeof marca === 'string' ? marca.toLowerCase() : '');
  return imageMap[normalizedType] || '/images/product-sample-1.jpg';
}

export function useAirtable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Log de configuración para debugging
      if (import.meta.env.DEV) {
        console.log('Configuración Airtable:', {
          endpoint: AIRTABLE_ENDPOINT,
          hasToken: !!AIRTABLE_API_TOKEN,
          hasBaseId: !!AIRTABLE_BASE_ID,
          hasTableName: !!AIRTABLE_TABLE_NAME
        });
      }

      // Obtener TODOS los registros manejando paginación
      let allRecords: any[] = [];
      let offset: string | undefined = undefined;
      let pageCount = 0;

      do {
        pageCount++;
        const url = new URL(AIRTABLE_ENDPOINT);
        if (offset) {
          url.searchParams.append('offset', offset);
        }
        // Aumentar el tamaño de página para obtener más registros por consulta
        url.searchParams.append('pageSize', '100');

        if (import.meta.env.DEV) {
          console.log(`Consultando página ${pageCount}:`, url.toString());
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (import.meta.env.DEV) {
          console.log(`Página ${pageCount} - Registros recibidos:`, data.records?.length || 0);
          console.log(`Página ${pageCount} - Offset para siguiente página:`, data.offset || 'ninguno');
        }

        allRecords = allRecords.concat(data.records || []);
        offset = data.offset;
        
      } while (offset);

      if (import.meta.env.DEV) {
        console.log('\n=== RESUMEN DE PAGINACIÓN ===');
        console.log('Total de páginas consultadas:', pageCount);
        console.log('Total de registros obtenidos:', allRecords.length);
        console.log('=== FIN RESUMEN ===\n');
      }

      // Crear objeto data con todos los registros
      const data = { records: allRecords };
      
      // Log de datos recibidos para debugging
      if (import.meta.env.DEV) {
        console.log('Registros recibidos de Airtable:', data.records?.length || 0);
        if (data.records && data.records.length > 0) {
          console.log('Primer registro de ejemplo:', data.records[0]);
          
          // Analizar campos de imagen en los primeros registros
          console.log('\n=== ANÁLISIS DE CAMPOS DE IMAGEN ===');
          const sampleRecords = data.records.slice(0, 3);
          sampleRecords.forEach((record, index) => {
            console.log(`\nRegistro ${index + 1}:`);
            console.log('Todos los campos:', Object.keys(record.fields));
            
            // Buscar campos que podrían ser imágenes
            const imageFields = Object.keys(record.fields).filter(key => 
              key.toLowerCase().includes('foto') || 
              key.toLowerCase().includes('imagen') || 
              key.toLowerCase().includes('image') ||
              key.toLowerCase().includes('picture') ||
              key.toLowerCase().includes('pic')
            );
            
            if (imageFields.length > 0) {
              console.log('Campos de imagen encontrados:', imageFields);
              imageFields.forEach(field => {
                console.log(`  ${field}:`, record.fields[field]);
              });
            } else {
              console.log('No se encontraron campos de imagen obvios');
            }
          });
          console.log('=== FIN ANÁLISIS DE CAMPOS DE IMAGEN ===\n');
        }
      }

      const transformedProducts = data.records.map(transformAirtableRecord);
      
      // Log de productos transformados
      if (import.meta.env.DEV) {
        console.log('Productos transformados:', transformedProducts.length);
        console.log('Productos con existencia > 0:', transformedProducts.filter(p => p.existenciaActual > 0).length);
        console.log('Productos con existencia = 0:', transformedProducts.filter(p => p.existenciaActual === 0).length);
        
        // ANÁLISIS DETALLADO DE EXISTENCIAS
        console.log('\n=== ANÁLISIS DETALLADO DE EXISTENCIAS ===');
        
        // Agrupar productos por valor de existencia
        const existenciaGroups = new Map();
        transformedProducts.forEach(p => {
          const key = p.existenciaActual;
          if (!existenciaGroups.has(key)) {
            existenciaGroups.set(key, []);
          }
          existenciaGroups.get(key).push({
            id: p.id,
            descripcion: p.descripcion.substring(0, 40) + '...',
            existenciaActual: p.existenciaActual
          });
        });
        
        // Mostrar grupos ordenados
        const sortedKeys = Array.from(existenciaGroups.keys()).sort((a, b) => b - a);
        sortedKeys.forEach(key => {
          const products = existenciaGroups.get(key);
          console.log(`Existencia ${key}: ${products.length} productos`);
          if (key > 0) {
            // Mostrar algunos ejemplos de productos con existencia > 0
            console.log('  Ejemplos:', products.slice(0, 3));
          }
        });
        
        // Verificar si hay valores de existencia que no son números
        const invalidExistence = transformedProducts.filter(p => 
          typeof p.existenciaActual !== 'number' || isNaN(p.existenciaActual)
        );
        if (invalidExistence.length > 0) {
          console.log('\nProductos con existencia inválida:', invalidExistence.length);
          console.log('Ejemplos:', invalidExistence.slice(0, 3).map(p => ({
            id: p.id,
            descripcion: p.descripcion.substring(0, 30) + '...',
            existenciaActual: p.existenciaActual,
            type: typeof p.existenciaActual
          })));
        }
        
        console.log('=== FIN ANÁLISIS DE EXISTENCIAS ===\n');
      }

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar productos');
      console.error('Error fetching products from Airtable:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
}

export default useAirtable;
