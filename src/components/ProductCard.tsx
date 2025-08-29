import React, { useState } from 'react';
import { ShoppingBag, Heart, Star, Share2, MessageCircle, Copy, Facebook, Twitter } from 'lucide-react';
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

  // Estado para mostrar/ocultar menú de compartir
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nativeUrl = `${window.location.origin}/#producto=${product.id}?utm_source=share&utm_medium=native`;
    const text = generateShareText();
    if (navigator.share) {
      navigator
        .share({ title: product.descripcion, text, url: nativeUrl })
        .catch(() => {
          // Si el usuario cancela o falla, mostramos el menú clásico
          setShowShareMenu(true);
        });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  // Generar texto para compartir
  const generateShareText = () => {
    const priceText = hasOffer 
      ? `¡OFERTA! $${displayPrice?.toLocaleString('es-CO')} (antes $${product.precio1.toLocaleString('es-CO')}) - ¡${discount}% de descuento!`
      : `$${displayPrice?.toLocaleString('es-CO')}`;
    const baseProductUrl = `${window.location.origin}/#producto=${product.id}`;
    return `🌟 ${product.descripcion}\n\n💰 ${priceText}\n🏷️ Código: ${product.codigoKame}\n🔥 ${product.tipoMarca}\n\n¡Descubre esta increíble fragancia en Kame Nicaragua!\n\n🔗 ${baseProductUrl}`;
  };

  const shareToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = generateShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      alert('¡Información copiada al portapapeles!');
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡Información copiada al portapapeles!');
    }
    setShowShareMenu(false);
  };

  const shareToFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#producto=${product.id}?utm_source=share&utm_medium=facebook`;
    const text = `${product.descripcion} - ${hasOffer ? `¡OFERTA! $${displayPrice?.toLocaleString('es-CO')}` : `$${displayPrice?.toLocaleString('es-CO')}`}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, '_blank');
    setShowShareMenu(false);
  };

  const shareToTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `🌟 ${product.descripcion} ${hasOffer ? `¡OFERTA! $${displayPrice?.toLocaleString('es-CO')} (${discount}% OFF)` : `$${displayPrice?.toLocaleString('es-CO')}`} en Kame Nicaragua`;
    const url = `${window.location.origin}/#producto=${product.id}?utm_source=share&utm_medium=twitter`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    setShowShareMenu(false);
  };

  // Estado de carga para efecto blur-up
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-amber-50">
      {/* Badge de estado (stock u oferta) */}
      {product.existenciaActual <= 0 ? (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          Sin stock
        </div>
      ) : (
        hasOffer && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discount}%
          </div>
        )
      )}

      {/* Botones de acción superiores */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        {/* Botón de compartir */}
        <div className="relative">
          <button 
            onClick={handleShare}
            className="p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 group-hover:scale-110"
            title="Compartir producto"
          >
            <Share2 className="h-4 w-4 text-gray-600 hover:text-blue-500 transition-colors duration-200" />
          </button>
          
          {/* Menú de compartir */}
          {showShareMenu && (
            <div className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20">
              <button
                onClick={shareToWhatsApp}
                className="w-full px-4 py-2 text-left hover:bg-green-50 flex items-center space-x-3 transition-colors duration-200"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
              >
                <Copy className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Copiar información</span>
              </button>
              <button
                onClick={shareToFacebook}
                className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">Facebook</span>
              </button>
              <button
                onClick={shareToTwitter}
                className="w-full px-4 py-2 text-left hover:bg-sky-50 flex items-center space-x-3 transition-colors duration-200"
              >
                <Twitter className="h-4 w-4 text-sky-600" />
                <span className="text-sm text-gray-700">Twitter</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Botón de favoritos */}
        <button 
          onClick={handleToggleFavorite}
          className={`p-2 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 group-hover:scale-110 ${
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
      </div>

      {/* Imagen del producto con lazy-load, blur y aspecto consistente (4/5) */}
      <div className="relative w-full bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden pb-[125%]">
        {/* Placeholder blur */}
        <div
          className={`absolute inset-0 bg-gray-200 ${imgLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          aria-hidden="true"
        />
        <img
          src={product.imagen}
          alt={product.descripcion}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/product-sample-1.jpg';
            setImgLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido del producto */}
      <div className="p-4 sm:p-6">
        {/* Tipo de marca */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="inline-block bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
            {product.tipoMarca}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
            ))}
          </div>
        </div>

        {/* Nombre del producto */}
        <h3 className="font-bold text-sm sm:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors duration-200">
          {product.descripcion}
        </h3>

        {/* Código */}
        <p className="text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4 font-mono">
          Código: {product.codigoKame}
        </p>

        {/* Precios */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl font-bold text-gray-900">
              ${displayPrice?.toLocaleString('es-CO')}
            </span>
            {hasOffer && (
              <span className="text-sm sm:text-lg text-gray-500 line-through">
                ${product.precio1.toLocaleString('es-CO')}
              </span>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-2">
          <button
            onClick={handleViewDetails}
            aria-label="Ver detalles del producto"
            className="flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base sm:py-3 sm:px-4"
          >
            <span>Detalles</span>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.existenciaActual <= 0}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base sm:py-3 sm:px-4 ${
              product.existenciaActual <= 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : inCart
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl'
            }`}
            aria-label={product.existenciaActual <= 0 ? 'Producto sin stock' : inCart ? `Producto en carrito (${quantity})` : 'Agregar al carrito'}
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
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
