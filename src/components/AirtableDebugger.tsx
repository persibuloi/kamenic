import React, { useState } from 'react';

const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

const AirtableDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAirtableAPI = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo(null);

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
        const firstRecord = data.records[0];
        
        console.log('\n🔍 ANÁLISIS DEL PRIMER REGISTRO:');
        console.log('ID del registro:', firstRecord.id);
        
        const allFields = Object.keys(firstRecord.fields);
        console.log('\n📋 TODOS LOS CAMPOS DISPONIBLES:');
        allFields.forEach((field, index) => {
          console.log(`${index + 1}. "${field}"`);
        });
        
        const descriptionFields = allFields.filter(field => 
          field.toLowerCase().includes('descripcion') || 
          field.toLowerCase().includes('larga') ||
          field.toLowerCase().includes('description') ||
          field.toLowerCase().includes('detalles')
        );
        
        console.log('\n🔍 CAMPOS QUE CONTIENEN "DESCRIPCION" O "LARGA":');
        const descriptionFieldsInfo: any[] = [];
        
        if (descriptionFields.length > 0) {
          descriptionFields.forEach(field => {
            const value = firstRecord.fields[field];
            const fieldInfo = {
              name: field,
              type: typeof value,
              length: typeof value === 'string' ? value.length : null,
              content: typeof value === 'string' ? value.substring(0, 200) : value
            };
            descriptionFieldsInfo.push(fieldInfo);
            
            console.log(`\n📝 Campo: "${field}"`);
            console.log(`   Tipo: ${typeof value}`);
            if (typeof value === 'string') {
              console.log(`   Longitud: ${value.length} caracteres`);
              console.log(`   Contenido: "${value.substring(0, 200)}${value.length > 200 ? '...' : ''}"`);
            } else {
              console.log(`   Valor:`, value);
            }
          });
        }
        
        // Analizar todos los registros
        const recordsAnalysis = data.records.map((record: any, index: number) => {
          const possibleDescFields = ['Descripcion Larga', 'Descripción Larga', 'Description', 'Detalles'];
          let foundDescField = null;
          let descContent = null;
          
          for (const field of possibleDescFields) {
            if (record.fields[field]) {
              foundDescField = field;
              descContent = record.fields[field];
              break;
            }
          }
          
          // Manejar diferentes tipos de datos
          let processedContent = null;
          let contentLength = 0;
          let contentType = 'unknown';
          
          if (descContent) {
            contentType = typeof descContent;
            
            if (typeof descContent === 'string') {
              processedContent = descContent.substring(0, 100);
              contentLength = descContent.length;
            } else if (Array.isArray(descContent)) {
              contentType = 'array';
              contentLength = descContent.length;
              processedContent = JSON.stringify(descContent).substring(0, 100);
            } else if (typeof descContent === 'object') {
              contentType = 'object';
              processedContent = JSON.stringify(descContent).substring(0, 100);
              contentLength = JSON.stringify(descContent).length;
            } else {
              processedContent = String(descContent).substring(0, 100);
              contentLength = String(descContent).length;
            }
          }
          
          return {
            id: record.id,
            index: index + 1,
            descripcion: record.fields['Descripción'] || 'NO ENCONTRADO',
            codigoKame: record.fields['Código KAME'] || record.fields['CODIGO KAME'] || 'NO ENCONTRADO',
            stock: record.fields['Existencia Actual'] || 'NO ENCONTRADO',
            hasDescripcionLarga: !!foundDescField,
            descripcionLargaField: foundDescField,
            descripcionLargaType: contentType,
            descripcionLargaLength: contentLength,
            descripcionLargaPreview: processedContent,
            descripcionLargaRaw: descContent
          };
        });
        
        setDebugInfo({
          totalRecords: data.records.length,
          allFields,
          descriptionFields: descriptionFieldsInfo,
          recordsAnalysis,
          rawFirstRecord: firstRecord.fields
        });
        
      } else {
        setError('No se obtuvieron registros de la API');
      }
      
    } catch (err: any) {
      console.error('❌ Error al consultar la API de Airtable:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      background: 'white', 
      border: '2px solid #ccc', 
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <h2>🔍 Airtable API Debugger</h2>
      
      <button 
        onClick={testAirtableAPI}
        disabled={loading}
        style={{
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Consultando...' : 'Consultar API de Airtable'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {debugInfo && (
        <div>
          <h3>📊 Resultados:</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>Total de registros:</strong> {debugInfo.totalRecords}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>📋 Todos los campos ({debugInfo.allFields.length}):</strong>
            <ul style={{ maxHeight: '150px', overflow: 'auto', fontSize: '12px' }}>
              {debugInfo.allFields.map((field: string, index: number) => (
                <li key={index}>"{field}"</li>
              ))}
            </ul>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>🔍 Campos de descripción encontrados:</strong>
            {debugInfo.descriptionFields.length > 0 ? (
              <ul>
                {debugInfo.descriptionFields.map((field: any, index: number) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <strong>"{field.name}"</strong><br/>
                    Tipo: {field.type}<br/>
                    {field.length && `Longitud: ${field.length} caracteres`}<br/>
                    <div style={{ fontSize: '11px', background: '#f5f5f5', padding: '5px', marginTop: '5px' }}>
                      {field.content}...
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: 'red' }}>❌ No se encontraron campos de descripción</div>
            )}
          </div>
          
          <div>
            <strong>📝 Análisis de registros:</strong>
            {debugInfo.recordsAnalysis.map((record: any) => (
              <div key={record.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '10px 0',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>Registro {record.index}</strong><br/>
                ID: {record.id}<br/>
                Descripción: {record.descripcion}<br/>
                Código KAME: {record.codigoKame}<br/>
                Stock: {record.stock}<br/>
                <strong>Descripción Larga: {record.hasDescripcionLarga ? '✅ SÍ TIENE' : '❌ NO TIENE'}</strong><br/>
                {record.hasDescripcionLarga && (
                  <>
                    Campo: "{record.descripcionLargaField}"<br/>
                    Tipo: {record.descripcionLargaType}<br/>
                    Longitud: {record.descripcionLargaLength} {record.descripcionLargaType === 'array' ? 'elementos' : 'caracteres'}<br/>
                    <div style={{ background: '#e8f5e8', padding: '5px', marginTop: '5px', fontSize: '10px' }}>
                      <strong>Vista previa:</strong><br/>
                      {record.descripcionLargaPreview}...
                    </div>
                    <div style={{ background: '#f0f0f0', padding: '5px', marginTop: '5px', fontSize: '10px' }}>
                      <strong>Datos raw:</strong><br/>
                      {JSON.stringify(record.descripcionLargaRaw, null, 2).substring(0, 200)}...
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirtableDebugger;
