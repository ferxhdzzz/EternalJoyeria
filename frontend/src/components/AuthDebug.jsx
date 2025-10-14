// src/components/AuthDebug.jsx
import { useAuth } from "../context/AuthContext";

const AuthDebug = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(255, 255, 255, 0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999
    }}>
     
    </div>
  );
};

export default AuthDebug;
