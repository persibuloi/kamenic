import React, { useState } from 'react';
import { DistributorForm } from './DistributorForm';

export function DistributorGate() {
  const [city, setCity] = useState('');
  const [business, setBusiness] = useState<boolean | null>(null);
  const [volume, setVolume] = useState<'Bajo' | 'Medio' | 'Alto' | null>(null);

  const qualifies = business === true && (volume === 'Medio' || volume === 'Alto');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Pre‑calificación</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">¿Tienes negocio?</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBusiness(true)}
              className={`px-3 py-2 rounded-lg border ${business === true ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'border-gray-300 text-gray-700'}`}
            >Sí</button>
            <button
              type="button"
              onClick={() => setBusiness(false)}
              className={`px-3 py-2 rounded-lg border ${business === false ? 'bg-gray-50 border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}`}
            >No</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            placeholder="Managua, León..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volumen mensual estimado</label>
          <div className="flex gap-2 flex-wrap">
            {(['Bajo','Medio','Alto'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setVolume(v)}
                className={`px-3 py-2 rounded-lg border ${volume === v ? 'bg-amber-50 border-amber-300 text-amber-800' : 'border-gray-300 text-gray-700'}`}
              >{v}</button>
            ))}
          </div>
        </div>
      </div>

      {qualifies ? (
        <div>
          <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">¡Excelente! Completa el formulario y nos pondremos en contacto contigo.</div>
          <DistributorForm presetCity={city} presetBusiness={business ?? undefined} presetVolume={volume ?? undefined as any} />
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          <p className="mb-3">Si estás iniciando o aún no tienes un negocio establecido, conversemos por WhatsApp y te orientamos sobre el mejor camino para distribuir KAME.</p>
          <a
            href={(import.meta.env.VITE_WHATSAPP_DISTRIBUIDORES as string) || 'https://wa.me/50582193629?text=Quiero%20informaci%C3%B3n%20sobre%20distribuci%C3%B3n'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Hablar por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
