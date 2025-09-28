import { useState, useEffect } from "react";

const usePerfilAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerAdmin = async () => {
      try {
        const res = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/admins/me", {
          method: "GET",
          credentials: "include", // para enviar cookies de sesión
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setAdmin(data);
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
