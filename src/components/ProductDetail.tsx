import React, { useEffect, useRef, useState } from 'react';
import { ProductDetailProps } from '../types/product';
import { useCartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const { addToCart, isInCart, getItemQuantity } = useCartContext();
  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    // También llamar onAddToCart si existe (para compatibilidad)
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-NI', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const hasDiscount = product.precioOferta && product.precioOferta < product.precio1;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.precio1 - product.precioOferta!) / product.precio1) * 100)
    : 0;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Lock scroll and focus management
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus close button on open
    closeBtnRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div
        className="product-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeBtnRef} className="close-button" onClick={onClose} aria-label="Cerrar detalles del producto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image" style={{ position: 'relative' }}>
            {/* Placeholder blur */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0, backgroundColor: '#e5e7eb',
                opacity: imgLoaded ? 0 : 1, transition: 'opacity 400ms ease'
              }}
            />
            <img 
              src={product.imagen || '/placeholder-perfume.jpg'} 
              alt={product.descripcion}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = '/placeholder-perfume.jpg';
                setImgLoaded(true);
              }}
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 400ms ease' }}
              className={zoomed ? 'zoomed' : ''}
              onClick={() => setZoomed((z) => !z)}
            />
            {hasDiscount && (
              <div className="discount-badge">
                -{discountPercentage}%
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <div className="product-header">
              <div className="product-code">
                <span className="code-label">Código:</span>
                <span className="code-value">{product.codigoKame}</span>
              </div>
              
              <div className="product-badges">
                {product.genero && (
                  <span className={`badge badge-genero badge-${product.genero.toLowerCase()}`}>
                    {product.genero}
                  </span>
                )}
                {product.tipoMarca && (
                  <span className={`badge badge-tipo badge-${product.tipoMarca.toLowerCase()}`}>
                    {product.tipoMarca}
                  </span>
                )}
              </div>
            </div>

            <h1 className="product-title" id="product-detail-title">{product.descripcion}</h1>
            
            {product.marca && (
              <div className="product-brand">
                <span className="brand-label">Marca:</span>
                <span className="brand-value">{product.marca}</span>
              </div>
            )}

            <div className="product-pricing">
              {hasDiscount ? (
                <div className="price-with-discount">
                  <span className="original-price">{formatPrice(product.precio1)}</span>
                  <span className="offer-price">{formatPrice(product.precioOferta!)}</span>
                </div>
              ) : (
                <span className="regular-price">{formatPrice(product.precio1)}</span>
              )}
            </div>

            <div className="product-stock">
              <span className="stock-label">Disponibilidad:</span>
              <span className={`stock-value ${product.existenciaActual > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.existenciaActual > 0 
                  ? 'Disponible'
                  : 'Agotado'
                }
              </span>
            </div>

            {product.descripcionLarga && (
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{product.descripcionLarga}</p>
              </div>
            )}

            <div className="product-actions">
              {product.existenciaActual > 0 ? (
                <button 
                  className={`add-to-cart-btn ${
                    inCart ? 'in-cart' : ''
                  }`}
                  onClick={handleAddToCart}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {inCart ? `En carrito (${quantity}) - Agregar más` : 'Agregar al Carrito'}
                </button>
              ) : (
                <button className="out-of-stock-btn" disabled>
                  Producto Agotado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
