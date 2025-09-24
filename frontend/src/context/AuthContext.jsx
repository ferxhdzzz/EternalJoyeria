import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const SERVER_URL = "http://localhost:4000/api";
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

      // Manejar errores HTTP (403 = cuenta bloqueada, 500 = server error)
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(isJSON && data.message ? data.message : "Account temporarily locked");
        }
        if (response.status === 500) {
          throw new Error(isJSON && data.message ? data.message : "Server error");
        }
        throw new Error(isJSON && data.message ? data.message : `HTTP ${response.status}`);
      }

      // Respuesta 200 OK - verificar el contenido del mensaje
      if (isJSON && data.message) {
        // Casos de error con status 200
        if (data.message === "User not found") {
          throw new Error("Usuario no encontrado");
        }
        
        if (data.message.includes("Invalid password")) {
          throw new Error(data.message); // Incluye "Remaining attempts: X"
        }
        
        // Caso de éxito
        if (data.message === "login successful") {
          // Login exitoso - la cookie ya fue guardada por el servidor
          // Como tu controlador no devuelve datos del usuario, guardamos lo básico
          setUser({ email });
          return { success: true, message: "Login exitoso" };
        }
        
        // Cualquier otro mensaje, tratarlo como error
        throw new Error(data.message);
      }

      // Fallback si no hay mensaje
      setUser({ email });
      return { success: true, message: "Login exitoso" };

    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      // Hacer request al backend para limpiar la cookie
      await fetch(`${SERVER_URL}/logout`, {
        method: "POST",
        credentials: "include", // Para enviar la cookie al servidor
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Limpiar estado local independientemente de si el request falló
      setUser(null);
    }
  };

  // Verificar si hay sesión activa al cargar la app
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      // Como no tienes ruta /me o similar, no podemos verificar la sesión automáticamente
      // Por ahora solo seteamos loading a false
      // Idealmente necesitarías una ruta GET /auth/verify para verificar el token
      
      // El usuario solo se setea después del login exitoso
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