import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Search, Heart, MessageCircle } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useFavoritesContext } from '../context/FavoritesContext';

import { FavoritesModal } from './FavoritesModal';
import { HeaderChatbot } from './HeaderChatbot';

interface HeaderProps {
  onCartClick: () => void;
  webhookUrl?: string;
}

export function Header({ onCartClick, webhookUrl }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems } = useCartContext();
  const { getFavoritesCount } = useFavoritesContext();
  const totalItems = getTotalItems();
  const favoritesCount = getFavoritesCount();


  
  // Función para manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      console.log('Buscando:', searchTerm);
      
      // Navegar al catálogo con el término de búsqueda
      const newHash = `catalog?search=${encodeURIComponent(searchTerm)}`;
      console.log('Navegando a:', newHash);
      
      window.location.hash = newHash;
      setSearchQuery('');
      setIsSearchOpen(false);
      
      // Forzar actualización si ya estamos en el catálogo
      if (window.location.hash.includes('catalog')) {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    }
  };

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
            <a href="#blog" className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium">
              Blog
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
            {/* Búsqueda */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
                title="Buscar productos"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Barra de búsqueda desplegable */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 md:right-0 -right-2 md:w-80">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar perfumes, marcas..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!searchQuery.trim()}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </form>
                  <div className="mt-2 text-xs text-gray-500">
                    Busca por nombre, marca, género o tipo de fragancia
                  </div>
                </div>
              )}
            </div>
            {/* Chatbot IA */}
            <div className="relative">
              <button 
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                className="relative group p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                title="Asistente IA de Fragancias - Pregúntame sobre perfumes"
              >
                {/* Icono principal con efectos mejorados */}
                <div className="relative">
                  <MessageCircle className="h-5 w-5 ai-pulse" />
                  {/* Efecto blink en el icono mejorado */}
                  <div className="absolute inset-0 bg-white rounded-full opacity-0 animate-ping"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent rounded-full opacity-0 group-hover:opacity-30 animate-pulse"></div>
                </div>
                
                {/* Indicador IA con efecto blink mejorado */}
                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm ai-pulse ai-glow">
                    <div className="w-full h-full bg-white rounded-full opacity-30 animate-ping"></div>
                  </div>
                  {/* Texto "IA" pequeño con animación */}
                  <span className="absolute text-[8px] font-bold text-white drop-shadow-sm ai-pulse">IA</span>
                </div>
                
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-opacity duration-300"></div>
              </button>
              
              {/* Chatbot desplegable */}
              <HeaderChatbot 
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
                webhookUrl={webhookUrl}
              />
            </div>

            {/* Favoritos */}
            <button 
              onClick={() => setIsFavoritesOpen(true)}
              className="relative p-2 text-gray-700 hover:text-red-500 transition-colors duration-200"
              title="Mis favoritos"
            >
              <Heart className={`h-5 w-5 ${favoritesCount > 0 ? 'text-red-500 fill-current' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
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
                href="#blog" 
                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
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

        
        {/* Modal de Favoritos */}
        <FavoritesModal 
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
        />
      </div>
    </header>
  );
}
