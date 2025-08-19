import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito guardado al iniciar la app
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Guardar carrito en AsyncStorage cada vez que cambie
  useEffect(() => {
    saveCartToStorage();
  }, [cartItems]);

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.log('Error al cargar carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.log('Error al guardar carrito:', error);
    }
  };

  const addProductToCart = (newProduct) => {
    const productSize = newProduct.size || 'Unica';
    
    const existingProductIndex = cartItems.findIndex(item => 
      item._id === newProduct._id && item.size === productSize
    );
    
    if (existingProductIndex >= 0) {
      setCartItems(prevItems => 
        prevItems.map((item, index) => 
          index === existingProductIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prevItems => [...prevItems, { ...newProduct, quantity: 1, size: productSize }]);
    }
  };

  const updateQuantity = (id, size, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id, size) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id || item.size !== size));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + ((item.finalPrice || item.price || 0) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addProductToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
