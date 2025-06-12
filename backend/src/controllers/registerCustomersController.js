import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
<<<<<<< HEAD

=======
>>>>>>> ff3a32d3e1e7253db695bad084a229052a470068
import clientsModel from "../models/Customers.js";
import { config } from "../config.js";

const registerCustomersController = {};

registerCustomersController.registerClient = async (req, res) => {
  const { name, email, password, telephone, dui, address } = req.body;

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
      name,
      email,
      password: passwordHash,
      telephone,
      dui: dui || null,
      address
    });

    // Guardar el cliente en la base de datos
    await newClient.save();

    // Generar código de verificación aleatorio
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

    // Crear un token JWT con el código de verificación
    const tokenCode = jsonwebtoken.sign(
      { email, verificationCode, expiresAt },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn }
    );

    // Guardar el token de verificación en una cookie
    res.cookie("verificationToken", tokenCode, {
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    // Configurar el envío de correo electrónico
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: "Verificación de correo",
      text: `Tu código de verificación es: ${verificationCode}\nEste código expira en 2 horas.`,
    };

    // Enviar el correo de verificación
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar correo:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.json({ message: "Client registered, please verify your email" });
    });

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
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
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
