import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
// Asume que getAuthToken lee la cookie (pero devolverá null si es HttpOnly)
import { getAuthToken, API_BASE_URL } from '../utils/AuthUtils'; 

// Crear el contexto del carrito
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
    // cartData: Almacena la respuesta completa de la API (incluye totals, id, etc.)
    const [cartData, setCartData] = useState(null);
    // cartItems: Almacena solo los productos, derivado de cartData (para compatibilidad con tu UI)
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // =================================================================
    // 1. FUNCIONES CENTRALES DE API Y AUTENTICACIÓN
    // =================================================================

    /**
     * Obtiene los headers con el JWT para las llamadas a la API.
     * @returns {object} Configuración de Axios
     */
    const getAuthHeaders = useCallback(() => {
        const token = getAuthToken(); // Esto puede ser null si es HttpOnly
        
        // Configuración mínima necesaria para enviar cookies de vuelta al backend
        const config = {
            withCredentials: true, // CRÍTICO: Para que el navegador envíe la cookie automáticamente
        };
        
        // Si el token no es HttpOnly y lo tenemos, lo mandamos en el header (buena práctica de fallback)
        if (token) {
            config.headers = {
                'Authorization': `Bearer ${token}` 
            };
        }

        return config; 
    }, []);

    /**
     * Trae (o crea) el carrito del usuario desde el backend usando JWT/Cookie.
     */
    const fetchCart = useCallback(async () => {
        const headers = getAuthHeaders();
        
        // No verificamos el token aquí, confiamos en la cookie que el navegador envía
        // Nota: Solo seteamos isLoading a true si el componente ya se montó una vez
        if (cartData !== null || cartItems.length > 0 || !getAuthToken()) {
            setIsLoading(true);
        }
        setError(null);
        
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/cart`, headers); 
            const backendCart = response.data;
            
            setCartData(backendCart);
            
            // Transformar la estructura de la API a la estructura de la UI
            const newCartItems = backendCart.products.map(p => ({
                id: p.productId._id,
                name: p.productId.name,
                image: p.productId.images?.[0] || 'default.png', 
                price: (p.unitPriceCents / 100) || p.productId.finalPrice || p.productId.price, 
                quantity: p.quantity,
                stock: p.productId.stock || 10000, 
                size: p.variant?.size 
            }));
            setCartItems(newCartItems);

        } catch (err) {
            console.error("Error al obtener el carrito:", err.response?.data || err);
            
            // Si la API devuelve 401/403 (Sesión no válida), limpiamos el estado local.
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                // Limpiamos sin intentar hacer otra llamada al backend
                setCartData(null);
                setCartItems([]);
                setError("Por favor, inicie sesión para ver su carrito.");
            } else {
                setError("Ocurrió un error de red o del servidor al cargar el carrito.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [getAuthHeaders, cartData, cartItems.length]); // Incluir dependencias para manejar isLoading

    /**
     * Sincroniza los items del frontend con el backend (agrega, actualiza, elimina).
     */
    const syncCartWithBackend = useCallback(async (itemsItemsToSend) => {
        const headers = getAuthHeaders();
        if (!getAuthToken()) {
            alert("Debe iniciar sesión para modificar el carrito.");
            return false;
        }
        
        const payload = {
            items: itemsItemsToSend.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                ...(item.size && { variant: { size: item.size } }) 
            })),
        };

        try {
            const response = await axios.put(`${API_BASE_URL}/orders/cart/items`, payload, headers);
            const backendCart = response.data;
            
            setCartData(backendCart);
            
            const newCartItems = backendCart.products.map(p => ({
                id: p.productId._id,
                name: p.productId.name,
                image: p.productId.images?.[0] || 'default.png', 
                price: (p.unitPriceCents / 100) || p.productId.finalPrice || p.productId.price,
                quantity: p.quantity,
                stock: p.productId.stock || 10000, 
                size: p.variant?.size
            }));
            setCartItems(newCartItems);

            return true;

        } catch (err) {
            console.error("Error al sincronizar el carrito:", err.response?.data || err);
            
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert("Su sesión ha caducado. Por favor, vuelva a iniciar sesión.");
            } else {
                alert(`Error al actualizar el carrito: ${err.response?.data?.message || 'Error de conexión.'}`);
            }
            fetchCart(); 
            return false;
        }
    }, [getAuthHeaders, fetchCart]);
    
    /**
     * 🚨 FUNCIÓN DE LIMPIEZA LOCAL (SÍNCRONA) 🚨
     * No hace llamadas a la API. Usada por AuthContext.logout.
     */
    const clearCartLocal = useCallback(() => {
        setCartItems([]);
        setCartData(null);
        setError(null);
        // NO cambiamos isLoading aquí, el AuthContext se encargará de esto si es necesario.
        console.log("CartContext: Limpieza de estado local forzada.");
    }, []);

    /**
     * FUNCIÓN DE LIMPIEZA COMPLETA (Asíncrona)
     * Llama al backend para limpiar la DB (con el array vacío).
     */
    const clearCart = useCallback(async () => {
        // Limpia el estado local primero para que el usuario vea el cambio instantáneo
        clearCartLocal(); 
        
        // Luego intenta limpiar el backend. Si falla (por 401), no importa, ya está limpio localmente.
        await syncCartWithBackend([]);
    }, [clearCartLocal, syncCartWithBackend]);


    /**
     * 🚨 EFECTO DE MONTAJE 🚨
     * Llamar a fetchCart en cada montaje. 
     */
    useEffect(() => {
        // Ejecutamos la carga. El error 401 será capturado dentro de fetchCart()
        // y manejará la limpieza del estado y el setIsLoading(false).
        fetchCart(); 
    }, [fetchCart]);

    // =================================================================
    // 2. FUNCIONES DE MANEJO DEL CARRITO (Llaman a syncCartWithBackend)
    // =================================================================
    
    // ... (Mantener addToCart, removeFromCart, updateQuantity sin cambios)
    const addToCart = async (product) => {
        if (!getAuthToken()) {
            alert("Debe iniciar sesión para agregar productos al carrito.");
            return;
        }
        
        const quantityToAdd = parseInt(product.quantity, 10) || 1;
        const productId = product.id;
        const productSize = product.size;
        
        let updatedItems;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productId && item.size === productSize);
            
            if (existingItem) {
                updatedItems = prevItems.map(item => 
                    item.id === productId && item.size === productSize
                        ? { ...item, quantity: (existingItem.quantity) + quantityToAdd }
                        : item
                );
            } else {
                updatedItems = [...prevItems, { ...product, quantity: quantityToAdd }];
            }
            return updatedItems; 
        });
        
        await syncCartWithBackend(updatedItems);
    };

    const removeFromCart = async (productId, productSize) => {
        const updatedItems = cartItems.filter(item => !(item.id === productId && item.size === productSize));

        setCartItems(updatedItems); 
        
        await syncCartWithBackend(updatedItems);
    };

    const updateQuantity = async (productId, productSize, newQuantity) => {
        const quantityToSet = Math.max(1, parseInt(newQuantity, 10));

        const updatedItems = cartItems.map(item => {
            if (item.id === productId && item.size === productSize) {
                return { ...item, quantity: quantityToSet };
            }
            return item;
        }).filter(item => item.quantity > 0);

        setCartItems(updatedItems); 

        await syncCartWithBackend(updatedItems);
    };

    // Objeto con todas las funciones y datos del carrito
    const value = {
        cartItems,
        cartData, 
        isLoading,
        error,
        fetchCart, 
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearCartLocal, // 🚨 EXPONER ESTA FUNCIÓN PARA AuthContext
    };

    // Proporcionar el contexto a todos los componentes hijos
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};