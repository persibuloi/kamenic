import React, { useState } from 'react';
import { sendDistributorLead, DistributorLead } from '../lib/airtableDistributors';
import { LoadingSpinner } from './LoadingSpinner';

interface DistributorFormProps {
  presetCity?: string;
  presetBusiness?: boolean;
  presetVolume?: 'Bajo' | 'Medio' | 'Alto';
}

export function DistributorForm({ presetCity, presetBusiness, presetVolume }: DistributorFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: presetCity || '',
    business: typeof presetBusiness === 'boolean' ? presetBusiness : true,
    volume: presetVolume || 'Medio' as 'Bajo' | 'Medio' | 'Alto',
    brands: [] as string[],
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError('Nombre y email son obligatorios.');
      return;
    }

    setLoading(true);
    const origen = ((): string => {
      const params = new URLSearchParams(window.location.search);
      const utm = ['utm_source', 'utm_medium', 'utm_campaign']
        .map((k) => (params.get(k) ? `${k}=${params.get(k)}` : null))
        .filter(Boolean)
        .join('&');
      return `web${utm ? '|' + utm : ''}`;
    })();

    const payload: DistributorLead = {
      Name: form.name,
      Email: form.email,
      Phone: form.phone || undefined,
      City: form.city || undefined,
      Business: form.business,
      Volume: form.volume,
      Brands: form.brands.length ? form.brands : undefined,
      Message: form.message || undefined,
      Origen: origen,
      Estado: 'Nuevo',
    };

    const res = await sendDistributorLead(payload);
    if (!res.success) {
      setError(res.error || 'Error al enviar. Intenta nuevamente.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (success)
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">¡Gracias! Recibimos tu solicitud</h3>
        <p className="mb-4">En breve te contactaremos para continuar el proceso.</p>
        <a
          href={(import.meta.env.VITE_WHATSAPP_DISTRIBUIDORES as string) || 'https://wa.me/50582193629?text=Hola%20quiero%20ser%20distribuidor%20KAME'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Hablar por WhatsApp
        </a>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            placeholder="+505..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <input
            id="business"
            type="checkbox"
            checked={form.business}
            onChange={(e) => setForm({ ...form, business: e.target.checked })}
            className="h-4 w-4 text-amber-600 border-gray-300 rounded"
          />
          <label htmlFor="business" className="text-sm text-gray-700">Tengo negocio</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volumen</label>
          <select
            value={form.volume}
            onChange={(e) => setForm({ ...form, volume: e.target.value as 'Bajo' | 'Medio' | 'Alto' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marcas de interés</label>
          <input
            type="text"
            placeholder="Ej: Lattafa, Montale"
            value={form.brands.join(', ')}
            onChange={(e) => setForm({ ...form, brands: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          placeholder="Cuéntanos brevemente sobre tu negocio y necesidades"
        />
      </div>

      <div className="text-xs text-gray-500">Al enviar aceptas ser contactado por KAME para fines comerciales.</div>

      <button
        type="submit"
        className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
      >
        Enviar solicitud
      </button>
    </form>
  );
}
