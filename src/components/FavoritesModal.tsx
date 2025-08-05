import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useCartContext } from '../context/CartContext';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const { favorites, removeFromFavorites, clearFavorites } = useFavoritesContext();
  const { addToCart } = useCartContext();

  if (!isOpen) return null;

  const handleAddToCart = (product: any) => {
    addToCart(product);
    // Opcional: remover de favoritos al agregar al carrito
    // removeFromFavorites(product.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-red-50">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <h2 className="text-2xl font-bold text-gray-900">
              Mis Favoritos
            </h2>
            <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {favorites.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Limpiar todos los favoritos"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar todo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes favoritos aún
              </h3>
              <p className="text-gray-600 mb-6">
                Explora nuestro catálogo y marca tus fragancias favoritas con el corazón
              </p>
              <button
                onClick={onClose}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="relative">
                    <img
                      src={product.imagen || '/placeholder-perfume.jpg'}
                      alt={product.descripcion}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-perfume.jpg';
                      }}
                    />
                    <button
                      onClick={() => removeFromFavorites(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors group"
                      title="Quitar de favoritos"
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-current group-hover:text-red-600" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.descripcion}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {product.marca && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                          {product.marca}
                        </span>
                      )}
                      {product.genero && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          {product.genero}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col">
                        {product.precioOferta && product.precioOferta < product.precio1 ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              ${product.precioOferta.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.precio1.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${product.precio1.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Stock: {product.existenciaActual}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.existenciaActual <= 0}
                      className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {product.existenciaActual <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
