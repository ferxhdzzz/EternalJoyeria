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
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div><strong>Auth Debug:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User: {user ? JSON.stringify(user) : 'null'}</div>
    </div>
  );
};

export default AuthDebug;
