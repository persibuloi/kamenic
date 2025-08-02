// Script de prueba para consultar directamente la API de Airtable
// y ver todos los campos disponibles

const AIRTABLE_API_TOKEN = process.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.VITE_AIRTABLE_TABLE_NAME;

if (!AIRTABLE_API_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
  console.error('❌ Variables de entorno faltantes:');
  console.error('VITE_AIRTABLE_API_TOKEN:', AIRTABLE_API_TOKEN ? '✅ Configurado' : '❌ Faltante');
  console.error('VITE_AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? '✅ Configurado' : '❌ Faltante');
  console.error('VITE_AIRTABLE_TABLE_NAME:', AIRTABLE_TABLE_NAME ? '✅ Configurado' : '❌ Faltante');
  process.exit(1);
}

const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

async function testAirtableAPI() {
  try {
    console.log('🔍 Consultando API de Airtable...');
    console.log('Endpoint:', AIRTABLE_ENDPOINT);
    
    const response = await fetch(`${AIRTABLE_ENDPOINT}?maxRecords=3`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('\n✅ Respuesta exitosa de Airtable API');
    console.log('📊 Total de registros obtenidos:', data.records.length);
    
    if (data.records.length > 0) {
      console.log('\n🔍 ANÁLISIS DEL PRIMER REGISTRO:');
      const firstRecord = data.records[0];
      
      console.log('ID del registro:', firstRecord.id);
      console.log('Fecha de creación:', firstRecord.createdTime);
      
      console.log('\n📋 TODOS LOS CAMPOS DISPONIBLES:');
      const allFields = Object.keys(firstRecord.fields);
      allFields.forEach((field, index) => {
        console.log(`${index + 1}. "${field}"`);
      });
      
      console.log('\n🔍 CAMPOS QUE CONTIENEN "DESCRIPCION" O "LARGA":');
      const descriptionFields = allFields.filter(field => 
        field.toLowerCase().includes('descripcion') || 
        field.toLowerCase().includes('larga') ||
        field.toLowerCase().includes('description') ||
        field.toLowerCase().includes('detalles')
      );
      
      if (descriptionFields.length > 0) {
        descriptionFields.forEach(field => {
          const value = firstRecord.fields[field];
          console.log(`\n📝 Campo: "${field}"`);
          console.log(`   Tipo: ${typeof value}`);
          if (typeof value === 'string') {
            console.log(`   Longitud: ${value.length} caracteres`);
            console.log(`   Contenido (primeros 200 chars): "${value.substring(0, 200)}${value.length > 200 ? '...' : ''}"`);
          } else {
            console.log(`   Valor:`, value);
          }
        });
      } else {
        console.log('❌ No se encontraron campos relacionados con descripción');
      }
      
      console.log('\n🔍 ANÁLISIS DE OTROS CAMPOS IMPORTANTES:');
      const importantFields = ['Descripción', 'Precio1', 'Marca', 'Género', 'Tipo Marca', 'Código KAME', 'Existencia Actual'];
      importantFields.forEach(field => {
        if (firstRecord.fields[field] !== undefined) {
          console.log(`✅ "${field}":`, firstRecord.fields[field]);
        } else {
          console.log(`❌ "${field}": NO ENCONTRADO`);
        }
      });
      
      console.log('\n🔍 ANÁLISIS DE LOS PRIMEROS 3 REGISTROS:');
      data.records.forEach((record, index) => {
        console.log(`\nRegistro ${index + 1} (ID: ${record.id}):`);
        
        // Buscar campo de descripción larga
        const possibleDescFields = ['Descripcion Larga', 'Descripción Larga', 'Description', 'Detalles'];
        let foundDescField = null;
        
        for (const field of possibleDescFields) {
          if (record.fields[field]) {
            foundDescField = field;
            break;
          }
        }
        
        if (foundDescField) {
          const value = record.fields[foundDescField];
          console.log(`  ✅ Descripción larga encontrada en "${foundDescField}"`);
          console.log(`  📏 Longitud: ${value.length} caracteres`);
          console.log(`  📝 Inicio: "${value.substring(0, 100)}..."`);
        } else {
          console.log(`  ❌ No se encontró descripción larga`);
        }
        
        // Mostrar otros campos importantes
        console.log(`  📦 Descripción: "${record.fields['Descripción'] || 'NO ENCONTRADO'}"`);
        console.log(`  🏷️ Código: "${record.fields['Código KAME'] || record.fields['CODIGO KAME'] || 'NO ENCONTRADO'}"`);
        console.log(`  📊 Stock: ${record.fields['Existencia Actual'] || 'NO ENCONTRADO'}`);
      });
      
    } else {
      console.log('❌ No se obtuvieron registros de la API');
    }
    
  } catch (error) {
    console.error('❌ Error al consultar la API de Airtable:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Ejecutar el test
testAirtableAPI();
