// src/hooks/Auth/useLogin.js
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const { Login: ctxLogin } = useAuth(); // Nota: es "Login" con mayúscula en tu AuthContext

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      // ctxLogin ya maneja errores internamente y devuelve { success, message }
      const result = await ctxLogin(email, password);
      
      // Devolver el resultado tal como viene del contexto
      return result;
      
    } catch (error) {
      // Este catch es por si hay errores de red o problemas inesperados
      console.error("Error inesperado en login:", error);
      return { 
        success: false, 
        message: error?.message || "Error de conexión. Intenta nuevamente." 
      };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}