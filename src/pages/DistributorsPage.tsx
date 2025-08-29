import React from 'react';
import { DistributorGate } from '../components/DistributorGate';
import { CheckCircle, Sparkles } from 'lucide-react';

export function DistributorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Accent blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-amber-100/50 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                <Sparkles className="h-4 w-4" /> Programa de Distribuidores KAME
              </div>
              <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
                Crece con una marca que encanta a tus clientes
              </h1>
              <p className="mt-4 text-lg text-gray-700 max-w-xl">
                Únete a un catálogo con alta rotación y márgenes competitivos. Te acompañamos con materiales, soporte y recomendaciones para impulsar tus ventas.
              </p>
              <ul className="mt-6 space-y-3 text-gray-700">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" /> Márgenes atractivos y sostenibles</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" /> Portafolio curado con demanda real</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" /> Soporte y materiales de marketing</li>
              </ul>
            </div>

            <div className="relative">
              {/* Card */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-7 border border-amber-100 shadow-xl">
                <h2 className="text-xl font-semibold mb-2">¿Eres candidato?</h2>
                <p className="text-sm text-gray-600 mb-4">Responde estas preguntas rápidas para continuar.</p>
                <DistributorGate />
              </div>
              {/* Decorative image */}
              <img
                src="/images/hero-perfume.jpg"
                alt="Fragancias KAME"
                className="hidden md:block absolute -z-10 -right-10 -top-10 w-56 h-56 object-cover rounded-2xl shadow-lg opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs breves */}
      <section className="bg-white border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-xl font-semibold mb-6">Preguntas frecuentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <p className="font-medium">¿Cuál es el pedido mínimo?</p>
              <p className="text-gray-600">Definimos un mínimo accesible para iniciar según tu volumen y ciudad.</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <p className="font-medium">¿Ofrecen capacitación?</p>
              <p className="text-gray-600">Sí, te damos soporte, guías y materiales para ayudarte a vender mejor.</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <p className="font-medium">¿Cómo es la logística?</p>
              <p className="text-gray-600">Coordinamos envíos a tu ciudad con tiempos y costos optimizados.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
