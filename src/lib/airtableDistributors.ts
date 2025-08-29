export type DistributorLead = {
  Name: string;
  Email: string;
  Phone?: string;
  City?: string;
  Business?: boolean;
  Volume?: 'Bajo' | 'Medio' | 'Alto';
  Brands?: string[]; // multi-select
  Message?: string;
  Origen?: string; // e.g., web + UTM
  Estado?: 'Nuevo' | 'Contactado' | 'Calificado' | 'Descartado';
};

export async function sendDistributorLead(lead: DistributorLead): Promise<{ success: boolean; error?: string }>{
  try {
    const token = import.meta.env.VITE_AIRTABLE_API_TOKEN as string;
    const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID as string; // siempre la base principal
    const tableName = (import.meta.env.VITE_AIRTABLE_DISTRIBUTORS_TABLE as string) || 'LeadsDistribuidores';

    if (!token || !baseId) {
      return { success: false, error: 'Airtable no configurado: falta VITE_AIRTABLE_API_TOKEN o VITE_AIRTABLE_BASE_ID' };
    }

    const url = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`;

    const fields: Record<string, any> = {
      Name: lead.Name,
      Email: lead.Email,
    };
    if (lead.Phone) fields.Phone = lead.Phone;
    if (lead.City) fields.City = lead.City;
    if (typeof lead.Business === 'boolean') fields.Business = lead.Business;
    if (lead.Volume) fields.Volume = lead.Volume;
    if (lead.Brands && lead.Brands.length) fields.Brands = lead.Brands;
    if (lead.Message) fields.Message = lead.Message;
    if (lead.Origen) fields.Origen = lead.Origen;
    if (lead.Estado) fields.Estado = lead.Estado;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Airtable error (distributors):', err);
      return { success: false, error: err?.error?.message || 'Error al enviar lead' };
    }

    return { success: true };
  } catch (e: any) {
    console.error('sendDistributorLead exception:', e);
    return { success: false, error: e?.message || 'Error inesperado' };
  }
}
