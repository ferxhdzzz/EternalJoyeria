// src/hooks/auth/useLogout.js
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

export default function useLogout() {
  const { logout: ctxLogout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      // Intentar limpiar cookie en backend
      try {
        await apiFetch("/logout", { method: "POST" });
      } catch (error) {
        // Si falla el logout del backend, continuar con el logout local
        console.warn('Error al hacer logout en backend:', error);
      }
      
      // Limpiar user en el contexto
      ctxLogout();
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
