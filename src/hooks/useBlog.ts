import { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';

// Configuración de Airtable para Blog
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_BLOG_TABLE_NAME = 'Blog_Posts';
const AIRTABLE_BLOG_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_BLOG_TABLE_NAME}`;

// Función para transformar datos de Airtable a BlogPost
function transformAirtableBlogRecord(record: any): BlogPost {
  const fields = record.fields;
  
  return {
    id: record.id,
    titulo: getTituloValue(fields),
    slug: getSlugValue(fields),
    contenido: getContenidoValue(fields),
    resumen: getResumenValue(fields),
    imagenPrincipal: getImagenPrincipalValue(fields),
    categoria: getCategoriaValue(fields),
    tags: getTagsValue(fields),
    autor: getAutorValue(fields),
    fechaPublicacion: getFechaPublicacionValue(fields),
    estado: getEstadoValue(fields),
    seoTitle: getSeoTitleValue(fields),
    seoDescription: getSeoDescriptionValue(fields),
    destacado: getDestacadoValue(fields),
    vistas: getVistasValue(fields)
  };
}

// Funciones auxiliares para extraer campos del blog
function getTituloValue(fields: any): string {
  const tituloFields = ['Titulo', 'TITULO', 'titulo', 'Título'];
  for (const fieldName of tituloFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue.trim();
    }
  }
  return '';
}

function getSlugValue(fields: any): string {
  const slugFields = ['Slug', 'SLUG', 'slug'];
  for (const fieldName of slugFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue.trim();
    }
  }
  return '';
}

function getContenidoValue(fields: any): string {
  const contenidoFields = ['Contenido', 'CONTENIDO', 'contenido'];
  for (const fieldName of contenidoFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue.trim();
    }
  }
  return '';
}

function getResumenValue(fields: any): string {
  const resumenFields = ['Resumen', 'RESUMEN', 'resumen'];
  for (const fieldName of resumenFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue.trim();
    }
  }
  return '';
}

function getImagenPrincipalValue(fields: any): string {
  const imagenFields = ['Imagen_Principal', 'IMAGEN_PRINCIPAL', 'imagen_principal', 'Imagen Principal'];
  for (const fieldName of imagenFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && Array.isArray(fieldValue) && fieldValue.length > 0) {
      return fieldValue[0].url || '';
    }
  }
  return '/images/blog-default.jpg'; // Imagen por defecto
}

function getCategoriaValue(fields: any): BlogPost['categoria'] {
  const categoriaFields = ['Categoria', 'CATEGORIA', 'categoria', 'Categoría'];
  for (const fieldName of categoriaFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      const categoria = fieldValue.trim();
      if (['Reseñas', 'Guías', 'Tendencias', 'Consejos'].includes(categoria)) {
        return categoria as BlogPost['categoria'];
      }
    }
  }
  return 'Guías'; // Valor por defecto
}

function getTagsValue(fields: any): string[] {
  const tagsFields = ['Tags', 'TAGS', 'tags'];
  for (const fieldName of tagsFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && Array.isArray(fieldValue)) {
      return fieldValue.map(tag => String(tag).trim()).filter(Boolean);
    }
  }
  return [];
}

function getAutorValue(fields: any): string {
  const autorFields = ['Autor', 'AUTOR', 'autor'];
  for (const fieldName of autorFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue.trim();
    }
  }
  return 'KAME Perfumes';
}

function getFechaPublicacionValue(fields: any): string {
  const fechaFields = ['Fecha_Publicacion', 'FECHA_PUBLICACION', 'fecha_publicacion', 'Fecha Publicacion'];
  for (const fieldName of fechaFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue;
    }
  }
  return new Date().toISOString().split('T')[0]; // Fecha actual por defecto
}

function getEstadoValue(fields: any): BlogPost['estado'] {
  const estadoFields = ['Estado', 'ESTADO', 'estado'];
  for (const fieldName of estadoFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      const estado = fieldValue.trim();
      if (['Borrador', 'Publicado', 'Programado'].includes(estado)) {
        return estado as BlogPost['estado'];
      }
    }
  }
  return 'Borrador'; // Valor por defecto
}

function getProductosRelacionadosValue(fields: any): string[] {
  const productosFields = ['Productos_Relacionados', 'PRODUCTOS_RELACIONADOS', 'productos_relacionados', 'Productos Relacionados'];
  for (const fieldName of productosFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && Array.isArray(fieldValue)) {
      return fieldValue.map(id => String(id)).filter(Boolean);
    }
  }
  return [];
}

function getSeoTitleValue(fields: any): string {
  const seoTitleFields = ['SEO_Title', 'SEO_TITLE', 'seo_title', 'SEO Title'];
  for (const fieldName of seoTitleFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue.trim();
    }
  }
  return '';
}

function getSeoDescriptionValue(fields: any): string {
  const seoDescFields = ['SEO_Description', 'SEO_DESCRIPTION', 'seo_description', 'SEO Description'];
  for (const fieldName of seoDescFields) {
    const fieldValue = fields[fieldName];
    if (fieldValue && typeof fieldValue === 'string') {
      return fieldValue.trim();
    }
  }
  return '';
}

function getDestacadoValue(fields: any): boolean {
  const destacadoFields = ['Destacado', 'DESTACADO', 'destacado'];
  for (const fieldName of destacadoFields) {
    const fieldValue = fields[fieldName];
    if (typeof fieldValue === 'boolean') {
      return fieldValue;
    }
  }
  return false;
}

function getVistasValue(fields: any): number {
  const vistasFields = ['Vistas', 'VISTAS', 'vistas'];
  for (const fieldName of vistasFields) {
    const fieldValue = fields[fieldName];
    if (typeof fieldValue === 'number') {
      return fieldValue;
    }
  }
  return 0;
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchBlogPosts = async () => {
    // Evitar múltiples llamadas simultáneas
    if (hasInitialized) return;
    try {
      setLoading(true);
      setError(null);

      // Log de configuración para debugging
      if (import.meta.env.DEV) {
        console.log('Configuración Blog Airtable:', {
          endpoint: AIRTABLE_BLOG_ENDPOINT,
          hasToken: !!AIRTABLE_API_TOKEN,
          hasBaseId: !!AIRTABLE_BASE_ID,
          tableName: AIRTABLE_BLOG_TABLE_NAME
        });
      }

      // Obtener TODOS los posts manejando paginación
      let allRecords: any[] = [];
      let offset: string | undefined = undefined;
      let pageCount = 0;

      do {
        pageCount++;
        const url = new URL(AIRTABLE_BLOG_ENDPOINT);
        if (offset) {
          url.searchParams.append('offset', offset);
        }
        url.searchParams.append('pageSize', '100');
        
        // Filtrar solo posts publicados
        url.searchParams.append('filterByFormula', '{Estado} = "Publicado"');
        
        // Ordenar por fecha de publicación descendente
        url.searchParams.append('sort[0][field]', 'Fecha_Publicacion');
        url.searchParams.append('sort[0][direction]', 'desc');

        if (import.meta.env.DEV) {
          console.log(`Consultando blog página ${pageCount}:`, url.toString());
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
          console.log(`Blog página ${pageCount} - Posts recibidos:`, data.records?.length || 0);
        }

        allRecords = allRecords.concat(data.records || []);
        offset = data.offset;
        
      } while (offset);

      if (import.meta.env.DEV) {
        console.log('Total posts de blog obtenidos:', allRecords.length);
        if (allRecords.length > 0) {
          console.log('Primer post de ejemplo:', allRecords[0]);
        }
      }

      const transformedPosts = allRecords.map(transformAirtableBlogRecord);
      
      if (import.meta.env.DEV) {
        console.log('Posts transformados:', transformedPosts.length);
        console.log('Posts destacados:', transformedPosts.filter(p => p.destacado).length);
      }

      setPosts(transformedPosts);
      setHasInitialized(true);
      
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setHasInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInitialized) {
      fetchBlogPosts();
    }
  }, [hasInitialized]);

  return { posts, loading, error, refetch: fetchBlogPosts };
}
