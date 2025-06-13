import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientsModel from "../models/Customers.js";
import { config } from "../config.js";

const registerCustomersController = {};

import { sendMail, HTMLEmailVerification } from "../utils/mailVerify.js";


registerCustomersController.registerClient = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Verificar si el cliente ya existe
    const existClient = await clientsModel.findOne({ email });
    if (existClient) {
      return res.status(409).json({ message: "Client already exists" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Crear nuevo cliente
    const newClient = new clientsModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phone,
      
    });

    // Guardar el cliente en la base de datos
    await newClient.save();

    // Generar código de verificación aleatorio
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

    // Crear un token JWT con el código de verificación
    const tokenCode = jsonwebtoken.sign(
      { email, verificationCode, expiresAt },
      config.JWT.JWT_SECRET,
      { expiresIn: config.JWT.expiresIn }
    );

    await sendMail(
      email,
      "You verification code", //Asunto del correo
      "Hello! Remember dont forget your pass", //Cuerpo del mensaje en texto plano
      HTMLEmailVerification(verificationCode) //HTML del correo con el código
    );

    // Guardar el token de verificación en una cookie
    res.cookie("verificationToken", tokenCode, {
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    res.json({ message: "Register successfully" });
    
    
    
  } catch (error) {
    console.error("Error en el registro del cliente:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

registerCustomersController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

  // Verificar si el token de verificación existe en las cookies
  if (!token) {
    return res.status(400).json({ message: "Please register your account first" });
  }

  try {
    // Verificar el token JWT
    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);
    const { email, verificationCode: storedCode, expiresAt } = decoded;

    // Verificar si el código ha expirado
    if (Date.now() > expiresAt) {
      return res.status(401).json({ message: "Verification code has expired" });
    }

    // Verificar si el código proporcionado es válido
    if (verificationCode !== storedCode) {
      return res.status(401).json({ message: "Invalid verification code" });
    }

    // Buscar al cliente en la base de datos
    const client = await clientsModel.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Marcar al cliente como verificado
    client.isVerified = true; // Este campo debería añadirse al modelo si se usa
    await client.save();

    // Limpiar la cookie de verificación
    res.clearCookie("verificationToken");
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({ message: "Token verification failed" });
  }
};

export default registerCustomersController;
