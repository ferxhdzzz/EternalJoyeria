// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; 
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default PublicRoute;
