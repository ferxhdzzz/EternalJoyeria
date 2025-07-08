import React from "react";
import { Navigate } from "react-router-dom";
import useAdminAuth from "../hooks/AdminAuth/AdminAuth.jsx";


export default function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAdminAuth();

  if (loading) return <p>Cargando...</p>; 

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
