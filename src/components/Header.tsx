import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Search, Heart } from 'lucide-react';
import { useCartContext } from '../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCartContext();
  const totalItems = getTotalItems();

  return (
    <header className="bg-white shadow-lg border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img src="/kame-logo.png" alt="KAME Logo" className="h-10 w-10 object-contain" style={{ filter: 'drop-shadow(0 0 2em #00000033)' }} />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">KAME</span>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium">
              Inicio
            </a>
            <a href="#catalog" className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium">
              Catálogo
            </a>
            <a href="#featured" className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium">
              Destacados
            </a>
            <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium">
              Contacto
            </a>
          </nav>

          {/* Iconos de acción */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200">
              <Heart className="h-5 w-5" />
            </button>
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botón de menú móvil */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-amber-100 py-4">
            <nav className="flex flex-col space-y-3">
              <a 
                href="#home" 
                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </a>
              <a 
                href="#catalog" 
                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Catálogo
              </a>
              <a 
                href="#featured" 
                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Destacados
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
