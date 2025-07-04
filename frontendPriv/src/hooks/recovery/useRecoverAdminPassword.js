import { useState } from "react";

const API_URL = "http://localhost:4000/api/recoveryPassword";

export default function useRecoverAdminPassword() {
  const [loading, setLoading] = useState(false);

  const requestCode = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, userType: "admin" }),
      });

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      throw error;
    }
  };

  const verifyCode = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      throw error;
    }
  };

  const newPassword = async (password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/new-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      throw error;
    }
  };

  return { requestCode, verifyCode, newPassword, loading };
}
