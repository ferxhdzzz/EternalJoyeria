import { useState, useEffect } from "react";

/**
 * Hook personalizado para obtener los datos del administrador actual
 * usando la ruta /api/admins/me (que verifica la cookie de sesión).
 */
const usePerfilAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerAdmin = async () => {
      try {
        const res = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/admins/me", {
          method: "GET",
          credentials: "include", // Importante para enviar cookies de sesión (authToken)
        });

        if (!res.ok) {
          // Si no está autenticado o hay otro error 4xx/5xx
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        
        // *** CORRECCIÓN CLAVE AQUÍ ***
        // Asumimos que el backend anida el objeto de administrador en 'user'.
        setAdmin(data.user); 
        
        setError(null);
      } catch (error) {
        console.error("Error al obtener perfil admin:", error);
        setAdmin(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerAdmin();
  }, []);

  return { admin, loading, error };
};

export default usePerfilAdmin;
