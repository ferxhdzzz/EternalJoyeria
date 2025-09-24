// src/hooks/Auth/useLogin.js
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function useLogin() {
const [loading, setLoading] = useState(false);
const { login: ctxLogin } = useAuth();

const login = async ({ email, password }) => {
setLoading(true);
try {
const data = await ctxLogin(email, password);
return { success: true, message: data?.message || "Login exitoso" };
} catch (error) {
console.error("Error en login:", error);
return { success: false, message: error?.message || "Error al iniciar sesión." };
} finally {
setLoading(false);
}
};

return { login, loading };
}
