import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializa desde localStorage si existe
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item already exists
      const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size);
      if (existingItem) {
        // Increase quantity if it exists
        return prevItems.map(item => 
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, product];
      }
    });
  };

  const removeFromCart = (productId, productSize) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === productId && item.size === productSize)));
  };

  const updateQuantity = (productId, productSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, productSize);
    } else {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId && item.size === productSize
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Sincroniza cartItems con localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Limpia el carrito (estado y localStorage)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
