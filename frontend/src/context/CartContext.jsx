// Importaciones necesarias para el contexto del carrito
import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto del carrito
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);

// Proveedor del contexto del carrito - Maneja toda la lógica del carrito de compras
export const CartProvider = ({ children }) => {
    // Estado inicial del carrito - Inicializa desde localStorage si existe
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('cartItems');
        return stored ? JSON.parse(stored) : [];
    });

    // Función para agregar productos al carrito
    // EL PRODUCTO DEBE VENIR CON EL CAMPO 'stock' (e.g., product = {id, name, quantity: 1, stock: 5, size, price})
    const addToCart = (product) => {
        // Aseguramos que el producto a agregar tenga una propiedad stock válida
        const productStock = product.stock > 0 ? product.stock : 10000; // Valor seguro si stock no viene (IDEALMENTE DEBE VENIR)
        const quantityToAdd = product.quantity || 1;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size);
            
            if (existingItem) {
                // Cantidad resultante después de sumar
                const resultingQuantity = existingItem.quantity + quantityToAdd;

                // Si existe, aumentar la cantidad, pero no exceder el stock
                if (resultingQuantity > existingItem.stock) {
                    // Opcional: Mostrar una notificación al usuario (no implementado aquí)
                    console.warn(`No se pudo agregar. Límite de stock: ${existingItem.stock}`);
                    return prevItems; // No actualiza si excede
                }

                return prevItems.map(item => 
                    item.id === product.id && item.size === product.size
                        ? { ...item, quantity: resultingQuantity } // Sumar cantidades
                        : item
                );
            } else {
                // Si no existe, agregar como nuevo item. 
                // Asegúrate de que el objeto 'product' que pasas aquí ya trae el 'stock'
                if (quantityToAdd > productStock) {
                     console.warn(`No se pudo agregar. La cantidad inicial excede el stock: ${productStock}`);
                     return prevItems; // No agrega si la cantidad inicial es muy alta
                }
                return [...prevItems, { ...product, stock: productStock }]; // Guardar stock en el item del carrito
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
                    // 1. Encontrar el stock máximo disponible para este producto
                    const maxStock = item.stock; 
                    
                    // 2. Limitar la cantidad a 1 (mínimo) y al stock (máximo)
                    let quantityToSet = Math.max(1, newQuantity);
                    
                    // 3. Validación crucial: no permitir que la cantidad supere el stock
                    if (maxStock !== undefined && maxStock !== null) {
                        quantityToSet = Math.min(maxStock, quantityToSet);
                    }

                    // Si la cantidad final es 0 (solo posible si newQuantity original fue <= 0)
                    if (quantityToSet <= 0) {
                        return null; // Usamos null para que el filtro posterior lo elimine
                    }

                    return { ...item, quantity: quantityToSet };
                }
                return item;
            }).filter(item => item !== null); // Eliminar si la cantidad resultante es 0

            return updatedItems;
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