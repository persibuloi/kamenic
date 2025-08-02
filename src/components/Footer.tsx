import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/kame-logo.png" alt="KAME Logo" className="h-10 w-10 object-contain" style={{ filter: 'drop-shadow(0 0 2em #00000033)' }} />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">KAME</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Descubre fragancias únicas y exclusivas. Tu perfume perfecto te está esperando en nuestra colección cuidadosamente seleccionada.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/kame_nic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/KameNicaragua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                aria-label="Síguenos en Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-amber-400">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors duration-200">Inicio</a></li>
              <li><a href="#catalog" className="text-gray-300 hover:text-white transition-colors duration-200">Catálogo</a></li>
              <li><a href="#featured" className="text-gray-300 hover:text-white transition-colors duration-200">Destacados</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contacto</a></li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-amber-400">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-sm">KameNic</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-sm">+505 8219-3629</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-sm">kamenic@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Botón de WhatsApp y redes sociales */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 KameNic. Todos los derechos reservados Managua, Nicaragua.
              </p>
              {/* Redes sociales destacadas */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Síguenos:</span>
                <a 
                  href="https://www.instagram.com/kame_nic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.facebook.com/KameNicaragua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                  aria-label="Síguenos en Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>
            <a 
              href="https://wa.me/50582193629" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center space-x-2 transition-colors duration-200 mt-4 sm:mt-0"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Contáctanos por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
