import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // importante para sesiones
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        return { success: false, message: data.message || "Credenciales incorrectas." };
      }

      // Normaliza y guarda el usuario en el contexto
      const user = {
        id: data.id || data._id,
        email: data.email,
        userType: data.userType || "customer",
      };

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: error.message || "Error al iniciar sesión." };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
