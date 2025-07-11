import { useState } from "react";

const API_URL = "http://localhost:4000/api/recoveryPassword";

export default function useRecoverAdminPassword() {
  const [loading, setLoading] = useState(false);

  const requestCode = async (email) => {
    setLoading(true);
    const response = await fetch(`${API_URL}/requestCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, userType: "admin" }),
    });
    setLoading(false);
    return response.json();
  };

  const verifyCode = async (code) => {
    setLoading(true);
    const response = await fetch(`${API_URL}/verifyCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });
    setLoading(false);
    return response.json();
  };

  const newPassword = async (password) => {
    setLoading(true);
    const response = await fetch(`${API_URL}/newPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newPassword: password }),
    });
    setLoading(false);
    return response.json();
  };

  return { requestCode, verifyCode, newPassword, loading };
}
