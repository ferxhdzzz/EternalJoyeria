// importación de librerías necesarias
import jsonwebtoken from "jsonwebtoken"; // para generar y verificar tokens jwt
import bcryptjs from "bcryptjs"; // para encriptar contraseñas
import crypto from "crypto"; // módulo de node para generar valores aleatorios
import { v2 as cloudinary } from "cloudinary"; // servicio para subir y gestionar imágenes en la nube
import clientsModel from "../models/Customers.js"; // modelo mongoose de clientes
import { config } from "../config.js"; // configuración global del proyecto
import { sendMail, HTMLEmailVerification } from "../utils/mailVerify.js"; // utilidades para enviar correos de verificación
import { HTMLWelcomeEmail } from "../utils/HTMLWelcomeEmail.js"; // plantilla de correo de bienvenida

// configuración de credenciales de cloudinary desde variables de entorno
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// objeto controlador para registrar clientes
const registerCustomersController = {};

// funciones auxiliares para validación
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // valida formato de email
const validatePassword = (password) => password.length >= 6; // valida longitud mínima de contraseña

// registro de un cliente nuevo
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

    // comprobación de existencia previa del cliente
    const existClient = await clientsModel.findOne({ email: emailNormalized });
    if (existClient) {
      return res.status(409).json({ message: "client already exists." });
    }

    // si se envía una imagen, se sube a cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles", // carpeta destino en cloudinary
        allowed_formats: ["png", "jpg", "jpeg"], // formatos permitidos
        transformation: [
          { width: 500, height: 500, crop: "fill" }, // recorte y redimensionado
          { quality: "auto" }, // optimización automática
        ],
      });
      profilePictureURL = result.secure_url; // guardar la url segura de la imagen
    }

    // encriptación de la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // creación del nuevo cliente
    const newClient = new clientsModel({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailNormalized,
      password: passwordHash,
      phone: phone.trim(),
      profilePicture: profilePictureURL,
      isVerified: false, // inicialmente no verificado
    });

    // guardar en base de datos
    await newClient.save();

    // generar código de verificación de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // expira en 2 horas

    // generar token jwt con el código de verificación y la fecha de expiración
    const tokenCode = jsonwebtoken.sign(
      { email: emailNormalized, verificationCode, expiresAt },
      config.jwt.jwtSecret,
      { expiresIn: config.jwt.expiresIn }
    );

    console.log("verification code (only numbers):", verificationCode); // para depuración

    // envío de email con el código de verificación
    await sendMail(
      newClient.email,
      "your verification code",
      `your code is ${verificationCode}`,
      HTMLEmailVerification(verificationCode)
    );

    // almacenar el token en una cookie para uso posterior
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true, // inaccesible desde javascript en el cliente
      secure: process.env.NODE_ENV === "production", // solo https en producción
      maxAge: 2 * 60 * 60 * 1000, // duración de 2 horas
      sameSite: "lax",
      path: "/",
    });

    res.json({ message: "register successful. verification email sent." });
  } catch (error) {
    console.error("error registering client:", error);
    res.status(500).json({ message: "server error during registration." });
  }
};

// verificación del código enviado por email
registerCustomersController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body; // código recibido desde el cliente
  const token = req.cookies.verificationToken; // token guardado en la cookie

  // si no hay token, el usuario no se ha registrado aún
  if (!token) {
    return res.status(400).json({ message: "please register first." });
  }

  try {
    // decodificar token
    const decoded = jsonwebtoken.verify(token, config.jwt.jwtSecret);
    const { email, verificationCode: storedCode, expiresAt } = decoded;

    console.log("decoded:", decoded);

    // comprobar si el código ha expirado
    if (Date.now() > expiresAt) {
      return res.status(401).json({ message: "verification code expired." });
    }

    // comprobar si el código coincide
    if (verificationCode !== storedCode) {
      return res.status(401).json({ message: "invalid verification code." });
    }

    // actualizar el estado de verificación del cliente
    const client = await clientsModel.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { isVerified: true } },
      { new: true }
    );

    console.log("updated client:", client);

    if (!client) {
      return res.status(404).json({ message: "client not found." });
    }

    // eliminar cookie de verificación ya que se usó con éxito
    res.clearCookie("verificationToken");

    // enviar correo de bienvenida
    await sendMail(
      client.email,
      "welcome!",
      `hi ${client.firstName}, welcome!`,
      HTMLWelcomeEmail(client.firstName)
    );

    res.json({ message: "email verified successfully.", client });
  } catch (error) {
    console.error("error verifying code:", error);
    res.status(500).json({ message: "token verification failed." });
  }
};

export default registerCustomersController;
