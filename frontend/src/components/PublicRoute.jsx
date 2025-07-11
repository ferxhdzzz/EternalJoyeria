// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isPublicSession = localStorage.getItem("isPublicSession") === "true";

  if (!isPublicSession) {
    // Si no tiene sesión, redirige a login o home
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PublicRoute;
