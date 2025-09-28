// Archivo: registerCustomersController.js

// importación de librerías necesarias
import jsonwebtoken from "jsonwebtoken"; // para generar y verificar tokens jwt
import bcryptjs from "bcryptjs"; // para encriptar contraseñas
import crypto from "crypto"; // módulo de node para generar valores aleatorios
import { v2 as cloudinary } from "cloudinary"; // servicio para subir y gestionar imágenes en la nube
import clientsModel from "../models/Customers.js"; // modelo mongoose de clientes
import { config } from "../config.js"; // configuración global del proyecto

// *** CAMBIO: Importamos la nueva función de Brevo para VERIFICACIÓN ***
import mailVerifyBrevo from "../utils/BrevoMailVerify.js"; 
// *** La línea original era: import { sendMail, HTMLEmailVerification } from "../utils/mailVerify.js";

// Importación de la función de Brevo para BIENVENIDA (ya la habíamos cambiado)
import welcomeEmail from "../utils/BrevoWelcomeEmail.js";

// configuración de credenciales de cloudinary desde variables de entorno

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// objeto controlador para registrar clientes
const registerCustomersController = {};

// ===== UTILIDADES DE VALIDACIÓN =====

/**
 * Valida formato de email usando expresión regular
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Valida que la contraseña tenga al menos 6 caracteres
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - True si la contraseña es válida
 */
const validatePassword = (password) => password.length >= 6;

/**
 * Valida que el código de verificación sea exactamente 6 dígitos numéricos
 * @param {string} code - Código a validar
 * @returns {boolean} - True si el código es válido
 */
const validateVerificationCode = (code) => /^\d{6}$/.test(code);

// ===== FUNCIONES PRINCIPALES =====

/**
 * REGISTRO DE CLIENTE
 * Procesa el registro de un nuevo cliente incluyendo:
 * - Validación de datos
 * - Subida de imagen de perfil (opcional)
 * - Hash de contraseña
 * - Generación de código de verificación
 * - Envío de email de verificación
 */

registerCustomersController.registerClient = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body; // desestructuración de datos recibidos
  let profilePictureURL = ""; // variable para guardar la url de la imagen de perfil

  try {
    // validación de campos obligatorios

    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: "all fields are required." });
    }

    const emailNormalized = email.trim().toLowerCase(); // normaliza el email para evitar duplicados por mayúsculas o espacios

    // validación del formato de email

    if (!validateEmail(emailNormalized)) {
      return res.status(400).json({ message: "invalid email format." });
    }

    // validación de la contraseña
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "password must be at least 6 characters." });
    }

    // Validar que el teléfono no esté vacío después de trim
    if (!phone.trim()) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    // ===== VERIFICAR SI EL CLIENTE YA EXISTE =====
    const existClient = await clientsModel.findOne({ email: emailNormalized });
    if (existClient) {
      // Distinguir entre cliente no verificado y cliente ya registrado
      if (!existClient.isVerified) {
        return res.status(409).json({
          message: "Client exists but not verified. Please check your email or request a new code."
        });
      }
      return res.status(409).json({ message: "Client already exists and is verified." });
    }

    // ===== PROCESAR IMAGEN DE PERFIL (SI EXISTE) =====
    if (req.file) {
      try {
        // Subir imagen a Cloudinary con transformaciones optimizadas
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profiles", // Organizar en carpeta específica
          allowed_formats: ["png", "jpg", "jpeg"], // Solo formatos de imagen válidos
          transformation: [
            { width: 500, height: 500, crop: "fill" }, // Imagen cuadrada 500x500
            { quality: "auto" }, // Optimización automática de calidad
            { format: "auto" }, // Formato automático (WebP si es compatible)
          ],
        });
        profilePictureURL = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return res.status(500).json({ message: "Error uploading profile picture." });
      }
    }

    // ===== CREAR HASH DE CONTRASEÑA =====
    let passwordHash;
    try {
      // Usar bcrypt con salt factor 10 (seguro y razonablemente rápido)
      passwordHash = await bcryptjs.hash(password, 10);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return res.status(500).json({ message: "Error processing password." });
    }

    // ===== CREAR NUEVO CLIENTE EN BASE DE DATOS =====

    const newClient = new clientsModel({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailNormalized,
      password: passwordHash,
      phone: phone.trim(),
      profilePicture: profilePictureURL,
      isVerified: false, // Cliente inicia como no verificado
    });

    // guardar en base de datos
    await newClient.save();

    // ===== GENERAR CÓDIGO DE VERIFICACIÓN =====
    // Generar código SOLO NÚMEROS de 6 dígitos (100000-999999)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // Expira en 2 horas

    // Crear token JWT que contiene el código y datos de verificación
    const tokenCode = jsonwebtoken.sign(
      {
        email: emailNormalized,
        verificationCode,
        expiresAt,
        userId: newClient._id // Incluir ID del usuario para mayor seguridad
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Log para debugging (solo en desarrollo)
    if (process.env.NODE_ENV !== "production") {
      console.log("Verification code generated:", verificationCode);
    }

    // ===== ENVIAR EMAIL DE VERIFICACIÓN (¡USANDO BREVO!) =====
    console.log("Sending verification email to:", newClient.email);
    try {
      // *** CAMBIO CLAVE: Usamos la nueva función de Brevo ***
      await mailVerifyBrevo(
        newClient.email,
        verificationCode
      );
      // *** La línea original era: await sendMail(newClient.email, "Your verification code", `Your verification code is ${verificationCode}`, HTMLEmailVerification(verificationCode));
      
    } catch (emailError) {
      console.error("Error sending verification email (Brevo):", emailError);
      // No fallar el registro por error de email, pero informar al usuario
      return res.status(201).json({
        message: "Registration successful but email could not be sent. Please contact support.",
        client: { email: emailNormalized }
      });
    }

    // ===== CONFIGURAR COOKIE CON TOKEN DE VERIFICACIÓN =====
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true, // No accesible desde JavaScript (seguridad XSS)
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      maxAge: 2 * 60 * 60 * 1000, // 2 horas en millisegundos
      sameSite: "lax", // Protección CSRF básica
      path: "/", // Cookie disponible en toda la aplicación
    });

    // ===== RESPUESTA EXITOSA =====
    res.status(201).json({
      message: "Registration successful. Verification email sent.",
      verificationToken: tokenCode // Incluir token para app móvil
    });

  } catch (error) {
    console.error("Error registering client:", error);

    // Manejar errores específicos de MongoDB
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered." });
    }

    res.status(500).json({ message: "Server error during registration." });
  }
};

