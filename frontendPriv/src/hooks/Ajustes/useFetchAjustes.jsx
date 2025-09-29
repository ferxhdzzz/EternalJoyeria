import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Hook personalizado para obtener los datos del administrador actual
 * usando la ruta /api/admins/me (que verifica la cookie de sesión).
 *
 * @returns {{admin: object|null, loading: boolean, error: string|null, refetchAdmin: function}}
 */
const usePerfilAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 CLAVE: Definimos la función de obtención de datos usando useCallback
  // para que pueda ser llamada externamente (refetchAdmin) sin cambiar su referencia
  const obtenerAdmin = useCallback(async () => {
    setLoading(true); // Se marca como cargando en cada refetch
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
      
      // Asumimos que el backend anida el objeto de administrador en 'user'.
      setAdmin(data.user); 
      setError(null);
    } catch (error) {
      console.error("Error al obtener perfil admin:", error);
      // Si el error es 401 (no autenticado), mostramos un mensaje específico
      if (error.message.includes("401")) {
        setError("Sesión expirada o no iniciada.");
        toast.error("Sesión expirada o no iniciada.");
      } else {
        setError(error.message);
      }
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []); 

  // Llamamos a la función una vez al montar el componente (carga inicial)
  useEffect(() => {
    obtenerAdmin();
  }, [obtenerAdmin]);

  // 🟢 CLAVE: Devolvemos la función obtenerAdmin como 'refetchAdmin'
  return { admin, loading, error, refetchAdmin: obtenerAdmin };
};

export default usePerfilAdmin;
