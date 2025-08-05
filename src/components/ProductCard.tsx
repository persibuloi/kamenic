import React from 'react';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '../types/product';
import { useCartContext } from '../context/CartContext';
import { useFavoritesContext } from '../context/FavoritesContext';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart, isInCart, getItemQuantity } = useCartContext();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesContext();
  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);
  const isProductFavorite = isFavorite(product.id);
  
  const hasOffer = product.precioOferta && product.precioOferta < product.precio1;
  const displayPrice = hasOffer ? product.precioOferta : product.precio1;
  const discount = hasOffer ? Math.round(((product.precio1 - product.precioOferta!) / product.precio1) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra la ficha del producto
    
    const success = addToCart(product, 1);
    if (!success) {
      // Mostrar mensaje de error si no se pudo agregar
      alert(`No se pudo agregar al carrito. Stock disponible: ${product.existenciaActual}`);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra la ficha del producto
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-amber-50">
      {/* Etiqueta de oferta */}
      {hasOffer && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          -{discount}%
        </div>
      )}

      {/* Botón de favoritos */}
      <button 
        onClick={handleToggleFavorite}
        className={`absolute top-4 right-4 z-10 p-2 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 group-hover:scale-110 ${
          isProductFavorite 
            ? 'bg-red-50 hover:bg-red-100' 
            : 'bg-white/80 hover:bg-white'
        }`}
        title={isProductFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <Heart className={`h-4 w-4 transition-colors duration-200 ${
          isProductFavorite 
            ? 'text-red-500 fill-current' 
            : 'text-gray-600 hover:text-red-500'
        }`} />
      </button>

      {/* Imagen del producto */}
      <div className="relative h-64 bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
        <img
          src={product.imagen}
          alt={product.descripcion}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/product-sample-1.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido del producto */}
      <div className="p-6">
        {/* Tipo de marca */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            {product.tipoMarca}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
            ))}
          </div>
        </div>

        {/* Nombre del producto */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors duration-200">
          {product.descripcion}
        </h3>

        {/* Código */}
        <p className="text-xs text-gray-500 mb-4 font-mono">
          Código: {product.codigoKame}
        </p>

        {/* Precios */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${displayPrice?.toLocaleString('es-CO')}
            </span>
            {hasOffer && (
              <span className="text-lg text-gray-500 line-through">
                ${product.precio1.toLocaleString('es-CO')}
              </span>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <span>Detalles</span>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.existenciaActual <= 0}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
              product.existenciaActual <= 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : inCart
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>
              {product.existenciaActual <= 0 
                ? 'Sin Stock' 
                : inCart 
                ? `En carrito (${quantity})` 
                : 'Agregar'
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
