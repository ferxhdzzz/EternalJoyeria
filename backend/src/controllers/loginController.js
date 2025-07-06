// ===== IMPORTACIONES =====
import customersModel from "../models/Customers.js";    // Modelo de clientes para consultas a BD
import adminModel from "../models/Administrator.js";    // Modelo de administradores para consultas a BD
import bcryptjs from "bcryptjs";                       // Librería para encriptar/comparar contraseñas
import jsonwebtoken from "jsonwebtoken";               // Librería para generar tokens JWT
import { config } from "../config.js";                 // Configuraciones de la aplicación (secretos, etc.)

// ===== OBJETO CONTROLADOR =====
const loginController = {};

// ===== FUNCIÓN PRINCIPAL DE LOGIN =====
loginController.login = async (req, res) => {
  // Extraer email y password del cuerpo de la petición
  const { email, password } = req.body;

  // ===== VALIDACIONES DE ENTRADA =====
  
  // Verificar que ambos campos estén presentes
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Email and password are required" 
    });
  }

  // Validar formato de email usando expresión regular
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ^ = inicio, [^\s@]+ = texto sin espacios ni @, @ = arroba obligatoria
// [^\s@]+ = dominio sin espacios ni @, \. = punto literal, [^\s@]+ = extensión, $ = final

if (!emailRegex.test(email)) {
  // Si el email no pasa la validación, responder con error 400
  return res.status(400).json({ 
    success: false,
    message: "Invalid email format" 
  });
}

  try {
    // ===== VARIABLES PARA ALMACENAR RESULTADOS =====
    let userFound;  // Guardará el usuario encontrado (admin o customer)
    let userType;   // Guardará el tipo de usuario ("admin" o "customer")

    // ===== PASO 1: BUSCAR ADMINISTRADOR PRIMERO =====
    // Convertir email a minúsculas para consistencia en la búsqueda
    const adminFound = await adminModel.findOne({ email: email.toLowerCase() });
    
    if (adminFound) {
      // Si encontramos un admin, configurar variables
      userType = "admin";
      userFound = adminFound;
      
      // ===== VALIDAR CONTRASEÑA DEL ADMIN =====
      // Comparar la contraseña ingresada con el hash almacenado en BD
      const isMatch = await bcryptjs.compare(password, adminFound.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid credentials"
        });
      }
    } else {
      // ===== PASO 2: SI NO ES ADMIN, BUSCAR CLIENTE =====
      userFound = await customersModel.findOne({ email: email.toLowerCase() });
      
      if (userFound) {
        // Si encontramos un cliente, configurar variables
        userType = "customer";
        
        // ===== VALIDAR CONTRASEÑA DEL CLIENTE =====
        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch) {
          return res.status(401).json({ 
            success: false,
            message: "Invalid credentials" 
          });
        }
      }
    }

    // ===== VALIDAR QUE SE ENCONTRÓ UN USUARIO =====
    if (!userFound) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // ===== GENERAR TOKEN JWT =====
    // El token contiene información del usuario para futuras validaciones
    const token = jsonwebtoken.sign(
      { 
        // PAYLOAD: Información que se guardará en el token
        id: userFound._id,        // ID único del usuario
        userType,                 // Tipo de usuario (admin/customer)
        email: userFound.email    // Email del usuario
      },
      // SECRETO: Clave secreta para firmar el token (desde config)
      config.JWT.JWT_SECRET,
      // OPCIONES: Configuraciones del token
      { expiresIn: config.JWT.expiresIn }  // Tiempo de expiración
    );

    // ===== CONFIGURAR COOKIE SEGURA =====
    res.cookie("authToken", token, {
      httpOnly: true,      // SEGURIDAD: Cookie solo accesible desde servidor (no JS del navegador)
      secure: process.env.NODE_ENV === 'production', // SEGURIDAD: Solo HTTPS en producción
      sameSite: 'strict',  // SEGURIDAD: Protección CSRF más estricta
      path: '/',           // Cookie disponible en toda la aplicación
      maxAge: 24 * 60 * 60 * 1000 // Expiración: 24 horas en millisegundos
    });
    
    // ===== RESPUESTA EXITOSA =====
    res.status(200).json({ 
      success: true,
      message: "Login successful",
      userType: userType,  // Informar tipo de usuario al frontend
      user: {
        // IMPORTANTE: Solo enviar datos seguros (no passwords)
        id: userFound._id,
        email: userFound.email,
        name: userFound.name
      }
    });

  } catch (error) {
    // ===== MANEJO DE ERRORES =====
    console.error("Login error:", error);  // Log detallado para debugging
    
    // SEGURIDAD: No exponer detalles del error al cliente
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// ===== FUNCIÓN DE LOGOUT =====
loginController.logout = (req, res) => {
  // Eliminar la cookie de autenticación del navegador
  res.clearCookie("authToken", {
    path: '/',              // Misma ruta que se usó para crear la cookie
    sameSite: 'strict'      // Misma configuración sameSite
  });
  
  // Confirmar logout exitoso
  res.status(200).json({ 
    success: true,
    message: "Logout successful" 
  });
};

// ===== EXPORTAR CONTROLADOR =====
export default loginController;