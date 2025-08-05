import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ContactPage } from './pages/ContactPage';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Importación lazy del blog para evitar problemas
const BlogPage = React.lazy(() => import('./pages/BlogPage'));

type Page = 'home' | 'catalog' | 'contact' | 'blog';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Configuración del webhook para n8n (PRODUCCIÓN)
  // Primero intentamos la variable de entorno, si no está disponible usamos la URL de producción
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 
    'https://n8n-n8n.wppjp8.easypanel.host/webhook/f1811e79-cf48-4e5a-ab66-72ed4fb59dc6';
  
  // Debug: verificar que la variable de entorno se cargue
  console.log('🔍 DEBUG - Variable de entorno VITE_N8N_WEBHOOK_URL:', import.meta.env.VITE_N8N_WEBHOOK_URL);
  console.log('🔍 DEBUG - webhookUrl final:', webhookUrl);
  console.log('🚀 WEBHOOK CONFIGURADO - El chatbot usará:', webhookUrl);
  console.log('🔥 APP.TSX - Renderizando SingleChat con webhookUrl:', webhookUrl);


  // Manejar navegación por hash
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      // Separar la página de los parámetros de búsqueda
      const [page, params] = hash.split('?');
      
      switch (page) {
        case 'catalog':
          setCurrentPage('catalog');
          break;
        case 'contact':
          setCurrentPage('contact');
          break;
        case 'blog':
          setCurrentPage('blog');
          break;
        case 'home':
        case 'featured':
        default:
          setCurrentPage('home');
          break;
      }
    };

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    // Ejecutar al cargar la página
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderCurrentPage = () => {
    return (
      <>
        <div className={currentPage === 'home' ? 'block' : 'hidden'}>
          <HomePage />
        </div>
        <div className={currentPage === 'catalog' ? 'block' : 'hidden'}>
          <CatalogPage />
        </div>
        <div className={currentPage === 'contact' ? 'block' : 'hidden'}>
          <ContactPage />
        </div>
        <div className={currentPage === 'blog' ? 'block' : 'hidden'}>
          <React.Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50"></div>}>
            <BlogPage />
          </React.Suspense>
        </div>
      </>
    );
  };

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="min-h-screen bg-white">
        <Header onCartClick={() => setIsCartOpen(true)} webhookUrl={webhookUrl} />
        
        <main>
          {renderCurrentPage()}
        </main>
        
        <Footer />
        
        <CartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />



        {/* Botón flotante de WhatsApp */}
        <a 
          href="https://wa.me/50582193629" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-110"
          title="Contáctanos por WhatsApp"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
