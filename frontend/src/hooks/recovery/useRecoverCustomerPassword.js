import { useState } from "react";

const API_URL = "https://eternaljoyeria-cg5d.onrender.com/api/recoveryPassword";

export default function useRecoverCustomerPassword() {
  const [loading, setLoading] = useState(false);

  const toJson = async (res) => {
    let data = {};
    try { data = await res.json(); } catch {}
    return { ok: res.ok, status: res.status, ...data };
  };

  const requestCode = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/requestCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, userType: "customer" }),
      });
      return await toJson(res);
    } finally { setLoading(false); }
  };

  const verifyCode = async (code) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/verifyCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, userType: "customer" }),
      });
      return await toJson(res);
    } finally { setLoading(false); }
  };

  const resetPassword = async (newPassword) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/newPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });
      return await toJson(res);
    } finally { setLoading(false); }
  };

  return { requestCode, verifyCode, resetPassword, loading };
}
