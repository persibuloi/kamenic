// Test del webhook de n8n
const webhookUrl = 'https://n8n-n8n.wppjp8.easypanel.host/webhook-test/f1811e79-cf48-4e5a-ab66-72ed4fb59dc6';

async function testWebhook() {
  console.log('Probando webhook:', webhookUrl);
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hola, este es un mensaje de prueba',
        timestamp: new Date().toISOString(),
        source: 'perfume-store-chatbot',
        userId: 'test-user-' + Date.now()
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text(); // Primero como texto para ver qué devuelve
    console.log('Respuesta raw:', data);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('Respuesta JSON:', jsonData);
    } catch (e) {
      console.log('La respuesta no es JSON válido');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testWebhook();
