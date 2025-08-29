import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useContact } from '../hooks/useContact';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface Props {
  className?: string;
}

export const ContactInfo: React.FC<Props> = ({ className }) => {
  const { contact, loading } = useContact();
  const { settings, loading: loadingSettings } = useSiteSettings();
  const fallback = {
    address: 'KameNic',
    phone: '+505 8219-3629',
    email: 'kamenic@gmail.com',
    horario: 'Lunes a Domingo: 9:00 AM - 7:00 PM',
  };
  const info = {
    address: contact?.address || fallback.address,
    phone: contact?.phone || fallback.phone,
    email: contact?.email || fallback.email,
    horario: settings?.horario || fallback.horario,
    mapsURL: settings?.mapsURL as string | undefined,
  };
  const viewMapUrl = info.mapsURL || (info.address ? `https://www.google.com/maps?q=${encodeURIComponent(info.address)}` : undefined);
  const horarioLines = (info.horario || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  return (
    <div className={className}>
      <h4 className="font-semibold text-lg mb-4 text-amber-400">Contacto</h4>
      <ul className="space-y-3">
        <li className="flex items-start text-gray-300">
          <Clock className="h-4 w-4 mr-2 text-amber-400 mt-0.5" />
          <div className="text-sm">
            {loadingSettings ? (
              'Cargando…'
            ) : horarioLines.length > 1 ? (
              <ul className="list-disc ml-4 space-y-1">
                {horarioLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <span className="whitespace-pre-line">{info.horario}</span>
            )}
          </div>
        </li>
        <li className="flex items-start text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-amber-400 mt-0.5" />
          <div className="text-sm">
            <div>{loading ? 'Cargando…' : info.address}</div>
            {!loading && viewMapUrl && (
              <a
                href={viewMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
              >
                Ver mapa
              </a>
            )}
          </div>
        </li>
        <li className="flex items-center text-gray-300">
          <Phone className="h-4 w-4 mr-2 text-amber-400" />
          {loading ? (
            <span className="text-sm">—</span>
          ) : (
            <a
              href={`tel:${info.phone.replace(/[^\d+]/g, '')}`}
              className="text-sm text-amber-300 hover:text-amber-200 underline underline-offset-2"
            >
              {info.phone}
            </a>
          )}
        </li>
        <li className="flex items-center text-gray-300">
          <Mail className="h-4 w-4 mr-2 text-amber-400" />
          {loading ? (
            <span className="text-sm">—</span>
          ) : (
            <a
              href={`mailto:${info.email}`}
              className="text-sm text-amber-300 hover:text-amber-200 underline underline-offset-2"
            >
              {info.email}
            </a>
          )}
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;
