import React, { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para verificar si el usuario es admin
  const verifyAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/admins/me", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Admin verification result:", data);
        setIsAuth(true);
        return true;
      } else {
        console.log("Admin verification failed:", res.status);
        setIsAuth(false);
        return false;
      }
    } catch (error) {
      console.error("Admin verification error:", error);
      setIsAuth(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de autenticación después del login
  const updateAuthStatus = async () => {
    return await verifyAdmin();
  };

  // Función para logout
  const logout = () => {
    setIsAuth(false);
  };

  // Verificar autenticación al cargar la app
  useEffect(() => {
    verifyAdmin();
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuth,
        loading,
        updateAuthStatus,
        logout,
        verifyAdmin
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