/**
 * VERIFICAR CÓDIGO DE EMAIL
 * Valida el código de verificación enviado por email y activa la cuenta del cliente
 */

registerCustomersController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body; // código recibido desde el cliente
  // Obtener token desde cookie (web) o Authorization header (móvil)
  const token = req.cookies.verificationToken ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.substring(7)
      : null);


  try {
    // ===== VALIDACIONES INICIALES =====

    // Verificar que existe token de verificación
    if (!token) {
      return res.status(400).json({
        message: "No verification token found. Please register first."
      });
    }

    // Verificar que se proporcionó código
    if (!verificationCode) {
      return res.status(400).json({ message: "Verification code is required." });
    }

    // Validar formato del código (debe ser exactamente 6 dígitos)
    const codeStr = verificationCode.toString().trim();
    if (!validateVerificationCode(codeStr)) {
      return res.status(400).json({
        message: "Verification code must be exactly 6 digits."
      });
    }

    // ===== VERIFICAR Y DECODIFICAR TOKEN JWT =====
    let decoded;
    try {
      decoded = jsonwebtoken.verify(token, config.jwt.secret);
    } catch (jwtError) {
      // Limpiar cookie inválida
      res.clearCookie("verificationToken");

      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: "Verification token expired. Please register again."
        });
      }

      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: "Invalid verification token. Please register again."
        });
      }

      throw jwtError; // Re-lanzar otros errores JWT
    }

    const { email, verificationCode: storedCode, expiresAt, userId } = decoded;

    // Log para debugging (solo en desarrollo)
    if (process.env.NODE_ENV !== "production") {
      console.log("VERIFICATION ATTEMPT:", {
        email,
        providedCode: codeStr,
        storedCode,
        expiresAt: new Date(expiresAt),
        isExpired: Date.now() > expiresAt
      });
    }

    // ===== VERIFICAR EXPIRACIÓN DEL CÓDIGO =====
    if (Date.now() > expiresAt) {
      res.clearCookie("verificationToken");
      return res.status(401).json({
        message: "Verification code expired. Please request a new code."
      });
    }

    // ===== VERIFICAR QUE EL CÓDIGO COINCIDA =====
    if (codeStr !== storedCode) {
      return res.status(401).json({ message: "Invalid verification code." });
    }

    // ===== BUSCAR Y ACTUALIZAR EL CLIENTE =====

    const client = await clientsModel.findOneAndUpdate(
      {
        _id: userId, // Usar ID del token para mayor seguridad
        email: email.trim().toLowerCase(),
        isVerified: false // Solo actualizar si no está verificado
      },
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date() // Marcar fecha de verificación
        }
      },
      { new: true } // Retornar documento actualizado
    );


    // Log para debugging (solo en desarrollo)
    if (process.env.nodeEnv !== "production") {
      console.log("CLIENT UPDATE RESULT:", client ? {
        id: client._id,
        email: client.email,
        isVerified: client.isVerified,
        verifiedAt: client.verifiedAt
      } : "Client not found or already verified");
    }

    console.log("updated client:", client);


    // Verificar que se encontró y actualizó el cliente
    if (!client) {

      return res.status(404).json({
        message: "Client not found or already verified."
      });
    }

    // ===== LIMPIAR COOKIE DESPUÉS DE VERIFICACIÓN EXITOSA =====
    res.clearCookie("verificationToken");

    // ===== ENVIAR EMAIL DE BIENVENIDA (Usando Brevo) =====
    try {
      await welcomeEmail(
        client.email,
        client.firstName
      );

      if (process.env.nodeEnv !== "production") {
        console.log("Welcome email sent successfully to:", client.email);
      }
    } catch (emailError) {
      console.error("Error sending welcome email (Brevo):", emailError);
      // No fallar la verificación por error en email de bienvenida
    }

    // ===== PREPARAR RESPUESTA (SIN INFORMACIÓN SENSIBLE) =====
    const clientResponse = {
      _id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      profilePicture: client.profilePicture,
      isVerified: client.isVerified,
      verifiedAt: client.verifiedAt,
      createdAt: client.createdAt
    };

    // ===== RESPUESTA EXITOSA =====
    res.status(200).json({
      message: "Email verified successfully. Welcome!",
      client: clientResponse
    });

  } catch (error) {
    console.error("Error verifying code:", error);

    // Limpiar cookie en caso de error general
    res.clearCookie("verificationToken");

    res.status(500).json({ message: "Server error during verification." });
  }
};

