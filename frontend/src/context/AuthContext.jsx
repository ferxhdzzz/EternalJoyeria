import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isPublicSession, setIsPublicSession] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("isPublicSession") === "true";
    setIsPublicSession(session);
  }, []);

  useEffect(() => {
    localStorage.setItem("isPublicSession", isPublicSession);
  }, [isPublicSession]);

  return (
    <AuthContext.Provider value={{ isPublicSession, setIsPublicSession }}>
      {children}
    </AuthContext.Provider>
  );
};
