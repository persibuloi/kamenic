import { useState, useEffect } from 'react';
import { Product, CartItem } from '../types/product';

const CART_STORAGE_KEY = 'perfume-store-cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Validar que hay stock disponible
    if (product.existenciaActual <= 0) {
      console.warn(`No hay stock disponible para ${product.descripcion}`);
      return false;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Validar que no excedamos el stock disponible
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.existenciaActual) {
          console.warn(`Stock insuficiente. Disponible: ${product.existenciaActual}, En carrito: ${existingItem.quantity}`);
          // Agregar solo la cantidad disponible
          const maxCanAdd = product.existenciaActual - existingItem.quantity;
          if (maxCanAdd > 0) {
            return prevItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: product.existenciaActual }
                : item
            );
          }
          return prevItems; // No se puede agregar más
        }
        
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Validar que la cantidad inicial no exceda el stock
        const finalQuantity = Math.min(quantity, product.existenciaActual);
        return [...prevItems, { product, quantity: finalQuantity }];
      }
    });
    
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.product.id === productId) {
          // Validar que no excedamos el stock disponible
          if (quantity > item.product.existenciaActual) {
            console.warn(`Stock insuficiente. Disponible: ${item.product.existenciaActual}, Solicitado: ${quantity}`);
            // Usar la cantidad máxima disponible
            return { ...item, quantity: item.product.existenciaActual };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
    
    return true;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.precioOferta || item.product.precio1;
      return total + (price * item.quantity);
    }, 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product.id === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity
  };
}
