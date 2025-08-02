// Test script para verificar la conexión con Blog_Comments en Airtable
require('dotenv').config();

const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_API_TOKEN = process.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_COMMENTS_TABLE_NAME = 'Blog_Comments';

console.log('=== TEST COMENTARIOS AIRTABLE ===');
console.log('Base ID:', AIRTABLE_BASE_ID ? 'Configurado ✓' : 'NO CONFIGURADO ❌');
console.log('API Token:', AIRTABLE_API_TOKEN ? 'Configurado ✓' : 'NO CONFIGURADO ❌');
console.log('Tabla:', AIRTABLE_COMMENTS_TABLE_NAME);

const AIRTABLE_COMMENTS_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_COMMENTS_TABLE_NAME}`;
console.log('Endpoint:', AIRTABLE_COMMENTS_ENDPOINT);

async function testCommentsConnection() {
  try {
    console.log('\n=== PROBANDO CONEXIÓN ===');
    
    // 1. Probar GET (listar comentarios)
    console.log('1. Probando GET...');
    const getResponse = await fetch(AIRTABLE_COMMENTS_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GET Status:', getResponse.status);
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('GET Success ✓');
      console.log('Comentarios existentes:', getData.records?.length || 0);
      
      if (getData.records && getData.records.length > 0) {
        console.log('Primer comentario:', getData.records[0].fields);
      }
    } else {
      const errorText = await getResponse.text();
      console.log('GET Error ❌:', errorText);
      return;
    }
    
    // 2. Probar POST (crear comentario de prueba)
    console.log('\n2. Probando POST...');
    const testComment = {
      fields: {
        'Post_ID': 'test-post-id',
        'Nombre': 'Usuario Prueba',
        'Email': 'test@example.com',
        'Comentario': 'Este es un comentario de prueba desde el script',
        'Fecha_Comentario': new Date().toISOString(),
        'Estado': 'Pendiente'
      }
    };
    
    console.log('Enviando comentario:', testComment);
    
    const postResponse = await fetch(AIRTABLE_COMMENTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testComment)
    });
    
    console.log('POST Status:', postResponse.status);
    
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log('POST Success ✓');
      console.log('Comentario creado con ID:', postData.id);
      console.log('Datos guardados:', postData.fields);
    } else {
      const errorText = await postResponse.text();
      console.log('POST Error ❌:', errorText);
    }
    
  } catch (error) {
    console.error('Error en la prueba:', error);
  }
}

// Ejecutar test
testCommentsConnection();
