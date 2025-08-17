// Importaciones necesarias para el contexto del carrito
import React, { createContext, useState, useContext, useEffect } from 'react'; // React y hooks para contexto, estado y efectos

// Crear el contexto del carrito
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);

// Proveedor del contexto del carrito - Maneja toda la lógica del carrito de compras
export const CartProvider = ({ children }) => {
  // Estado inicial del carrito - Inicializa desde localStorage si existe
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems'); // Obtener datos guardados
    return stored ? JSON.parse(stored) : []; // Parsear JSON o array vacío
  });

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Verificar si el producto ya existe en el carrito (mismo ID y tamaño)
      const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size);
      
      if (existingItem) {
        // Si existe, aumentar la cantidad
        return prevItems.map(item => 
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity } // Sumar cantidades
            : item // Mantener otros items sin cambios
        );
      } else {
        // Si no existe, agregar como nuevo item
        return [...prevItems, product];
      }
    });
  };

  // Función para remover productos del carrito
  const removeFromCart = (productId, productSize) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === productId && item.size === productSize)) // Filtrar el item a remover
    );
  };

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (productId, productSize, newQuantity) => {
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o menor, remover el producto
      removeFromCart(productId, productSize);
    } else {
      // Actualizar la cantidad del producto específico
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId && item.size === productSize
            ? { ...item, quantity: newQuantity } // Actualizar cantidad
            : item // Mantener otros items sin cambios
        )
      );
    }
  };

  // Efecto: Sincronizar cartItems con localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Guardar en localStorage
  }, [cartItems]); // Se ejecuta cada vez que cartItems cambia

  // Función para limpiar completamente el carrito
  const clearCart = () => {
    setCartItems([]); // Vaciar el estado
    localStorage.removeItem('cartItems'); // Remover del localStorage
  };

  // Objeto con todas las funciones y datos del carrito
  const value = {
    cartItems, // Lista de productos en el carrito
    addToCart, // Función para agregar productos
    removeFromCart, // Función para remover productos
    updateQuantity, // Función para actualizar cantidades
    clearCart // Función para limpiar el carrito
  };

  // Proporcionar el contexto a todos los componentes hijos
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
