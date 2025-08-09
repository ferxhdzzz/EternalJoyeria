// src/hooks/auth/useLogout.js
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

export default function useLogout() {
  const { logout: ctxLogout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await apiFetch("/logout", { method: "POST" }); // limpia cookie en backend
      ctxLogout(); // limpia user en el contexto
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
