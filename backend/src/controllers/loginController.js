// backend/src/controllers/loginController.js
import customersModel from "../models/Customers.js";
import adminModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const MAX_ATTEMPTS = 5; // intentos fallidos
const BLOCK_TIME = 15 * 60 * 1000; // 15 min
const attempts = new Map();

const COOKIE_NAME = "authToken";

function sign(user) {
const payload = {
id: user._id?.toString() || user.id,
userType: user.userType,
email: user.email,
};
return jsonwebtoken.sign(payload, config.jwt.jwtSecret, { expiresIn: config.jwt.expiresIn });
}

function getTokenFromReq(req) {
const bearer = req.headers.authorization?.startsWith("Bearer ")
? req.headers.authorization.split(" ")[1]
: null;
return req.cookies?.[COOKIE_NAME] || bearer || null;
}

const loginController = {};

// POST /api/login
loginController.login = async (req, res) => {
const { email, password } = req.body || {};

if (!email || !password) {
return res.status(400).json({ success: false, message: "Email and password are required" });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
return res.status(400).json({ success: false, message: "Invalid email format" });
}

const emailKey = email.toLowerCase();
const now = Date.now();
const userAttempts = attempts.get(emailKey);

if (userAttempts?.blockedUntil && now < userAttempts.blockedUntil) {
const minutesLeft = Math.ceil((userAttempts.blockedUntil - now) / 60000);
return res.status(429).json({ success: false, message: `Cuenta bloqueada, faltan ${minutesLeft} minutos.` });
}

try {
// 1) Buscar primero admin, luego customer
let userFound = await adminModel.findOne({ email: emailKey });
let userType = null;

if (userFound) {
userType = "admin";
const isMatch = await bcryptjs.compare(password, userFound.password || "");
if (!isMatch) {
const current = attempts.get(emailKey) || { count: 0 };
current.count++;
if (current.count >= MAX_ATTEMPTS) {
current.blockedUntil = now + BLOCK_TIME;
attempts.set(emailKey, current);
return res.status(429).json({ success: false, message: "Muchos intentos fallidos. Cuenta bloqueada por 15 minutos." });
}
attempts.set(emailKey, current);
return res.status(401).json({ success: false, message: `Credenciales inválidas. Intentos restantes: ${MAX_ATTEMPTS - current.count}` });
}
} else {
userFound = await customersModel.findOne({ email: emailKey });
if (userFound) {
userType = "customer";
const isMatch = await bcryptjs.compare(password, userFound.password || "");
if (!isMatch) {
const current = attempts.get(emailKey) || { count: 0 };
current.count++;
if (current.count >= MAX_ATTEMPTS) {
current.blockedUntil = now + BLOCK_TIME;
attempts.set(emailKey, current);
return res.status(429).json({ success: false, message: "Muchos intentos fallidos. Cuenta bloqueada por 15 minutos." });
}
attempts.set(emailKey, current);
return res.status(401).json({ success: false, message: `Credenciales inválidas. Intentos restantes: ${MAX_ATTEMPTS - current.count}` });
}
}
}

// 2) Si no existe
if (!userFound) {
const current = attempts.get(emailKey) || { count: 0 };
current.count++;
if (current.count >= MAX_ATTEMPTS) {
current.blockedUntil = now + BLOCK_TIME;
attempts.set(emailKey, current);
return res.status(429).json({ success: false, message: "Muchos intentos fallidos. Cuenta bloqueada por 15 minutos." });
}
attempts.set(emailKey, current);
return res.status(401).json({ success: false, message: `Credenciales inválidas. Intentos restantes: ${MAX_ATTEMPTS - current.count}` });
}

// 3) Ok
attempts.delete(emailKey);
userFound = userFound.toObject ? userFound.toObject() : userFound;
userFound.userType = userType;

const token = sign(userFound);

// Cookie cross-site 2025 (CHIPS)
res.cookie(COOKIE_NAME, token, {
httpOnly: true,
secure: true,
sameSite: "lax",
partitioned: true, // <- clave para cookies third-party en Chrome actual
path: "/",
maxAge: 7 * 24 * 60 * 60 * 1000,
});

return res.status(200).json({
success: true,
message: "Login successful",
token, // Fallback Bearer para front
userType,
user: { id: userFound._id?.toString(), email: userFound.email, name: userFound.name },
});
} catch (error) {
console.error("Login error:", error);
return res.status(500).json({ success: false, message: "Internal server error" });
}
};

// GET /api/login/me
loginController.getUserData = async (req, res) => {
try {
const token = getTokenFromReq(req);
if (!token) return res.status(401).json({ success: false, message: "No estás autenticado" });

const decoded = jsonwebtoken.verify(token, config.jwt.jwtSecret);

let userFound =
decoded.userType === "admin"
? await adminModel.findById(decoded.id)
: await customersModel.findById(decoded.id);

if (!userFound) return res.status(401).json({ success: false, message: "No autorizado" });

return res.json({
success: true,
user: {
id: userFound._id?.toString(),
email: userFound.email,
name: userFound.name,
userType: decoded.userType,
},
});
} catch (error) {
console.error("Error en /api/login/me:", error);
return res.status(401).json({ success: false, message: "No autorizado" });
}
};

// GET /api/login/checkAdmin
loginController.checkAdmin = (req, res) => {
try {
const token = getTokenFromReq(req);
if (!token) return res.json({ ok: false, message: "No auth token found" });

const decoded = jsonwebtoken.verify(token, config.jwt.jwtSecret);
return res.json({ ok: decoded.userType === "admin" });
} catch (error) {
console.error("checkAdmin error:", error);
return res.json({ ok: false, message: "Invalid or expired token" });
}
};

export default loginController;