import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { sendWebMessageToAirtable, WebMessage } from '../lib/airtableMessages';
import { useContact } from '../hooks/useContact';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function ContactPage() {
  const { contact, loading: loadingContact, error: contactError } = useContact();
  const { settings, loading: loadingSettings, error: settingsError } = useSiteSettings();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2000);
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Validación básica
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Por favor, completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }
    const data: WebMessage = {
      Name: form.name,
      Email: form.email,
      Asunto: form.subject,
      mensaje: form.message,
    };
    const result = await sendWebMessageToAirtable(data);
    if (result.success) {
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      setError(result.error || 'Error al enviar el mensaje.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte a encontrar tu fragancia perfecta
          </p>
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Información de Contacto
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                    {loadingContact ? (
                      <p className="text-gray-400">Cargando…</p>
                    ) : (
                      <p className="text-gray-600">
                        {contact?.name || 'KameNic'}<br />
                        {contact?.address || 'Perfumes y Fragancias'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                    {loadingContact ? (
                      <p className="text-gray-400">Cargando…</p>
                    ) : (
                      <div>
                        <p className="text-gray-600">
                          <a
                            href={`tel:${(contact?.phone || '+505 8219-3629').toString().replace(/[^\d+]/g, '')}`}
                            className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
                          >
                            {contact?.phone || '+505 8219-3629'}
                          </a>
                          <br />
                          {contact?.whatsappNumber ? 'WhatsApp disponible' : ''}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const phoneToCopy = contact?.phone || '+505 8219-3629';
                            navigator.clipboard?.writeText(phoneToCopy);
                            showToast('Teléfono copiado');
                          }}
                          className="mt-2 inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 transition-colors text-sm"
                        >
                          Copiar teléfono
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    {loadingContact ? (
                      <p className="text-gray-400">Cargando…</p>
                    ) : (
                      <p className="text-gray-600">
                        <a
                          href={`mailto:${contact?.email || 'kamenic@gmail.com'}`}
                          className="text-amber-700 hover:text-amber-800 underline underline-offset-2"
                        >
                          {contact?.email || 'kamenic@gmail.com'}
                        </a>
                        <br />
                        Consultas y pedidos
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horarios de Atención</h3>
                    {loadingContact || loadingSettings ? (
                      <p className="text-gray-400">Cargando…</p>
                    ) : (
                      (() => {
                        const text = contact?.businessHours || settings?.horario || 'Lunes a Domingo: 9:00 AM - 7:00 PM';
                        const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
                        return lines.length > 1 ? (
                          <ul className="list-disc ml-5 text-gray-600 space-y-1">
                            {lines.map((l, i) => (
                              <li key={i}>{l}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600 whitespace-pre-line">{text}</p>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp destacado */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">WhatsApp</h3>
                  <p className="text-green-100">Respuesta inmediata</p>
                </div>
              </div>
              <p className="text-green-100 mb-6">
                ¿Tienes dudas sobre nuestros productos? ¡Escríbenos y te ayudamos a elegir el perfume perfecto!
              </p>
              <a 
                href={contact?.whatsappLink || 'https://wa.me/50582193629'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Enviar Mensaje
              </a>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envíanos un Mensaje
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {success && (
                <div className="bg-green-100 text-green-800 p-3 rounded mb-2 text-center font-semibold">
                  ¡Mensaje enviado correctamente! Te responderemos pronto.
                </div>
              )}
              {error && (
                <div className="bg-red-100 text-red-800 p-3 rounded mb-2 text-center font-semibold">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="+57 300 123 4567"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un tema</option>
                  <option value="consulta-producto">Consulta sobre producto</option>
                  <option value="asesoramiento">Asesoramiento personalizado</option>
                  <option value="pedido">Realizar pedido</option>
                  <option value="entrega">Información de entrega</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                * Campos obligatorios. Responderemos en un plazo máximo de 24 horas.
              </p>
            </form>
          </div>
        </div>

        {/* Mapa de ubicación o información adicional */}
        {(() => {
          const addressForMap = contact?.address || '';
          const mapsURL = settings?.mapsURL || '';
          const isShortMaps = mapsURL.includes('maps.app.goo.gl');
          const viewUrl = mapsURL || (addressForMap ? `https://www.google.com/maps?q=${encodeURIComponent(addressForMap)}` : '');
          // Usar URL embebible estable. Evitar maps.app.goo.gl dentro del iframe.
          const embedBaseFromAddress = addressForMap ? `https://www.google.com/maps?q=${encodeURIComponent(addressForMap)}&output=embed` : '';
          const embedUrl = isShortMaps ? (embedBaseFromAddress || '') : (viewUrl ? `${viewUrl}${viewUrl.includes('?') ? '&' : '?'}output=embed` : '');
          if (viewUrl) {
            return (
              <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-amber-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Ubicación</h2>
                <div className="w-full rounded-2xl overflow-hidden border border-gray-200">
                  <div className="aspect-[16/9] w-full">
                    <iframe
                      src={embedUrl || undefined}
                      title="Ubicación en Google Maps"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ border: 0 }}
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                    >
                      Abrir en Google Maps
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressForMap || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 transition-colors"
                    >
                      Cómo llegar
                    </a>
                    {addressForMap && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(addressForMap);
                          showToast('Dirección copiada');
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 transition-colors"
                      >
                        Copiar dirección
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Por qué elegir KameNic?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Productos Originales</h3>
                  <p className="text-gray-600">Garantía del 100% en la autenticidad de todos nuestros perfumes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Entrega Rápida</h3>
                  <p className="text-gray-600">Envíos seguros y rápidos a todo Nicaragua en 24-48 horas</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Soporte Personalizado</h3>
                  <p className="text-gray-600">Asesoramiento experto para encontrar tu fragancia ideal</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      {/* Toast notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
