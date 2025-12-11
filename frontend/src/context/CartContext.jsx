 import React, { createContext, useState, useContext, useEffect } from 'react';



// Crear el contexto del carrito

const CartContext = createContext();



// Hook personalizado para usar el contexto del carrito

export const useCart = () => useContext(CartContext);



// Proveedor del contexto del carrito

export const CartProvider = ({ children }) => {

  // Estado inicial del carrito - Inicializa desde localStorage si existe

  const [cartItems, setCartItems] = useState(() => {

    const stored = localStorage.getItem('cartItems');

    return stored ? JSON.parse(stored) : [];

  });



  // Función para agregar productos al carrito

  const addToCart = (product) => {

    // Aseguramos que el stock sea un número

    const productStock = parseInt(product.stock, 10) || 10000;

    const quantityToAdd = parseInt(product.quantity, 10) || 1;



    setCartItems(prevItems => {

      // Verificar si el producto ya existe en el carrito (mismo ID y tamaño)

      const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size);

     

      if (existingItem) {

        // Cantidad resultante después de sumar

        const resultingQuantity = parseInt(existingItem.quantity, 10) + quantityToAdd;



        // ⚠️ Validación aquí: Si excede el stock, no actualiza y devuelve el estado anterior

        if (resultingQuantity > parseInt(existingItem.stock, 10)) {

          console.warn(`[CartContext] Límite de stock alcanzado: ${existingItem.stock}`);

          return prevItems;

        }



        // Si existe, aumentar la cantidad

        return prevItems.map(item =>

          item.id === product.id && item.size === product.size

            ? { ...item, quantity: resultingQuantity }

            : item

        );

      } else {

        // ⚠️ Validación inicial: Si la cantidad inicial es muy alta

        if (quantityToAdd > productStock) {

          console.warn(`[CartContext] Cantidad inicial excede el stock: ${productStock}`);

          return prevItems;

        }

        // Si no existe, agregar como nuevo item con el stock guardado

        return [...prevItems, { ...product, stock: productStock, quantity: quantityToAdd }];

      }

    });

  };



  // Función para remover productos del carrito

  const removeFromCart = (productId, productSize) => {

    setCartItems(prevItems =>

      prevItems.filter(item => !(item.id === productId && item.size === productSize))

    );

  };



  // Función para actualizar la cantidad de un producto

  const updateQuantity = (productId, productSize, newQuantity) => {

    setCartItems(prevItems => {

      const updatedItems = prevItems.map(item => {

        if (item.id === productId && item.size === productSize) {

          // 1. Encontrar el stock máximo disponible (asegurado como entero)

          const maxStock = parseInt(item.stock, 10);

         

          // 2. La nueva cantidad debe ser un número entero

          let quantityToSet = parseInt(newQuantity, 10);

         

          // 3. Establecer mínimo de 1 (evita cantidad negativa)

          quantityToSet = Math.max(1, quantityToSet);

         

          // 4. Validación crucial: no permitir que la cantidad supere el stock

          if (!isNaN(maxStock)) {

            quantityToSet = Math.min(maxStock, quantityToSet);

          }



          return { ...item, quantity: quantityToSet };

        }

        return item;

      });

        // Quitar productos que podrían haber llegado a 0 (aunque Math.max(1,...) lo previene)

        return updatedItems.filter(item => item.quantity > 0);

    });

  };



  // Efecto: Sincronizar cartItems con localStorage cada vez que cambie

  useEffect(() => {

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

  }, [cartItems]);



  // Función para limpiar completamente el carrito

  const clearCart = () => {

    setCartItems([]);

    localStorage.removeItem('cartItems');

  };



  // Objeto con todas las funciones y datos del carrito

  const value = {

    cartItems,

    addToCart,

    removeFromCart,

    updateQuantity,

    clearCart

  };



  // Proporcionar el contexto a todos los componentes hijos

  return (

    <CartContext.Provider value={value}>

      {children}

    </CartContext.Provider>

  );

}; 