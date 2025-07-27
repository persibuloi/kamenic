// Helper para enviar mensajes del formulario de contacto a Airtable
// Tabla: Datos Web, campos: Name, Email, Asunto, mensaje

const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_MESSAGES_TABLE = 'Datos Web';

const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_MESSAGES_TABLE}`;

export interface WebMessage {
  Name: string;
  Email: string;
  Asunto: string;
  mensaje: string;
}

export async function sendWebMessageToAirtable(data: WebMessage): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(AIRTABLE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name: data.Name,
          Email: data.Email,
          Asunto: data.Asunto,
          mensaje: data.mensaje,
        },
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Airtable error: ${errorText}` };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error desconocido' };
  }
}
