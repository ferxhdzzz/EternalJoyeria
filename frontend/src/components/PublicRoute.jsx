import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isPublicSession } = useContext(AuthContext);

  if (!isPublicSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PublicRoute;