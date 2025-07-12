// 📁 controllers/registerCustomersController.js

import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import clientsModel from "../models/Customers.js";
import { config } from "../config.js";
import { sendMail, HTMLEmailVerification } from "../utils/mailVerify.js";
import { HTMLWelcomeEmail } from "../utils/HTMLWelcomeEmail.js";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const registerCustomersController = {};

// Validar email y password
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;

// 🚀 REGISTRO CLIENTE
registerCustomersController.registerClient = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  let profilePictureURL = "";

  try {
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailNormalized = email.trim().toLowerCase();

    if (!validateEmail(emailNormalized)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existClient = await clientsModel.findOne({ email: emailNormalized });
    if (existClient) {
      return res.status(409).json({ message: "Client already exists." });
    }

    // Subir imagen si existe
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
        allowed_formats: ["png", "jpg", "jpeg"],
        transformation: [
          { width: 500, height: 500, crop: "fill" },
          { quality: "auto" },
        ],
      });
      profilePictureURL = result.secure_url;
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newClient = new clientsModel({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailNormalized,
      password: passwordHash,
      phone: phone.trim(),
      profilePicture: profilePictureURL,
      isVerified: false,
    });

    await newClient.save();

    // ✅ Generar código SOLO NÚMEROS (6 dígitos)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

    const tokenCode = jsonwebtoken.sign(
      { email: emailNormalized, verificationCode, expiresAt },
      config.JWT.JWT_SECRET,
      { expiresIn: config.JWT.expiresIn }
    );

    console.log("Verification code (only numbers):", verificationCode);

    await sendMail(
      newClient.email,
      "Your verification code",
      `Your code is ${verificationCode}`,
      HTMLEmailVerification(verificationCode)
    );

    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    res.json({ message: "Register successful. Verification email sent." });
  } catch (error) {
    console.error("Error registering client:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// 🚀 VERIFICAR CÓDIGO
registerCustomersController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

  if (!token) {
    return res.status(400).json({ message: "Please register first." });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);
    const { email, verificationCode: storedCode, expiresAt } = decoded;

    console.log("DECODED:", decoded);

    if (Date.now() > expiresAt) {
      return res.status(401).json({ message: "Verification code expired." });
    }

    if (verificationCode !== storedCode) {
      return res.status(401).json({ message: "Invalid verification code." });
    }

    const client = await clientsModel.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { isVerified: true } },
      { new: true }
    );

    console.log("UPDATED CLIENT:", client);

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    res.clearCookie("verificationToken");

    await sendMail(
      client.email,
      "Welcome!",
      `Hi ${client.firstName}, welcome!`,
      HTMLWelcomeEmail(client.firstName)
    );

    res.json({ message: "Email verified successfully.", client });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Token verification failed." });
  }
};

export default registerCustomersController;
