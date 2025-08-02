import { useState, useEffect } from 'react';
import { BlogComment, CommentFormData } from '../types/blog';

// Configuración de Airtable para Comentarios
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_COMMENTS_TABLE_NAME = 'Blog_Comments';
const AIRTABLE_COMMENTS_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_COMMENTS_TABLE_NAME}`;

// Función para transformar datos de Airtable a BlogComment
function transformAirtableCommentRecord(record: any): BlogComment {
  const fields = record.fields;
  
  return {
    id: record.id,
    postId: fields['Post_ID'] || '',
    nombre: fields['Nombre'] || '',
    email: fields['Email'] || '',
    comentario: fields['Comentario'] || '',
    fechaComentario: fields['Fecha_Comentario'] || new Date().toISOString(),
    estado: fields['Estado'] || 'Pendiente',
    respuestaA: fields['Respuesta_A'] || undefined,
    blogPost: fields['Blog_Post'] || undefined, // Relación con Blog_Posts
    esSpam: fields['Es_Spam'] || false,
    moderador: fields['Moderador'] || undefined
  };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Log de configuración para debugging
      if (import.meta.env.DEV) {
        console.log('Configuración Comments Airtable:', {
          endpoint: AIRTABLE_COMMENTS_ENDPOINT,
          hasToken: !!AIRTABLE_API_TOKEN,
          hasBaseId: !!AIRTABLE_BASE_ID,
          tableName: AIRTABLE_COMMENTS_TABLE_NAME,
          postId
        });
      }

      const url = new URL(AIRTABLE_COMMENTS_ENDPOINT);
      
      // Filtrar comentarios por postId
      url.searchParams.append('filterByFormula', `{Post_ID} = "${postId}"`);
      
      // Ordenar por fecha de comentario descendente
      url.searchParams.append('sort[0][field]', 'Fecha_Comentario');
      url.searchParams.append('sort[0][direction]', 'desc');

      if (import.meta.env.DEV) {
        console.log('Consultando comentarios:', url.toString());
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
        console.log('Comentarios recibidos:', data.records?.length || 0);
      }

      const transformedComments = (data.records || []).map(transformAirtableCommentRecord);
      setComments(transformedComments);
      
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData: CommentFormData): Promise<void> => {
    try {
      console.log('=== INICIANDO ENVÍO DE COMENTARIO ===');
      console.log('Post ID:', postId);
      console.log('Comment Data:', commentData);
      console.log('Endpoint:', AIRTABLE_COMMENTS_ENDPOINT);
      console.log('Has API Token:', !!AIRTABLE_API_TOKEN);
      console.log('Has Base ID:', !!AIRTABLE_BASE_ID);
      
      const newComment = {
        fields: {
          'Post_ID': postId,
          'Nombre': commentData.nombre,
          'Email': commentData.email,
          'Comentario': commentData.comentario,
          'Fecha_Comentario': new Date().toISOString().split('T')[0], // Solo fecha YYYY-MM-DD
          'Estado': 'Pendiente', // Los comentarios requieren moderación
          'Es_Spam': false, // Por defecto no es spam
          'Blog_Post': [postId], // Relación con la tabla Blog_Posts
          // 'Moderador' se asignará cuando se apruebe el comentario
          ...(commentData.respuestaA && { 'Respuesta_A': commentData.respuestaA })
        }
      };

      console.log('Payload a enviar:', JSON.stringify(newComment, null, 2));

      const response = await fetch(AIRTABLE_COMMENTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      console.log('✅ Comentario creado exitosamente:', data);

      // Refrescar comentarios después de agregar uno nuevo
      await fetchComments();
      
    } catch (err) {
      console.error('❌ Error completo adding comment:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return { 
    comments, 
    loading, 
    error, 
    addComment, 
    refetch: fetchComments 
  };
}
