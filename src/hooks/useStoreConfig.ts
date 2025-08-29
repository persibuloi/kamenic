import { useEffect, useMemo, useState } from 'react';

// Reuse Airtable env vars
const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

// Dedicated Settings table name (create it in Airtable)
const SETTINGS_TABLE = 'Settings';

const SETTINGS_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(SETTINGS_TABLE)}`;
const LS_KEY = 'store_config_cache_v1';
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

export type StoreConfig = {
  freeShippingThreshold?: number; // In the same currency as cart totals
  currency?: string; // e.g., 'USD'
  freeShippingEffectiveFrom?: string;
  freeShippingEffectiveTo?: string;
  freeShippingEnabled?: boolean;
  raw?: Record<string, any>;
};

function safeParseNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function loadCache(): { data?: StoreConfig; ts?: number } {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCache(data: StoreConfig) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

async function fetchSettingsFromAirtable(): Promise<StoreConfig> {
  if (!AIRTABLE_API_TOKEN || !AIRTABLE_BASE_ID) {
    return {};
  }

  // Get up to 100 settings
  const url = new URL(SETTINGS_ENDPOINT);
  url.searchParams.set('pageSize', '100');

  const resp = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!resp.ok) throw new Error(`Airtable Settings error ${resp.status}`);
  const json = await resp.json();
  const records: any[] = json.records || [];
  if (import.meta.env.DEV) {
    console.debug('[StoreConfig] Airtable Settings fetched:', { count: records.length });
  }

  // Helper to validate date window
  const now = Date.now();
  const isActive = (f: any) => {
    // Enabled
    const enabled = f.enabled === true || f.enabled === 'true' || f.enabled === 1;
    if (!enabled) return false;
    // Date window (optional)
    const fromRaw = f.effective_from || f.from || f.start || f.inicio;
    const toRaw = f.effective_to || f.to || f.end || f.fin;
    const fromOk = !fromRaw || (new Date(fromRaw)).getTime() <= now;
    const toOk = !toRaw || (new Date(toRaw)).getTime() >= now;
    return fromOk && toOk;
  };

  // Build a map by key with only active settings
  const map: Record<string, any> = {};
  for (const r of records) {
    const f = r.fields || {};
    const key = (f.key || '').toString().trim();
    if (!key) continue;
    const active = isActive(f);
    if (import.meta.env.DEV) {
      console.debug('[StoreConfig] record', key, {
        enabled: f.enabled,
        from: f.effective_from || f.from || f.start || f.inicio,
        to: f.effective_to || f.to || f.end || f.fin,
        active,
      });
    }
    if (!active) continue;
    // Prefer the latest record by updated time if multiple
    const existing = map[key];
    const existingUpdated = existing?.updated_at || existing?.last_modified_time || existing?.lastModified || existing?.__ts;
    const currentUpdated = f.updated_at || f.last_modified_time || f.lastModified || r?.modifiedTime || r?.createdTime;
    if (!existing) {
      map[key] = f;
    } else {
      const exTs = existingUpdated ? new Date(existingUpdated).getTime() : 0;
      const curTs = currentUpdated ? new Date(currentUpdated).getTime() : 0;
      if (curTs >= exTs) map[key] = f;
    }
  }

  const thresholdRec = map['free_shipping_threshold'];
  if (import.meta.env.DEV) {
    const keys = Object.keys(map);
    console.debug('[StoreConfig] active keys:', keys);
    if (!thresholdRec) {
      console.warn('[StoreConfig] free_shipping_threshold not active or missing. Using fallbacks if any.');
    }
  }
  const threshold = safeParseNumber(thresholdRec?.value_number ?? thresholdRec?.value ?? thresholdRec?.value_text);
  const currency = (thresholdRec?.currency || map['currency_default']?.value_text || map['currency_default']?.value)?.toString().toUpperCase();
  const freeShippingEffectiveFrom = thresholdRec?.effective_from || thresholdRec?.from || thresholdRec?.start || thresholdRec?.inicio;
  const freeShippingEffectiveTo = thresholdRec?.effective_to || thresholdRec?.to || thresholdRec?.end || thresholdRec?.fin;
  const whatsappPhoneRaw = (map['whatsapp_commerce_phone']?.value_text || map['whatsapp_commerce_phone']?.value || map['whatsapp_phone']?.value_text || map['whatsapp_phone']?.value);
  const whatsappPhone = whatsappPhoneRaw ? String(whatsappPhoneRaw).replace(/[^0-9]/g, '') : undefined;

  const config: StoreConfig = {
    freeShippingThreshold: thresholdRec ? threshold : undefined,
    currency,
    freeShippingEffectiveFrom,
    freeShippingEffectiveTo,
    freeShippingEnabled: Boolean(thresholdRec),
    raw: { ...map, whatsappPhone },
  };

  return config;
}

export function useStoreConfig(ttlMs: number = DEFAULT_TTL_MS) {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Allow QA override via querystring: ?fs=180
  const qsThreshold = useMemo(() => {
    const url = new URL(window.location.href);
    const param = url.searchParams.get('fs');
    return safeParseNumber(param ?? undefined);
  }, []);

  useEffect(() => {
    const cached = loadCache();
    const isFresh = cached.ts && Date.now() - (cached.ts as number) < ttlMs;
    if (cached.data && isFresh) {
      setConfig(cached.data);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchSettingsFromAirtable();
        if (!cancelled) {
          saveCache(data);
          setConfig(data);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error cargando configuración');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ttlMs]);

  // Compose final threshold with priority: querystring > Airtable > env > default
  const finalThreshold = useMemo(() => {
    if (qsThreshold != null) return qsThreshold;
    if (config?.freeShippingThreshold != null) return config.freeShippingThreshold;
    const envRaw = (import.meta.env.VITE_FREE_SHIPPING_THRESHOLD as any);
    const envParsed = safeParseNumber(envRaw);
    return envParsed ?? 150; // default in USD
  }, [qsThreshold, config?.freeShippingThreshold]);

  const currency = useMemo(() => {
    return config?.currency || 'USD';
  }, [config?.currency]);

  const whatsappPhone = useMemo(() => {
    const fromConfig = (config?.raw as any)?.whatsappPhone as string | undefined;
    const envRaw = import.meta.env.VITE_WHATSAPP_PHONE as any;
    const envPhone = envRaw ? String(envRaw).replace(/[^0-9]/g, '') : undefined;
    return fromConfig || envPhone || '50582193629';
  }, [config?.raw]);

  const refresh = async () => {
    try {
      const data = await fetchSettingsFromAirtable();
      saveCache(data);
      setConfig(data);
    } catch (e) {
      // swallow
    }
  };

  return { config, freeShippingThreshold: finalThreshold, currency, whatsappPhone, loading, error, refresh, freeShippingEnabled: !!config?.freeShippingEnabled };
}
