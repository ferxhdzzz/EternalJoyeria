import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Asume la ubicación de tu AuthContext

// Nota: Asegúrate de que esta variable de entorno esté definida o usa tu URL fija
const SERVER_URL = import.meta.env.VITE_API_URL || "https://eternaljoyeria-cg5d.onrender.com/api";

const useUserSpecificData = () => {
    // Utilizamos el hook useAuth de tu aplicación
    const { user, isAuthenticated } = useAuth();
    
    const [userData, setUserData] = useState({ 
        reviewsCount: 0, 
        totalOrders: 0,
        totalSpent: 0,
        recentOrderDate: null
    });
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async (userId) => {
        setLoading(true);
        const stats = { reviewsCount: 0, totalOrders: 0, totalSpent: 0, recentOrderDate: null };

        // Si no hay userId, terminamos de cargar y reseteamos.
        if (!userId) {
            setUserData(stats);
            setLoading(false);
            return;
        }

        // --- 1. Obtener Conteo de Reseñas ---
        try {
            // Usamos el ID de usuario para las llamadas a la API
            const reviewsResponse = await fetch(`${SERVER_URL}/reviews/user/${userId}`, { credentials: "include" });
            if (reviewsResponse.ok) {
                const reviews = await reviewsResponse.json();
                stats.reviewsCount = reviews.length;
            } else {
                console.warn(`[Reviews] Error ${reviewsResponse.status}: No se pudieron cargar las reseñas.`);
            }
        } catch (e) { 
            console.error("[Reviews] Error de red al obtener reseñas:", e); 
        }

        // --- 2. Obtener Historial de Ventas (Órdenes) ---
        try {
            const salesResponse = await fetch(`${SERVER_URL}/sales/by-customer/${userId}`, { credentials: "include" });
            if (salesResponse.ok) {
                const sales = await salesResponse.json(); 

                stats.totalOrders = sales.length;

                if (sales.length > 0) {
                    // Calcula Gasto Total (asume campo 'totalAmount')
                 stats.totalSpent = sales.reduce((sum, sale) =>  sum + ((sale.idOrder?.totalCents / 100) || sale.idOrder?.total || 0), 
    0
);
                    
                    // Encuentra Fecha Reciente (usa 'createdAt' o 'date')
                    const latestSale = sales.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))[0];
                    if (latestSale) {
                        // Asume que el objeto de venta tiene un campo 'date' o 'createdAt'
                        stats.recentOrderDate = new Date(latestSale.date || latestSale.createdAt).toLocaleDateString('es-ES');
                    }
                }
            } else {
                console.warn(`[Sales] Error ${salesResponse.status}: No se pudo cargar el historial de ventas.`);
            }
        } catch (e) { 
            console.error("[Sales] Error de red al obtener historial de ventas:", e); 
        }

        setUserData(stats);
        setLoading(false);
    }, [SERVER_URL]);

    useEffect(() => {
        // Usamos user?._id para asegurar que el ID exista y no sea undefined
        if (isAuthenticated && user?._id) {
            fetchUserData(user._id);
        } else if (!isAuthenticated) {
            fetchUserData(null); // Llamar con null para resetear a datos de invitado
        }
    }, [isAuthenticated, user?._id, fetchUserData]);

    return { userData, loading, isAuthenticated };
};

export default useUserSpecificData;
