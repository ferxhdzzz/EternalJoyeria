// backend/src/controllers/loginController.js
import customersModel from "../models/Customers.js";
import adminModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const MAX_ATTEMPTS = 5; // Máximo intentos fallidos permitidos
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos de bloqueo en milisegundos

const attempts = new Map();

const loginController = {};

// Función principal de login
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

  const emailKey = email.toLowerCase(); // Normalizar email para la búsqueda
  const now = Date.now(); // Tiempo actual
  const userAttempts = attempts.get(emailKey); // Obtener intentos del usuario
  
  if (userAttempts && userAttempts.blockedUntil && now < userAttempts.blockedUntil) {
    const minutesLeft = Math.ceil((userAttempts.blockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      message: `Cuenta bloqueada faltan ${minutesLeft} minutos.`,
    });
  }

  try {
    let userFound;
    let userType;

    // Buscar en tabla de administradores primero
    const adminFound = await adminModel.findOne({ email: email.toLowerCase() });

    if (adminFound) {
      userType = "admin";
      userFound = adminFound;

      const isMatch = await bcryptjs.compare(password, adminFound.password);
      if (!isMatch) {
        const currentAttempts = attempts.get(emailKey) || { count: 0 };
        currentAttempts.count++;

        if (currentAttempts.count >= MAX_ATTEMPTS) {
          currentAttempts.blockedUntil = now + BLOCK_TIME;
          attempts.set(emailKey, currentAttempts);
          return res.status(429).json({
            success: false,
            message: "Muchos intentos fallidos. Tu cuenta fue bloqueada por 15 minutos.",
          });
        }

        attempts.set(emailKey, currentAttempts);
        return res.status(401).json({
          success: false,
          message: `Credenciales inválidas ${MAX_ATTEMPTS - currentAttempts.count} intentos restantes`,
        });
      }
    } else {
      // Si no es admin, buscar en la tabla de clientes
      userFound = await customersModel.findOne({ email: email.toLowerCase() });

      if (userFound) {
        userType = "customer";

        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch) {
          const currentAttempts = attempts.get(emailKey) || { count: 0 };
          currentAttempts.count++;

          if (currentAttempts.count >= MAX_ATTEMPTS) {
            currentAttempts.blockedUntil = now + BLOCK_TIME;
            attempts.set(emailKey, currentAttempts);
            return res.status(429).json({
              success: false,
              message: "Muchos intentos fallidos. Tu cuenta fue bloqueada por 15 minutos",
            });
          }

          attempts.set(emailKey, currentAttempts);
          return res.status(401).json({
            success: false,
            message: `Credenciales inválidas ${MAX_ATTEMPTS - currentAttempts.count} intentos restantes`,
          });
        }
      }
    }

    // Si no se encontró el usuario
    if (!userFound) {
      const currentAttempts = attempts.get(emailKey) || { count: 0 };
      currentAttempts.count++;

      if (currentAttempts.count >= MAX_ATTEMPTS) {
        currentAttempts.blockedUntil = now + BLOCK_TIME;
        attempts.set(emailKey, currentAttempts);
        return res.status(429).json({
          success: false,
          message: "Muchos intentos fallidos. Tu cuenta fue bloqueada por 15 minutos",
        });
      }

      attempts.set(emailKey, currentAttempts);
      return res.status(401).json({
        success: false,
        message: `Credenciales inválidas ${MAX_ATTEMPTS - currentAttempts.count} intentos restantes.`,
      });
    }

    attempts.delete(emailKey); // Eliminar registro de intentos fallidos

    const token = jsonwebtoken.sign(
      {
        id: userFound._id,
        userType,
        email: userFound.email,
      },
      config.jwt.jwtSecret,
      { expiresIn: config.jwt.expiresIn }
    );


const cookieOptions = {
  httpOnly: true,
  secure: true,     // Solo se envía por HTTPS
  sameSite: "strict",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 día
};

// Usar la constante al crear la cookie
res.cookie("authToken", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      userType: userType,
      token: token, // Agregar token para React Native
      user: {
        id: userFound._id,
        email: userFound.email,
        name: userFound.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Función para verificar si el usuario es admin
loginController.checkAdmin = (req, res) => {
  try {
    const { authToken } = req.cookies;
    if (!authToken) {
      return res.json({ ok: false, message: "No auth token found" });
    }

    const decoded = jsonwebtoken.verify(authToken, config.jwt.jwtSecret);

    if (decoded.userType === "admin") {
      return res.json({ ok: true });
    } else {
      return res.json({ ok: false, message: "Access denied" });
    }
  } catch (error) {
    console.error("checkAdmin error:", error);
    return res.json({ ok: false, message: "Invalid or expired token" });
  }
};

// Función para obtener los datos del usuario autenticado
loginController.getUserData = async (req, res) => {
  try {
    const { authToken } = req.cookies;

    // Verificar si el token JWT existe
    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No estás autenticado",
      });
    }

    // Verificar y decodificar el token JWT
    const decoded = jsonwebtoken.verify(authToken, config.jwt.jwtSecret);
    
    // Obtener usuario según el tipo (admin o customer)
    let userFound;
    if (decoded.userType === "admin") {
      userFound = await adminModel.findById(decoded.id);
    } else {
      userFound = await customersModel.findById(decoded.id);
    }

    // Retornar los datos del usuario
    return res.json({
      success: true,
      user: {
        id: userFound._id,
        email: userFound.email,
        name: userFound.name,
        userType: decoded.userType,
      },
    });
  } catch (error) {
    console.error("Error en /api/login/me:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export default loginController;
