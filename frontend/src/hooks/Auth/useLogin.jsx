// src/hooks/auth/useLogin.js
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function useLogin() {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: { email, password },
          credentials: "include",
      });
      
      // backend responde: { success, userType, user: { id, email, name? } }
      if (res?.success) {
        setUser({
          id: res.user?.id || res.user?._id,
          email: res.user?.email,
          userType: res.userType,
          name: res.user?.name || res.user?.firstName || "",
          firstName: res.user?.firstName,
          lastName: res.user?.lastName,
        });
        return { success: true, user: res.user };
      } else {
        return { success: false, error: res.message || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
