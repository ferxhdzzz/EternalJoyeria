// controllers/registerCustomersController.js 
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import clientsModel from "../models/Customers.js";
import { sendMail } from "../utils/mailVerify.js";
import { HTMLEmailVerification } from "../utils/mailVerify.js";
import { HTMLWelcomeEmail } from "../utils/HTMLWelcomeEmail.js";
import { v2 as cloudinary } from "cloudinary";

// 1- Configurar cloudinary con nuestra cuenta
cloudinary.config({
  cloud_name: 'dosy4rouu',
  api_key: '712175425427873',
  api_secret: 'Yk2vqXqQ6aknOrT7FCoqEiWw31w',
});

const registerCustomersController = {};

// Registro de cliente
registerCustomersController.registerClient = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  let profilePictureURL = "";

  try {
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

    // Crear nuevo cliente
    const newClient = new clientsModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phone,
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
    });

    res.json({ 
      message: "Register successfully",
      profilePicture: profilePictureURL
    });

  } catch (error) {
    console.error("Error en el registro del cliente:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Verificación de código (sin cambios)
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