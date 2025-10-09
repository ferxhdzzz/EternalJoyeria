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
  
  // Actualizar productos existentes en el carrito con stock y tallas corregidas
  useEffect(() => {
    const updateExistingProducts = () => {
      setCartItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          // Corregir tallas en español
          size: item.size === 'Unica' ? 'Talla única' : 
                item.size === 'One Size' ? 'Talla única' : 
                item.size === 'unique' ? 'Talla única' : 
                item.size || 'Talla única',
          // Asegurar que tenga stock (usar un valor por defecto si no existe)
          stock: item.stock || 999
        }))
      );
    };
    
    if (cartItems.length > 0) {
      updateExistingProducts();
    }
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
    const productSize = newProduct.selectedSize || newProduct.size || 'Talla única';
    const productStock = newProduct.stock || 0;
    
    const existingProductIndex = cartItems.findIndex(item => 
      item._id === newProduct._id && item.size === productSize
    );
    
    if (existingProductIndex >= 0) {
      const currentQuantity = cartItems[existingProductIndex].quantity;
      if (currentQuantity >= productStock) {
        console.log('No se puede agregar más, stock insuficiente');
        return false; // No se puede agregar mas
      }
      setCartItems(prevItems => 
        prevItems.map((item, index) => 
          index === existingProductIndex 
            ? { ...item, quantity: Math.min(item.quantity + 1, productStock) }
            : item
        )
      );
    } else {
      if (productStock <= 0) {
        console.log('Producto sin stock disponible');
        return false;
      }
      setCartItems(prevItems => [...prevItems, { 
        ...newProduct, 
        quantity: 1, 
        size: productSize,
        stock: productStock 
      }]);
    }
    return true; // Agregado exitosamente
  };

  const updateQuantity = (id, size, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === id && item.size === size) {
          const newQuantity = item.quantity + change;
          const maxStock = item.stock || 999; // Si no hay stock definido, usar un numero alto
          
          // No permitir menos de 1 ni mas que el stock disponible
          const finalQuantity = Math.max(1, Math.min(newQuantity, maxStock));
          
          if (newQuantity > maxStock) {
            console.log(`Stock insuficiente. Máximo disponible: ${maxStock}`);
          }
          
          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
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