/**
 * REENVIAR CÓDIGO DE VERIFICACIÓN
 * Genera y envía un nuevo código de verificación para usuarios no verificados
 */
registerCustomersController.resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    // ===== VALIDACIONES DE ENTRADA =====

    // Verificar que se proporcionó email
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Normalizar email
    const emailNormalized = email.trim().toLowerCase();

    // Validar formato de email
    if (!validateEmail(emailNormalized)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // ===== BUSCAR CLIENTE NO VERIFICADO =====
    const client = await clientsModel.findOne({
      email: emailNormalized,
      isVerified: false
    });

    // Verificar que el cliente existe y no está verificado
    if (!client) {
      return res.status(404).json({
        message: "Client not found or already verified."
      });
    }

    // ===== GENERAR NUEVO CÓDIGO DE VERIFICACIÓN =====
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // Expira en 2 horas

    // Crear nuevo token JWT con el código actualizado
    const tokenCode = jsonwebtoken.sign(
      {
        email: emailNormalized,
        verificationCode,
        expiresAt,
        userId: client._id // Incluir ID para consistencia
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Log para debugging (solo en desarrollo)
    if (process.env.nodeEnv !== "production") {
      console.log("New verification code generated (resend):", verificationCode);
    }

    // ===== ENVIAR NUEVO EMAIL DE VERIFICACIÓN (¡USANDO BREVO!) =====
    try {
      // *** CAMBIO CLAVE: Usamos la nueva función de Brevo ***
      await mailVerifyBrevo(
        client.email,
        verificationCode
      );
      // *** La línea original era: await sendMail(client.email, "Your new verification code", `Your new verification code is ${verificationCode}`, HTMLEmailVerification(verificationCode));
      
    } catch (emailError) {
      console.error("Error sending resend verification email (Brevo):", emailError);
      return res.status(500).json({
        message: "Error sending verification email. Please try again later."
      });
    }

    // ===== ACTUALIZAR COOKIE CON NUEVO TOKEN =====
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.nodeEnv === "production",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
      sameSite: "lax",
      path: "/",
    });

    // ===== RESPUESTA EXITOSA =====
    res.status(200).json({
      message: "New verification code sent successfully."
    });

  } catch (error) {
    console.error("Error resending verification code:", error);
    res.status(500).json({ message: "Server error while resending code." });

  }
};

export default registerCustomersController;