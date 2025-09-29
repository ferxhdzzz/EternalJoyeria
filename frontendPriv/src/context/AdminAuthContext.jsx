// IMPORTACIÓN DE HOOKS DE REACT
import { useEffect, useState } from "react";

// URL base de la API
const API_BASE_URL = "https://eternaljoyeria-cg5d.onrender.com/api";

// DEFINICIÓN DEL HOOK PERSONALIZADO PARA VERIFICAR AUTENTICACIÓN DE ADMINISTRADOR
export default function useAdminAuth() {
  // ESTADO QUE INDICA SI EL USUARIO ESTÁ AUTENTICADO COMO ADMINISTRADOR
  const [isAuth, setIsAuth] = useState(false);

  // ESTADO QUE INDICA SI LA VERIFICACIÓN ESTÁ EN CURSO
  const [loading, setLoading] = useState(true);
  
  // ESTADO PARA ALMACENAR LOS DATOS DEL USUARIO (opcional, pero útil)
  const [userData, setUserData] = useState(null);

  // EFFECTO PARA EJECUTAR LA VERIFICACIÓN AL MONTAR EL COMPONENTE
  useEffect(() => {
    // FUNCIÓN ASÍNCRONA QUE CONSULTA AL BACKEND SI EL USUARIO ES ADMIN
    const verifyAdmin = async () => {
      try {
        // SOLICITUD AL BACKEND para verificar y obtener datos del administrador
        const res = await fetch(`${API_BASE_URL}/admins/me`, {
          method: "GET",
          credentials: "include", // CRUCIAL para enviar la cookie 'authToken' a Render/Vercel
        });

        if (!res.ok) {
          // Esto cubre 401 (token inválido/expirado) y el 500 (error en el servidor)
          console.error(`Admin verification failed: ${res.status} ${res.statusText}`);
          setIsAuth(false);
          setUserData(null);
          return;
        }

        // RESPUESTA DEL SERVIDOR con información del administrador
        const data = await res.json();

        // Actualizar estados
        setIsAuth(true); 
        setUserData(data.user); // Guardar los datos del usuario devueltos por adminController.js
        
      } catch (error) {
        // Si hay error de conexión
        console.error("Error de conexión al verificar admin:", error);
        setIsAuth(false);
        setUserData(null);
      } finally {
        // FINALIZA LA CARGA
        setLoading(false);
      }
    };

    // LLAMADO A LA FUNCIÓN DE VERIFICACIÓN
    verifyAdmin();
  }, []);

  // RETORNO DE LOS ESTADOS PARA QUE PUEDAN SER USADOS EN COMPONENTES
  return { isAuth, loading, userData };
}
