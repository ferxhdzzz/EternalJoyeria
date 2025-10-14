import { useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL || "https://eternaljoyeria-cg5d.onrender.com/api"}/recoveryPassword`;

export default function useRecoverCustomerPassword() {
  const [loading, setLoading] = useState(false);

  const toJson = async (res) => {
    let data = {};
    try { 
      const text = await res.text();
      if (text) {
        console.log("toJson raw text:", text); // Debugging
        data = JSON.parse(text);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
    
    const result = { ok: res.ok, status: res.status, ...data };
    console.log("toJson result:", result);
    return result;
  };

  const requestCode = async (email) => {
    setLoading(true);
    try {
      console.log("Solicitando código para:", email);
      const requestBody = { email, userType: "customer" };
      console.log("Enviando datos:", requestBody);
      
      const res = await fetch(`${API_URL}/requestCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Importante para enviar/recibir cookies
        body: JSON.stringify(requestBody),
      });
      
      console.log("Respuesta requestCode:", res.status, res.statusText);
      const result = await toJson(res);
      console.log("Resultado requestCode:", result);
      return result;
    } catch (error) {
      console.error("Error en requestCode:", error);
      return { ok: false, message: "Error de conexión" };
    } finally { 
      setLoading(false); 
    }
  };

  const verifyCode = async (code) => {
    setLoading(true);
    try {
      console.log("Verificando código:", code);
      // CORRECCIÓN: El token con userType ya está en la cookie, solo enviamos el código
      const requestBody = { code }; 
      console.log("Enviando datos:", requestBody);
      
      const res = await fetch(`${API_URL}/verifyCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // CRUCIAL para enviar la cookie de recuperación
        body: JSON.stringify(requestBody),
      });
      
      console.log("Respuesta del servidor:", res.status, res.statusText);
      const result = await toJson(res);
      console.log("Resultado parseado:", result);
      
      return result;
    } catch (error) {
      console.error("Error en verifyCode:", error);
      return { ok: false, message: "Error de conexión" };
    } finally { 
      setLoading(false); 
    }
  };

  const resetPassword = async (newPassword) => {
    setLoading(true);
    try {
      console.log("Cambiando contraseña...");
      const requestBody = { newPassword };
      console.log("Enviando datos:", requestBody);
      
      const res = await fetch(`${API_URL}/newPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // CRUCIAL para enviar la cookie de verificación
        body: JSON.stringify(requestBody),
      });
      
      console.log("Respuesta resetPassword:", res.status, res.statusText);
      const result = await toJson(res);
      console.log("Resultado resetPassword:", result);
      return result;
    } catch (error) {
      console.error("Error en resetPassword:", error);
      return { ok: false, message: "Error de conexión" };
    } finally { 
      setLoading(false); 
    }
  };

  return { requestCode, verifyCode, resetPassword, loading };
}
