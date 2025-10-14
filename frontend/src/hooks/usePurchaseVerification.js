// src/hooks/usePurchaseVerification.js (Archivo Corregido)

import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; 

const SERVER_URL = "https://eternaljoyeria-cg5d.onrender.com/api"; 

/**
 * Hook para verificar si el usuario actual ha comprado un producto específico,
 * utilizando un endpoint optimizado del backend.
 */
export const usePurchaseVerification = () => {
    const { user, isAuthenticated } = useAuth();

    // Función que realiza la verificación contra el backend
    const hasUserPurchasedProduct = useCallback(async (productId) => {
        if (!isAuthenticated || !user?._id) {
            // El usuario no está logueado, asumimos que no ha comprado
            return false;
        }

        const userId = user._id;

        try {
            // ✨ Usamos el nuevo endpoint eficiente:
            const response = await fetch(`${SERVER_URL}/sales/check-purchase/${userId}/${productId}`, {
                method: "GET",
                credentials: 'include' // Necesario para enviar la cookie de sesión
            });

            if (!response.ok) {
                console.error("Error al verificar la compra en el servidor:", response.status);
                // Si hay un error, por seguridad negamos la reseña
                return false; 
            }

            const data = await response.json();
            
            // El backend devuelve { purchased: true/false }
            return data.purchased === true; 

        } catch (error) {
            console.error("Error de red durante la verificación de compra:", error);
            return false;
        }
    }, [user, isAuthenticated]); 

    return { hasUserPurchasedProduct };
};