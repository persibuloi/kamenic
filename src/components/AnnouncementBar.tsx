import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export const AnnouncementBar: React.FC = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  const showBanner = !!settings?.mostrarBarraAnuncio && !!settings?.textoBarraAnuncio;
  const estado = settings?.estadoTienda;
  const estadoNormalized = (estado ?? '').toString().trim().toLowerCase();
  const isMaintenance = estadoNormalized === 'mantenimiento';
  const isClosed = estadoNormalized === 'cerrada';

  if (!showBanner && !isMaintenance && !isClosed) return null;

  const bg = isClosed
    ? 'bg-red-600'
    : isMaintenance
    ? 'bg-amber-500'
    : 'bg-gray-900';

  const text = isClosed
    ? 'Tienda cerrada temporalmente'
    : isMaintenance
    ? 'Mantenimiento en curso'
    : settings?.textoBarraAnuncio;

  return (
    <div className={`${bg} text-white text-sm w-full`}> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2">
        {(isMaintenance || isClosed) && <AlertCircle className="h-4 w-4" />}
        <span className="text-center">{text}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
