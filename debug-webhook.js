// Debug del webhook - Verificar configuración y conexión
console.log('=== DEBUG WEBHOOK ===');

// Verificar variables de entorno
console.log('Variables de entorno disponibles:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_N8N_WEBHOOK_URL:', process.env.VITE_N8N_WEBHOOK_URL);

// URL del webhook (la que debería estar en .env.local)
const webhookUrl = 'https://n8n-n8n.wppjp8.easypanel.host/webhook-test/f1811e79-cf48-4e5a-ab66-72ed4fb59dc6';

console.log('\n=== PROBANDO CONEXIÓN ===');
console.log('URL del webhook:', webhookUrl);

async function testWebhookConnection() {
  try {
    const payload = {
      message: 'Mensaje de prueba desde debug',
      timestamp: new Date().toISOString(),
      source: 'perfume-store-chatbot',
      userId: 'debug-user-' + Date.now()
    };

    console.log('\nPayload enviado:');
    console.log(JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('\n=== RESPUESTA ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const responseText = await response.text();
    console.log('\nRespuesta raw:', responseText);

    if (responseText) {
      try {
        const responseJson = JSON.parse(responseText);
        console.log('\nRespuesta JSON:');
        console.log(JSON.stringify(responseJson, null, 2));
      } catch (e) {
        console.log('La respuesta no es JSON válido');
      }
    }

    if (response.ok) {
      console.log('\n✅ CONEXIÓN EXITOSA');
    } else {
      console.log('\n❌ ERROR EN LA CONEXIÓN');
    }

  } catch (error) {
    console.log('\n❌ ERROR DE RED:');
    console.error(error);
  }
}

testWebhookConnection();
