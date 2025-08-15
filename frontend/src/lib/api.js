// src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_URL; // Asegúrate de que esta variable esté configurada correctamente

// Función general para hacer peticiones API con manejo de cookies (incluyendo authToken)
export async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Enviar las cookies con la solicitud (importante para mantener la sesión)
    body: body ? JSON.stringify(body) : undefined, // Si hay cuerpo, convertirlo a JSON
  });

  // Si la respuesta no es exitosa (status 2xx)
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error desconocido");
  }

  // Parsear la respuesta si es exitosa
  return res.json();
}

// Obtener los datos del usuario autenticado
export async function getUserData() {
  try {
    const userData = await apiFetch("/api/login/me", { method: "GET" });
    return userData;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null; // Si no se puede obtener los datos, puedes retornar null o un objeto de error.
  }
}

// Función para iniciar sesión (esto ya lo tenías en el backend)
export async function loginUser(email, password) {
  try {
    const response = await apiFetch("/api/login", {
      method: "POST",
      body: { email, password },
    });
    return response;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return null;
  }
}
