// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

const API = (import.meta.env.VITE_API_URL || "https://eternaljoyeria-cg5d.onrender.com/api").replace(/\/$/, "");
const TOKEN_KEY = "ej_auth_token";

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const isPublicSession = !!user;

const saveToken = (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch {} };
const readToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch {} };

const normalizeUser = (data) => {
if (!data) return null;
if (data.user && (data.user.id || data.user._id)) {
return { id: data.user.id || data.user._id, email: data.user.email, userType: data.user.userType || "customer" };
}
if (data.id || data._id) {
return { id: data.id || data._id, email: data.email, userType: data.userType || "customer" };
}
if ((data.ok || data.success) && (data.id || data._id)) {
return { id: data.id || data._id, email: data.email, userType: data.userType || "customer" };
}
return null;
};

const fetchJSON = async (url, { useBearer = false } = {}) => {
const headers = {};
if (useBearer) {
const tk = readToken();
if (tk) headers["Authorization"] = `Bearer ${tk}`;
}
const res = await fetch(url, { method: "GET", credentials: "include", headers });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return res.json();
};

const hydrate = useCallback(async () => {
setLoading(true);
try {
let me = null;

// 1) Cookie
try { me = await fetchJSON(`${API}/login/me`, { useBearer: false }); } catch {}
if (!me) { try { me = await fetchJSON(`${API}/customers/me`, { useBearer: false,  credentials: "include"}); } catch {} }

// 2) Bearer fallback
if (!me) { try { me = await fetchJSON(`${API}/login/me`, { useBearer: true,  credentials: "include"}); } catch {} }
if (!me) { try { me = await fetchJSON(`${API}/customers/me`, { useBearer: true,  credentials: "include" }); } catch {} }

const u = normalizeUser(me);
if (u) {
let isAdmin = false;
try {
const headers = {};
const tk = readToken();
if (tk) headers["Authorization"] = `Bearer ${tk}`;
const r = await fetch(`${API}/login/checkAdmin`, { credentials: "include", headers });
const d = await r.json();
isAdmin = r.ok && d.ok ? !!d.ok : false;
} catch {}
setUser({ ...u, isAdmin });
} else {
setUser(null);
}
} finally {
setLoading(false);
}
}, []);

useEffect(() => { hydrate(); }, [hydrate]);

const login = async (email, password) => {
const res = await fetch(`${API}/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
credentials: "include",
body: JSON.stringify({ email, password }),
});

const isJSON = res.headers.get("content-type")?.includes("application/json");
const data = isJSON ? await res.json() : await res.text();

if (!res.ok || (isJSON && data?.success === false)) {
throw new Error((isJSON ? data?.message : data) || `HTTP ${res.status}`);
}

// guarda token (fallback Bearer si la cookie no viaja)
if (isJSON && data?.token) saveToken(data.token);

await hydrate();
return data;
};

const logout = async () => {
clearToken();
try { await fetch(`${API}/logout`, { method: "POST", credentials: "include" }); } catch {}
setUser(null);
};

return (
<AuthContext.Provider value={{ user, setUser, isPublicSession, loading, hydrate, login, logout }}>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);