// 📁 controllers/registerCustomersController.js 

import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import clientsModel from "../models/Customers.js";
import { config } from "../config.js";
import { sendMail } from "../utils/mailVerify.js";
import { HTMLEmailVerification } from "../utils/mailVerify.js";
import { HTMLWelcomeEmail } from "../utils/HTMLWelcomeEmail.js";

// 1- Configurar cloudinary con nuestra cuenta
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const registerCustomersController = {};

// Función para validar formato de email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar longitud mínima de contraseña
const validatePassword = (password) => {
  // Validación básica: al menos 6 caracteres
  return password.length >= 6;
};

// Registro de cliente
registerCustomersController.registerClient = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  let profilePictureURL = "";

  try {
    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ 
        message: "All fields are required: firstName, lastName, email, password, phone" 
      });
    }

    // Validar que los campos no estén vacíos (solo espacios)
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      return res.status(400).json({ 
        message: "Fields cannot be empty or contain only spaces" 
      });
    }

    // Validar formato de email
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Please enter a valid email address" 
      });
    }

    // Validar longitud mínima de contraseña (6 caracteres)
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Validar longitud de nombres y apellidos (entre 2 y 50 caracteres)
    if (firstName.trim().length < 2 || firstName.trim().length > 50) {
      return res.status(400).json({ 
        message: "First name must be between 2 and 50 characters" 
      });
    }

    if (lastName.trim().length < 2 || lastName.trim().length > 50) {
      return res.status(400).json({ 
        message: "Last name must be between 2 and 50 characters" 
      });
    }

    // Verificar si el cliente ya existe
    const existClient = await clientsModel.findOne({ email });
    if (existClient) {
      return res.status(409).json({ message: "Client already exists" });
    }

    // Subir la imagen a Cloudinary 
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles", // Carpeta específica para perfiles
        allowed_formats: ["png", "jpg", "jpeg"],
        transformation: [
          { width: 500, height: 500, crop: "fill" }, // Redimensionar para perfiles
          { quality: "auto" }
        ]
      });
      // Guardo en la variable la URL de donde se subió la imagen
      profilePictureURL = result.secure_url;
    }

    // Encriptar contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Crear nuevo cliente (usando trim() para limpiar espacios extra)
    const newClient = new clientsModel({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(), // Convertir email a minúsculas para consistencia
      password: passwordHash,
      phone: phone.trim(),
      profilePicture: profilePictureURL, // URL de Cloudinary o string vacío
    });

    await newClient.save();

    // Generar código de verificación
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

    const tokenCode = jsonwebtoken.sign(
      { email, verificationCode, expiresAt },
      config.JWT.JWT_SECRET,
      { expiresIn: config.JWT.expiresIn }
    );

    // Enviar correo con código de verificación
    await sendMail(
      email,
      "Your verification code",
      "Hello! Here's your verification code.",
      HTMLEmailVerification(verificationCode)
    );

    // Guardar token en cookie
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000,
      path:'/', //cookie disponibloe en toda la aplicacion 
      sameSite:'lax',  // proteccion contra CSRF
    });

    res.json({ 
      message: "Register successfully",
    });

  } catch (error) {
    console.error("Error en el registro del cliente:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Verificación de código 
registerCustomersController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

  if (!token) {
    return res.status(400).json({ message: "Please register your account first" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);
    const { email, verificationCode: storedCode, expiresAt } = decoded;

    if (Date.now() > expiresAt) {
      return res.status(401).json({ message: "Verification code has expired" });
    }

    if (verificationCode !== storedCode) {
      return res.status(401).json({ message: "Invalid verification code" });
    }

    const client = await clientsModel.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Marcar cliente como verificado
    client.isVerified = true;
    await client.save();

    // Enviar correo de bienvenida
    await sendMail(
      email,
      "Welcome to the platform!",
      `Hi ${client.firstName}, welcome!`,
      HTMLWelcomeEmail(client.firstName)
    );

    res.clearCookie("verificationToken");
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({ message: "Token verification failed" });
  }
};

export default registerCustomersController;
// Exportar el controlador