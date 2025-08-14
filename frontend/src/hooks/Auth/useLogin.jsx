// src/hooks/auth/useLogin.js
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function useLogin() {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: { email, password },
      });
      // backend responde: { success, userType, user: { id, email, name? } }
      if (res?.success) {
        setUser({
          id: res.user?.id,
          email: res.user?.email,
          userType: res.userType,
          name: res.user?.name ?? "",
        });
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
