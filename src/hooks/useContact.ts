import { useEffect, useState } from 'react';

export interface ContactInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappNumber?: string; // raw number e.g., 50582193629
  whatsappLink?: string;   // full wa.me link
  businessHours?: string;  // Horarios de atención
}

const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN as string | undefined;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID as string | undefined;
const AIRTABLE_CONTACT_BASE_ID = import.meta.env.VITE_AIRTABLE_CONTACT_BASE_ID as string | undefined; // opcional: base separada
const AIRTABLE_CONTACT_TABLE = (import.meta.env.VITE_AIRTABLE_CONTACT_TABLE as string | undefined) || 'ContactInfo';

function getStringField(fields: Record<string, any>, candidates: string[]): string | undefined {
  for (const key of candidates) {
    const v = fields[key];
    if (!v) continue;
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (Array.isArray(v) && v.length > 0) return String(v[0]).trim();
    if (typeof v === 'object' && typeof v.value === 'string') return v.value.trim();
  }
  return undefined;
}

function transformContactRecord(record: any): ContactInfo {
  const f = record?.fields || {};
  const name = getStringField(f, ['Nombre', 'Name', 'nombre']);
  const address = getStringField(f, ['Dirección', 'Direccion', 'Address', 'address']);
  const phone = getStringField(f, ['Teléfono', 'Telefono', 'Phone', 'phone']);
  const email = getStringField(f, ['Email', 'Correo', 'correo']);
  const instagramUrl = getStringField(f, ['Instagram', 'instagram', 'IG']);
  const facebookUrl = getStringField(f, ['Facebook', 'facebook', 'FB']);
  const whatsappNumber = getStringField(f, ['WhatsApp', 'Whatsapp', 'whatsapp', 'WA']);
  const businessHours = getStringField(
    f,
    [
      'Horario',
      'Horarios',
      'Horario de Atención',
      'Horarios de Atención',
      'Horario de atencion',
      'Horarios de atencion',
      'Hours',
      'Opening Hours',
      'Business Hours',
    ]
  );

  let whatsappLink: string | undefined = undefined;
  if (whatsappNumber) {
    const raw = whatsappNumber.replace(/\D/g, '');
    whatsappLink = `https://wa.me/${raw}`;
  }

  return { name, address, phone, email, instagramUrl, facebookUrl, whatsappNumber, whatsappLink, businessHours };
}

export function useContact() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError(null);

      const effectiveBaseId = AIRTABLE_CONTACT_BASE_ID || AIRTABLE_BASE_ID;
      if (!AIRTABLE_API_TOKEN || !effectiveBaseId) {
        throw new Error('Faltan variables de entorno de Airtable (token/baseId para contacto).');
      }

      const endpoint = `https://api.airtable.com/v0/${effectiveBaseId}/${encodeURIComponent(AIRTABLE_CONTACT_TABLE)}`;
      const url = new URL(endpoint);
      url.searchParams.set('maxRecords', '1');

      if (import.meta.env.DEV) {
        console.log('[useContact] Endpoint:', url.toString());
        console.log('[useContact] Env set:', {
          hasToken: !!AIRTABLE_API_TOKEN,
          baseId: effectiveBaseId,
          table: AIRTABLE_CONTACT_TABLE,
        });
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        let body: string | undefined;
        try {
          body = await res.text();
        } catch (_) {
          body = undefined;
        }
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[useContact] Error response:', res.status, res.statusText, body || '');
        }
        throw new Error(`Error ${res.status}: ${res.statusText}${body ? ` - ${body}` : ''}`);
      }

      const data = await res.json();
      const record = (data.records && data.records[0]) || null;
      if (import.meta.env.DEV) {
        console.log('[useContact] Records length:', data.records?.length || 0);
        if (record) {
          console.log('[useContact] First record fields:', record.fields);
        }
      }
      if (record) {
        setContact(transformContactRecord(record));
      } else {
        setContact(null);
      }
    } catch (e: any) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[useContact] Fetch failed:', e);
      }
      setError(e?.message || 'Error cargando contacto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  return { contact, loading, error, refetch: fetchContact };
}

export default useContact;
