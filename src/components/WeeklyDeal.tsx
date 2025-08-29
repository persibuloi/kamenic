/**
 * WeeklyDeal - Componente para destacar el producto de la semana
 * 
 * Este componente muestra un producto específico en oferta de manera muy llamativa
 * en la página principal. Es fácil de cambiar semanalmente modificando solo el ID del producto.
 * 
 * @author Cascade AI Assistant
 * @version 1.0.0
 * @since 2025-01-05
 */

import React, { useState } from 'react';
import { Clock, Star, ShoppingBag, Heart, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import { Product } from '../types/product';
import ProductDetail from './ProductDetail';

interface WeeklyDealProps {
  products: Product[];
}

export function WeeklyDeal({ products }: WeeklyDealProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, isInCart, getItemQuantity } = useCartContext();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesContext();

  // 🔥 PRODUCTOS DESTACADOS - AUTOMÁTICO DESDE AIRTABLE
  // Los productos destacados se seleccionan automáticamente desde el campo "Destacado" en Airtable
  // Marca el checkbox "Destacado" en Airtable para agregar productos al slider
  
  // Buscar todos los productos marcados como destacados en Airtable
  const featuredProducts = products.filter(product => 
    product.destacado === true && product.existenciaActual > 0
  );
  
  // FALLBACK: Si no hay productos destacados, usar PH55 como ejemplo
  const fallbackProducts = featuredProducts.length === 0 ? 
    products.filter(product => 
      product.codigoKame === "PH55" && product.existenciaActual > 0
    ).slice(0, 1) : [];
  
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

  // Si no hay productos para mostrar, no mostrar la sección
  if (displayProducts.length === 0) {
    return null;
  }

  const currentProduct = displayProducts[currentSlide];
  const hasMultipleProducts = displayProducts.length > 1;

  const hasOffer = currentProduct.precioOferta && currentProduct.precioOferta < currentProduct.precio1;
  const displayPrice = hasOffer ? currentProduct.precioOferta : currentProduct.precio1;
  const savings = hasOffer ? currentProduct.precio1 - currentProduct.precioOferta! : 0;
  const savingsPercentage = hasOffer ? Math.round((savings / currentProduct.precio1) * 100) : 0;

  const inCart = isInCart(currentProduct.id);
  const quantity = getItemQuantity(currentProduct.id);
  const isProductFavorite = isFavorite(currentProduct.id);

  const handleAddToCart = () => {
    addToCart(currentProduct, 1);
  };

  const handleToggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(currentProduct.id);
    } else {
      addToFavorites(currentProduct);
    }
  };

  const handleViewDetails = () => {
    setSelectedProduct(currentProduct);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayProducts.length) % displayProducts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Sección del Producto de la Semana */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header de la sección */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 sm:px-6 rounded-full font-bold text-xs sm:text-sm mb-4 animate-pulse">
              <Zap className="h-4 w-4 mr-2" />
              {featuredProducts.length > 0 ? 'PRODUCTOS DESTACADOS' : 'PRODUCTO RECOMENDADO'}
              <Zap className="h-4 w-4 ml-2" />
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hasMultipleProducts ? '¡Productos Destacados!' : '¡Producto Destacado!'}
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {hasMultipleProducts ? 'Desliza para ver nuestros productos especiales seleccionados para ti' : 'Producto especial seleccionado con el mejor precio para ti'}
            </p>
            {hasMultipleProducts && (
              <p className="text-sm text-gray-500 mt-2">
                {currentSlide + 1} de {displayProducts.length}
              </p>
            )}
          </div>

          {/* Slider de productos destacados */}
          <div className="max-w-4xl mx-auto relative">
            {/* Botones de navegación */}
            {hasMultipleProducts && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}
            
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Imagen del producto */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-12 flex items-center justify-center">
                  {hasOffer && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg z-10">
                      -{savingsPercentage}%
                    </div>
                  )}
                  
                  <div className="relative group">
                    <img
                      src={currentProduct.imagen || '/images/product-sample-1.jpg'}
                      alt={currentProduct.descripcion}
                      className="w-full max-w-sm h-64 sm:h-72 lg:h-80 object-cover rounded-2xl shadow-xl group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/product-sample-1.jpg';
                      }}
                    />
                    
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-6 lg:p-12 flex flex-col justify-center">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredProducts.length > 0 && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        ⭐ DESTACADO
                      </span>
                    )}
                    {currentProduct.marca && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        {currentProduct.marca}
                      </span>
                    )}
                    {currentProduct.genero && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {currentProduct.genero}
                      </span>
                    )}
                  </div>

                  {/* Nombre del producto */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {currentProduct.descripcion}
                  </h3>

                  {/* Código */}
                  <p className="text-sm text-gray-500 mb-6">
                    Código: {currentProduct.codigoKame}
                  </p>

                  {/* Precios */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
                        ${displayPrice?.toLocaleString('es-CO')}
                      </span>
                      {hasOffer && (
                        <span className="text-lg sm:text-xl text-gray-500 line-through">
                          ${currentProduct.precio1.toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                    {hasOffer && (
                      <p className="text-green-600 font-semibold text-sm sm:text-base">
                        ¡Ahorras ${savings.toLocaleString('es-CO')}!
                      </p>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                    >
                      <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{inCart ? `En carrito (${quantity}) - Agregar más` : 'Agregar al Carrito'}</span>
                    </button>

                    <button
                      onClick={handleToggleFavorite}
                      className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base ${
                        isProductFavorite
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isProductFavorite ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={handleViewDetails}
                      className="px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 bg-amber-100 hover:bg-amber-200 text-amber-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                    >
                      <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Ver Detalles</span>
                    </button>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                    <div className="flex items-center text-orange-700">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {featuredProducts.length > 0 ? '¡Producto destacado especialmente para ti!' : '¡Producto recomendado especialmente para ti!'}
                      </span>
                    </div>
                    {featuredProducts.length === 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        💡 Tip: Marca productos como "Destacado" en Airtable para mostrarlos aquí automáticamente
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicadores de slider */}
            {hasMultipleProducts && (
              <div className="flex justify-center mt-6 space-x-2">
                {displayProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal de detalle del producto */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product) => {
            console.log('Agregar al carrito desde weekly deal:', product);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
}
