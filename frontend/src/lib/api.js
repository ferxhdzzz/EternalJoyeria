// src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_URL; // ej: http://localhost:4000/api

export async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // NECESARIO para enviar/recibir cookies
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch (_) {}

  if (!res.ok) {
    const msg = data?.message || data?.error || "Error en la solicitud";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
