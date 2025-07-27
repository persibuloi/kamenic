import React from 'react';
import { Sparkles, Award, Truck, Shield } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner, ProductGridSkeleton } from '../components/LoadingSpinner';
import { useAirtable } from '../hooks/useAirtable';
import { Product } from '../types/product';

export function HomePage() {
  const { products, loading, error } = useAirtable();
  
  // Productos destacados (los primeros 4 con ofertas o los primeros 4)
  const featuredProducts = products
    .filter(product =>
      typeof product.precioOferta === 'number' &&
      typeof product.precio1 === 'number' &&
      product.precioOferta < product.precio1
    )
    .slice(0, 4);
  
  const displayProducts = featuredProducts.length >= 4 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-6">
                  <img
                    src="/kame-logo.png"
                    alt="KAME Logo"
                    className="h-20 w-20 object-contain"
                    style={{ filter: 'drop-shadow(0 0 2em #00000033)' }}
                  />
                </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Descubre tu
                <span className="block bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Fragancia Perfecta
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Explora nuestra colección exclusiva de perfumes de lujo. 
                Cada fragancia cuenta una historia única que espera ser descubierta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="#catalog" 
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explorar Catálogo
                </a>
                <a 
                  href="#featured" 
                  className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200"
                >
                  Ver Destacados
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/images/featured-perfume.png"
                  alt="Perfume de lujo"
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/product-sample-1.jpg';
                  }}
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full opacity-30 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Fragancias Exclusivas</h3>
              <p className="text-gray-600">Colección cuidadosamente seleccionada de perfumes únicos</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Solo ofrecemos productos de las mejores marcas</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Truck className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Envío Rápido</h3>
              <p className="text-gray-600">Entrega segura y rápida a todo el país</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Garantía Total</h3>
              <p className="text-gray-600">Productos originales con garantía de autenticidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section id="featured" className="py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras fragancias más populares y ofertas especiales
            </p>
          </div>

          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium mb-2">Error al cargar productos</p>
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && displayProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay productos disponibles</p>
            </div>
          )}

          <div className="text-center mt-12">
            <a 
              href="#catalog" 
              className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Ver Todo el Catálogo
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de expertos está listo para ayudarte a encontrar la fragancia perfecta
          </p>
          <a 
            href="https://wa.me/50582193629" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-amber-700 px-8 py-4 rounded-2xl font-semibold hover:bg-amber-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Contáctanos por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
