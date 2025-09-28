import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
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
      if (isJSON && data.message === "login successful") {
        // Login exitoso - la cookie ya fue guardada por el servidor
        console.log("Login exitoso, actualizando estado del usuario");
        setUser({ email });
        return { success: true, message: "Login exitoso" };
      }

      // Fallback para respuesta 200 exitosa sin mensaje específico
      console.log("Login exitoso (fallback), actualizando estado del usuario");
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
      // Intentar hacer una petición a una ruta protegida para verificar si hay sesión activa
      const response = await fetch(`${SERVER_URL}/customers/me`, {
        method: "GET",
        credentials: "include", // Incluir cookies
      });

      if (response.ok) {
        const userData = await response.json();
        // Si la petición es exitosa, significa que hay una sesión válida
        setUser({ email: userData.email || "user@example.com" });
      } else {
        // No hay sesión válida
        setUser(null);
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