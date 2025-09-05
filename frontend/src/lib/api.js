// src/lib/api.js
/*const BASE_URL = import.meta.env.VITE_API_URL; // Debe ser: https://eternal-joyeria.vercel.app

export async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJSON = res.headers.get("content-type")?.includes("application/json");

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = isJSON ? await res.json() : { message: await res.text() };
      message = data?.message || data?.error || message;
    } catch {}
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return isJSON ? res.json() : res.text();
}

/*
// Helpers de auth (usa rutas SIN /api al inicio)
export async function getUserData() {
  try {
    return await apiFetch("/login/me", {
      method: "POST",
      body: { email, password },
        credentials: "include",
    });
  } catch (e) {
    console.error("Error al obtener /login/me:", e);
    return null;
  }
}


export async function loginUser(email, password) {
  try {
    return await apiFetch("/login", {
      method: "POST",
      body: { email, password },
        credentials: "include",
    });
  } catch (e) {
    console.error("Error al iniciar sesión:", e);
    return null;
  }
}*/
