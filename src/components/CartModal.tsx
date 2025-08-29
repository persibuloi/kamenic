import React, { useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useStoreConfig } from '../hooks/useStoreConfig';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartContext();
  const { freeShippingThreshold, currency, whatsappPhone, refresh, config, freeShippingEnabled } = useStoreConfig();

  // Al abrir el carrito, refrescar configuración desde Airtable automáticamente
  useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen, refresh]);
  
  if (!isOpen) return null;

  const total = getTotalPrice();
  // Umbral dinámico (Airtable/Query/env) ya resuelto por useStoreConfig
  const FREE_SHIPPING_THRESHOLD = freeShippingEnabled && typeof freeShippingThreshold === 'number'
    ? freeShippingThreshold
    : undefined;
  const progress = freeShippingEnabled && FREE_SHIPPING_THRESHOLD
    ? Math.min(100, Math.floor((total / FREE_SHIPPING_THRESHOLD) * 100))
    : 0;
  const remaining = freeShippingEnabled && FREE_SHIPPING_THRESHOLD
    ? Math.max(0, FREE_SHIPPING_THRESHOLD - total)
    : 0;

  const handleWhatsAppOrder = () => {
    const fmt = new Intl.NumberFormat('es-US', { style: 'currency', currency: (currency || 'USD') });
    const orderDetails = cartItems.map(item => {
      const unit = item.product.precioOferta || item.product.precio1;
      return `• ${item.product.descripcion} (${item.product.codigoKame})\n   Cantidad: ${item.quantity}  |  Unit: ${fmt.format(unit)}  |  Subtotal: ${fmt.format(unit * item.quantity)}`;
    }).join('\n');

    const lines: string[] = [];
    lines.push('¡Hola! Me interesa realizar el siguiente pedido:');
    lines.push('');
    lines.push(orderDetails);
    lines.push('');
    if (freeShippingEnabled && FREE_SHIPPING_THRESHOLD !== undefined) {
      if (total >= FREE_SHIPPING_THRESHOLD) {
        lines.push(`Envío gratis aplicado ✅ (umbral: ${fmt.format(FREE_SHIPPING_THRESHOLD)})`);
      } else {
        lines.push(`Aún no aplica envío gratis. Umbral: ${fmt.format(FREE_SHIPPING_THRESHOLD)} | Falta: ${fmt.format(remaining)}`);
      }
    }
    lines.push(`Total: ${fmt.format(total)}`);
    lines.push('');
    lines.push('¿Podrían confirmar disponibilidad y tiempo de entrega?');

    const message = lines.join('\n');
    const phone = whatsappPhone || '50582193629';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
            <span>Carrito de Compras</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-2">Agrega algunos perfumes para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Banner de envío gratis */}
              {freeShippingEnabled && FREE_SHIPPING_THRESHOLD !== undefined && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  {total >= FREE_SHIPPING_THRESHOLD ? (
                    <p className="text-amber-800 font-semibold">
                      ¡Felicitaciones! Tienes <span className="underline">envío gratis</span> 🥳
                    </p>
                  ) : (
                    <p className="text-amber-800">
                      Te faltan <span className="font-semibold">{new Intl.NumberFormat('es-US', { style: 'currency', currency: (currency || 'USD') }).format(remaining)}</span> para obtener <span className="font-semibold">envío gratis</span>
                    </p>
                  )}
                  <div className="mt-2 h-2 w-full rounded-full bg-amber-100 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-1 text-xs text-amber-700 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span>Umbral: {new Intl.NumberFormat('es-US', { style: 'currency', currency: (currency || 'USD') }).format(FREE_SHIPPING_THRESHOLD)}</span>
                    {config?.freeShippingEffectiveFrom && (
                      <span className="text-amber-700">• Válida desde {new Date(config.freeShippingEffectiveFrom).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</span>
                    )}
                    {config?.freeShippingEffectiveTo && (
                      <span className="text-amber-700">• Promo vigente hasta {new Date(config.freeShippingEffectiveTo).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</span>
                    )}
                  </div>
                </div>
              )}
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.product.imagen}
                      alt={item.product.descripcion}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/product-sample-1.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.product.descripcion}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.product.codigoKame}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-amber-600">
                          ${(item.product.precioOferta || item.product.precio1).toLocaleString('es-CO')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-gray-200 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const success = updateQuantity(item.product.id, item.quantity + 1);
                              if (!success) {
                                alert('No se puede agregar más cantidad de este producto.');
                              }
                            }}
                            disabled={item.quantity >= item.product.existenciaActual}
                            className="p-1 hover:bg-gray-200 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={item.quantity >= item.product.existenciaActual ? 'Cantidad máxima alcanzada' : 'Aumentar cantidad'}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="flex items-center gap-2">
                Total
                {total >= FREE_SHIPPING_THRESHOLD && (
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                    Envío gratis
                  </span>
                )}
              </span>
              <span className="text-amber-600">{new Intl.NumberFormat('es-US', { style: 'currency', currency: (currency || 'USD') }).format(total)}</span>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Pedir por WhatsApp</span>
              </button>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium transition-colors duration-200"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
