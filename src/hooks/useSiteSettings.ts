import { useEffect, useState } from 'react';

export type StoreState = 'Activa' | 'Mantenimiento' | 'Cerrada' | string;

export interface SiteSettings {
  mostrarBarraAnuncio?: boolean;
  textoBarraAnuncio?: string;
  estadoTienda?: StoreState;
  mensajeWhatsApp?: string;
  mapsURL?: string;
  horario?: string;
}

const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN as string | undefined;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID as string | undefined;
const AIRTABLE_SETTINGS_BASE_ID = import.meta.env.VITE_AIRTABLE_SETTINGS_BASE_ID as string | undefined; // opcional: base separada para SiteSettings
const AIRTABLE_SETTINGS_TABLE = (import.meta.env.VITE_AIRTABLE_SETTINGS_TABLE as string | undefined) || 'SiteSettings';

function getField<T = any>(fields: Record<string, any>, candidates: string[]): any {
  for (const k of candidates) {
    const v = fields[k];
    if (v === undefined || v === null) continue;
    // checkbox
    if (typeof v === 'boolean') return v;
    // single/multi text
    if (typeof v === 'string') return v.trim();
    if (Array.isArray(v) && v.length > 0) return v[0];
    if (typeof v === 'object' && typeof v.value === 'string') return v.value.trim();
  }
  return undefined;
}

function transform(record: any): SiteSettings {
  const f = record?.fields || {};
  const mostrarBarraAnuncio = Boolean(getField(f, ['Mostrar Barra Anuncio', 'MostrarBarraAnuncio', 'mostrarBarraAnuncio']));
  const textoBarraAnuncio = getField<string>(f, ['Texto Barra Anuncio', 'TextoBarraAnuncio', 'textoBarraAnuncio']);
  const estadoTienda = getField<string>(f, ['Estado Tienda', 'EstadoTienda', 'estadoTienda']);
  const mensajeWhatsApp = getField<string>(f, ['Mensaje WhatsApp', 'MensajeWhatsApp', 'mensajeWhatsApp']);
  const mapsURL = getField<string>(f, ['Maps URL', 'MapsURL', 'Ubicación Maps URL', 'mapsURL']);
  const horario = getField<string>(f, ['Horario', 'horario']);

  return { mostrarBarraAnuncio, textoBarraAnuncio, estadoTienda, mensajeWhatsApp, mapsURL, horario };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const effectiveBaseId = AIRTABLE_SETTINGS_BASE_ID || AIRTABLE_BASE_ID;
      if (!AIRTABLE_API_TOKEN || !effectiveBaseId) {
        throw new Error('Faltan variables de entorno de Airtable para SiteSettings.');
      }
      const endpoint = `https://api.airtable.com/v0/${effectiveBaseId}/${encodeURIComponent(AIRTABLE_SETTINGS_TABLE)}`;
      const url = new URL(endpoint);
      // Traer algunos registros y filtrar en cliente para evitar 422 por fórmulas/campos
      url.searchParams.set('maxRecords', '10');

      if (import.meta.env.DEV) {
        console.log('[useSiteSettings] Endpoint:', url.toString());
        console.log('[useSiteSettings] Env set:', {
          hasToken: !!AIRTABLE_API_TOKEN,
          baseId: effectiveBaseId,
          table: AIRTABLE_SETTINGS_TABLE,
        });
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const records = Array.isArray(data.records) ? data.records : [];
      // Buscar registro activo por campos comunes
      let record = records.find((r: any) => {
        const f = r?.fields || {};
        return Boolean(f['Activo'] || f['Active'] || f['active']);
      }) || records[0];
      if (import.meta.env.DEV) {
        console.log('[useSiteSettings] Records length:', data.records?.length || 0);
        if (record) {
          console.log('[useSiteSettings] First record fields:', record.fields);
        }
      }
      setSettings(record ? transform(record) : null);
    } catch (e: any) {
      setError(e?.message || 'Error cargando SiteSettings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  return { settings, loading, error, refetch: fetchSettings };
}

export default useSiteSettings;
