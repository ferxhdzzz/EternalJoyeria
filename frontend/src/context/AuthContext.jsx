// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isPublicSession = !!user;

  const normalizeUser = (data) => {
    if (!data) return null;

    // Caso 1: backend devuelve { ok, id, email, userType }
    if (data.ok && (data.id || data._id)) {
      return { id: data.id || data._id, email: data.email, userType: data.userType };
    }

    // Caso 2: backend devuelve el documento del usuario directamente (Customers)
    if (data.id || data._id) {
      return {
        id: data.id || data._id,
        email: data.email,
        userType: data.userType || "customer",
      };
    }

    // Caso 3: backend anida el usuario en { user: {...} }
    if (data.user && (data.user.id || data.user._id)) {
      return {
        id: data.user.id || data.user._id,
        email: data.user.email,
        userType: data.user.userType || "customer",
      };
    }

    return null;
  };

  const hydrate = useCallback(async () => {
    console.log("[Auth] hydrate ->", import.meta.env.VITE_API_URL);
    try {
      // 1) Intentar ruta clásica /login/me
      let me = null;
      try {
        me = await apiFetch("/login/me", { method: "GET" });
        console.log("[Auth] /login/me ->", me);
      } catch (e) {
        if (e?.status !== 404) throw e; // si no es 404, re-lanzar
      }

      // 2) Fallback a /customers/me si /login/me no existe o no sirve
      if (!me) {
        try {
          const cm = await apiFetch("/customers/me", { method: "GET" });
          console.log("[Auth] /customers/me ->", cm);
          me = cm;
        } catch (e) {
          if (![401, 403, 404].includes(e?.status)) throw e; // errores no esperados
        }
      }

      const u = normalizeUser(me);
      setUser(u);
    } catch (e) {
      console.log("[Auth] hydrate error:", e?.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const logout = async () => {
    // Intenta ambas rutas comunes; ignora errores
    try { await apiFetch("/login/logout", { method: "POST" }); } catch {}
    try { await apiFetch("/logout", { method: "POST" }); } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isPublicSession, loading, hydrate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook de conveniencia (opcional, no rompe usos previos)
export const useAuth = () => useContext(AuthContext);
