// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isPublicSession = !!user;

  const hydrate = useCallback(async () => {
    console.log("[Auth] hydrate ->", import.meta.env.VITE_API_URL);
    try {
      const me = await apiFetch("/login/me", { method: "GET" });
      console.log("[Auth] /login/me ->", me);
      if (me?.ok) setUser({ id: me.id, email: me.email, userType: me.userType });
      else setUser(null);
    } catch (e) {
      console.log("[Auth] hydrate error:", e?.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { hydrate(); }, [hydrate]);

  const logout = async () => {
    try { await apiFetch("/logout", { method: "POST" }); } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isPublicSession, loading, hydrate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
