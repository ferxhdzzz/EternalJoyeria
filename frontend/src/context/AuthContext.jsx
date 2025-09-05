import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
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
      let me = null;

      // 1. Intentar /login/me
      try {
        const res = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/login/me", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          me = await res.json();
          console.log("[Auth] /login/me ->", me);
        }
      } catch (e) {
        console.error("Error en /login/me:", e);
      }

      // 2. Fallback a /customers/me
      if (!me) {
        try {
          const res = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/customers/me", {
            method: "GET",
            credentials: "include",
          });
          if (res.ok) {
            me = await res.json();
            console.log("[Auth] /customers/me ->", me);
          }
        } catch (e) {
          console.error("Error en /customers/me:", e);
        }
      }

      const u = normalizeUser(me);
      if (u) {
        // Verifica si es admin
        try {
          const adminRes = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/login/checkAdmin", {
            method: "GET",
            credentials: "include",
          });
          const adminData = await adminRes.json();
          const isAdmin = adminRes.ok && adminData.ok;

          setUser({ ...u, isAdmin });
        } catch (e) {
          console.error("Error al verificar admin:", e);
          setUser(u); // si falla admin check, sigue como user normal
        }
      } else {
        setUser(null);
      }
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
    try {
      await fetch("https://eternaljoyeria-cg5d.onrender.com/api/login/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    try {
      await fetch("https://eternaljoyeria-cg5d.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isPublicSession, loading, hydrate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook de conveniencia para consumir el contexto
export const useAuth = () => useContext(AuthContext);
