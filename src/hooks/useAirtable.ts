import { useState, useEffect } from 'react';
import { Product, AirtableRecord } from '../types/product';

const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

function transformAirtableRecord(record: AirtableRecord): Product {
  // Manejar campo Foto: puede ser undefined, un array, o un objeto con url
  let imagen = '';
  const fotoField = (record.fields as any)['Foto'];
  if (Array.isArray(fotoField) && fotoField.length > 0 && fotoField[0].url) {
    imagen = fotoField[0].url;
  } else if (typeof fotoField === 'string') {
    imagen = fotoField;
  } else {
    // Si no hay foto, usar imagen por marca
    const marcaValue = Array.isArray(record.fields['MARCA']) ? record.fields['MARCA'][0] : record.fields['MARCA'];
    imagen = getDefaultImage(marcaValue);
  }
  return {
    id: record.id,
    descripcion: record.fields['Descripción'] || '',
    precio1: record.fields['Precio1'] || 0,
    precioOferta: record.fields['Precio Oferta'] || undefined,
    tipoMarca: Array.isArray(record.fields['MARCA']) && record.fields['MARCA'].length > 0 ? record.fields['MARCA'][0] : (typeof record.fields['MARCA'] === 'string' ? record.fields['MARCA'] : ''),
    codigoKame: record.fields['CODIGO KAME'] || '',
    imagen,
    existenciaActual: record.fields['Existencia Actual'] ?? 0
  };
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

      const response = await fetch(AIRTABLE_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const transformedProducts = data.records.map(transformAirtableRecord);
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
