// Archivo: src/hooks/Ajustes/useFetchAjustes.js (o donde se encuentre)

import { useState, useEffect, useCallback } from "react";
// Importa tu función de fetch (ej. getAdminData)

const usePerfilAdmin = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // El estado 'trigger' nos permite forzar la recarga
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchAdminData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Reemplaza 'tuFuncionDeFetch' con la función real que obtiene los datos del admin
            // const data = await tuFuncionDeFetch(); 
            
            // Simulación de carga de datos (deberías tener tu lógica real aquí)
            const data = {
                id: 1, 
                name: "Admin Nombre Inicial", 
                email: "admin@ejemplo.com", 
                profilePicture: null
            }; 
            
            setAdmin(data);
        } catch (e) {
            console.error("Error fetching admin data:", e);
            setError(e.message || "Fallo al cargar la información del administrador.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData, refreshTrigger]); // Se ejecuta al inicio y cuando refreshTrigger cambia

    // Función para forzar la recarga de datos
    const refetchAdmin = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Exportamos la nueva función refetchAdmin
    return { admin, loading, error, refetchAdmin }; 
};

export default usePerfilAdmin;