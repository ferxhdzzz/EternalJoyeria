// ===== IMPORTACIONES =====

import customersModel from "../models/Customers.js";
import adminModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

// ===== CONFIGURACIÓN SIMPLE DE INTENTOS =====
const MAX_ATTEMPTS = 5; // Máximo intentos fallidos permitidos
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos de bloqueo en milisegundos

// Almacenar intentos fallidos en memoria (simple)
// Estructura: { email: { count: número, blockedUntil: timestamp } }
const attempts = new Map();

// ===== OBJETO CONTROLADOR =====
const loginController = {};

// ===== FUNCIÓN PRINCIPAL DE LOGIN =====
loginController.login = async (req, res) => {
  const { email, password } = req.body;

  // Validar que se envíen email y password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Validar formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // ===== VERIFICAR INTENTOS FALLIDOS Y BLOQUEO =====
  const emailKey = email.toLowerCase(); // Normalizar email para la búsqueda
  const now = Date.now(); // Tiempo actual
  const userAttempts = attempts.get(emailKey); // Obtener intentos del usuario
  
  // Si está bloqueado, verificar si ya pasó el tiempo de bloqueo
  if (userAttempts && userAttempts.blockedUntil && now < userAttempts.blockedUntil) {
    // Calcular minutos restantes del bloqueo
    const minutesLeft = Math.ceil((userAttempts.blockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      message: `Account blocked. Try again in ${minutesLeft} minutes.`,
    });
  }

  try {
    let userFound; // Usuario encontrado en la base de datos
    let userType; // Tipo de usuario (admin o customer)

    // ===== BUSCAR EN TABLA DE ADMINISTRADORES PRIMERO =====
    const adminFound = await adminModel.findOne({ email: email.toLowerCase() });

    if (adminFound) {
      userType = "admin";
      console.log("el que acaba de iniciar es un admin");
      userFound = adminFound;

      // Comparar password con hash almacenado
      const isMatch = await bcryptjs.compare(password, adminFound.password);
      if (!isMatch) {
        // ===== PASSWORD INCORRECTO - REGISTRAR INTENTO FALLIDO =====
        const currentAttempts = attempts.get(emailKey) || { count: 0 };
        currentAttempts.count++; // Incrementar contador
        
        // Si alcanzó el máximo de intentos, bloquear cuenta
        if (currentAttempts.count >= MAX_ATTEMPTS) {
          currentAttempts.blockedUntil = now + BLOCK_TIME; // Establecer tiempo de bloqueo
          attempts.set(emailKey, currentAttempts);
          return res.status(429).json({
            success: false,
            message: "Too many failed attempts. Account blocked for 15 minutes.",
          });
        }
        
        // Guardar intentos y mostrar cuántos quedan
        attempts.set(emailKey, currentAttempts);
        return res.status(401).json({
          success: false,
          message: `Invalid credentials. ${MAX_ATTEMPTS - currentAttempts.count} attempts remaining.`,
        });
      }
    } else {
      // ===== SI NO ES ADMIN, BUSCAR EN TABLA DE CLIENTES =====
      userFound = await customersModel.findOne({ email: email.toLowerCase() });

      if (userFound) {
        userType = "customer";
        console.log("el que acaba de iniciar es un cliente");
        
        // Comparar password con hash almacenado
        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch) {
          // ===== PASSWORD INCORRECTO - REGISTRAR INTENTO FALLIDO =====
          const currentAttempts = attempts.get(emailKey) || { count: 0 };
          currentAttempts.count++; // Incrementar contador
          
          // Si alcanzó el máximo de intentos, bloquear cuenta
          if (currentAttempts.count >= MAX_ATTEMPTS) {
            currentAttempts.blockedUntil = now + BLOCK_TIME; // Establecer tiempo de bloqueo
            attempts.set(emailKey, currentAttempts);
            return res.status(429).json({
              success: false,
              message: "Too many failed attempts. Account blocked for 15 minutes.",
            });
          }
          
          // Guardar intentos y mostrar cuántos quedan
          attempts.set(emailKey, currentAttempts);
          return res.status(401).json({
            success: false,
            message: `Invalid credentials. ${MAX_ATTEMPTS - currentAttempts.count} attempts remaining.`,
          });
        }
      }
    }

    // ===== USUARIO NO EXISTE EN NINGUNA TABLA =====
    if (!userFound) {
      // ===== REGISTRAR INTENTO FALLIDO PARA EMAIL INEXISTENTE =====
      const currentAttempts = attempts.get(emailKey) || { count: 0 };
      currentAttempts.count++; // Incrementar contador
      
      // Si alcanzó el máximo de intentos, bloquear cuenta
      if (currentAttempts.count >= MAX_ATTEMPTS) {
        currentAttempts.blockedUntil = now + BLOCK_TIME; // Establecer tiempo de bloqueo
        attempts.set(emailKey, currentAttempts);
        return res.status(429).json({
          success: false,
          message: "Too many failed attempts. Account blocked for 15 minutes.",
        });
      }
      
      // Guardar intentos y mostrar cuántos quedan
      attempts.set(emailKey, currentAttempts);
      return res.status(401).json({
        success: false,
        message: `Invalid credentials. ${MAX_ATTEMPTS - currentAttempts.count} attempts remaining.`,
      });
    }

    // ===== LOGIN EXITOSO - LIMPIAR INTENTOS FALLIDOS =====
    attempts.delete(emailKey); // Eliminar registro de intentos fallidos

    // ===== CREAR TOKEN JWT =====
    const token = jsonwebtoken.sign(
      {
        id: userFound._id,
        userType,
        email: userFound.email,
      },
      config.JWT.JWT_SECRET,
      { expiresIn: config.JWT.expiresIn }
    );

    // ===== ESTABLECER COOKIE CON EL TOKEN =====
    res.cookie("authToken", token, {
      httpOnly: true, // Solo accesible desde el servidor
      secure: process.env.NODE_ENV === "production", // HTTPS en producción
      sameSite: "strict", // Protección CSRF
      path: "/", // Disponible en todas las rutas
      maxAge: 24 * 60 * 60 * 1000, // 24 horas de duración
    });

    // ===== RESPUESTA DE LOGIN EXITOSO =====
    res.status(200).json({
      success: true,
      message: "Login successful",
      userType: userType,
      user: {
        id: userFound._id,
        email: userFound.email,
        name: userFound.name,
      },
    });
  } catch (error) {
    // ===== MANEJO DE ERRORES DEL SERVIDOR =====
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===== FUNCIÓN PARA VERIFICAR SI EL USUARIO ES ADMIN =====
loginController.checkAdmin = (req, res) => {
  try {
    // Obtener token de las cookies
    const { authToken } = req.cookies;

    // Verificar si existe el token
    if (!authToken) {
      return res.json({ ok: false, message: "No auth token found" });
    }

    // Verificar y decodificar el token JWT
    const decoded = jsonwebtoken.verify(authToken, config.JWT.JWT_SECRET);

    // Verificar si el usuario es admin
    if (decoded.userType === "admin") {
      return res.json({ ok: true });
    } else {
      return res.json({ ok: false, message: "Access denied" });
    }
  } catch (error) {
    // Manejo de errores (token inválido o expirado)
    console.error("checkAdmin error:", error);
    return res.json({ ok: false, message: "Invalid or expired token" });
  }
};

// ===== EXPORTAR CONTROLADOR =====
export default loginController;