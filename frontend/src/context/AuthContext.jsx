 import React from "react";

import { createContext, useContext, useState, useEffect } from "react";



const SERVER_URL = import.meta.env.VITE_API_URL || "https://eternaljoyeria-cg5d.onrender.com/api";

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);



  const Login = async (email, password) => {

    try {

      const response = await fetch(`${SERVER_URL}/login`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        credentials: "include", // CRUCIAL: Para enviar/recibir cookies

        body: JSON.stringify({ email, password }),

      });



      // Tu controlador puede devolver errores con status 200

      const isJSON = response.headers.get("content-type")?.includes("application/json");

      const data = isJSON ? await response.json() : await response.text();



      // Manejar errores HTTP

      if (!response.ok) {

        if (response.status === 401) {

          throw new Error(isJSON && data.message ? data.message : "Credenciales inválidas");

        }

        if (response.status === 403) {

          throw new Error(isJSON && data.message ? data.message : "Cuenta temporalmente bloqueada");

        }

        if (response.status === 500) {

          throw new Error(isJSON && data.message ? data.message : "Error del servidor");

        }

        throw new Error(isJSON && data.message ? data.message : `Error HTTP ${response.status}`);

      }



      // Respuesta 200 OK - debe ser login exitoso

      // Nota: El endpoint /login usualmente no devuelve el perfil completo, solo un mensaje.

      // Nos basaremos en el posterior checkAuthStatus para obtener el perfil completo.

      if (isJSON && data.message === "login successful") {

        console.log("Login exitoso. Forzando re-chequeo de estado para obtener ID...");

        // Tras un login exitoso, forzamos un chequeo de estado

        await checkAuthStatus();

        return { success: true, message: "Login exitoso" };

      }



      // Fallback

      console.log("Login exitoso (fallback). Forzando re-chequeo de estado para obtener ID...");

      await checkAuthStatus();

      return { success: true, message: "Login exitoso" };



    } catch (error) {

      console.error("Login error:", error);

      return { success: false, message: error.message };

    }

  };



  const logout = async () => {

    try {

      console.log("Intentando cerrar sesión y limpiar cookie...");

      // Hacer request al backend para limpiar la cookie

      const response = await fetch(`${SERVER_URL}/logout`, {

        method: "POST",

        credentials: "include", // Para enviar la cookie al servidor

      });



      if (response.ok) {

        console.log("Servidor confirmó cierre de sesión (cookie borrada).");

      } else {

        console.warn("Servidor devolvió error al cerrar sesión, pero borraremos el estado local.", response.status);

      }

     

    } catch (error) {

      console.error("Logout error (falla de red o servidor):", error);

    } finally {

      // Limpiar estado local independientemente de si el request falló

      setUser(null);

      console.log("Estado de usuario local limpio.");

    }

  };



  // Verificar si hay sesión activa al cargar la app

  const checkAuthStatus = async () => {

    setLoading(true);

    try {

      // Intentar hacer una petición a una ruta protegida para verificar si hay sesión activa

      const response = await fetch(`${SERVER_URL}/customers/me`, {

        method: "GET",

        credentials: "include", // Incluir cookies

      });



      if (response.ok) {

        const userData = await response.json();

        // CRÍTICO: GUARDAR LA PROPIEDAD _ID (O ID) DEL USUARIO

        setUser({

            _id: userData._id || userData.id, // <-- GUARDAMOS EL ID AQUI

            email: userData.email || "user@example.com",

            firstName: userData.firstName,

            lastName: userData.lastName

        });

        console.log("Sesión activa recuperada. ID del usuario:", userData._id || userData.id);

      } else {

        // No hay sesión válida

        setUser(null);

        console.log("No hay sesión activa.");

      }

    } catch (error) {

      console.error("Auth check error:", error);

      setUser(null);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    checkAuthStatus();

  }, []);



  return (

    <AuthContext.Provider

      value={{

        user,

        Login,

        logout,

        loading,

        isAuthenticated: !!user

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};



export const useAuth = () => useContext(AuthContext);



// Exportar también el contexto si es necesario

export { AuthContext };