import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import clientsModel from "../models/Customers.js";
import adminModel from "../models/Administrator.js";

import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";
import { config } from "../config.js";

const passwordRecoveryController = {};

// Función para solicitar el código de recuperación (MEJORADA)
passwordRecoveryController.requestCode = async (req, res) => {
  const { email, userType } = req.body; // Ahora recibimos el tipo de usuario

  try {
    let userFound;
    let modelToUse;

    // Determinar qué modelo usar según el tipo de usuario
    if (userType === "client") {
      userFound = await clientsModel.findOne({ email });
      modelToUse = "client";
    } else if (userType === "admin") {
      userFound = await adminModel.findOne({ email });
      modelToUse = "admin";
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Si no se encuentra el usuario, devolver mensaje de error
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generar un código aleatorio de 5 dígitos
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Guardamos toda la información en un token JWT
    const token = jsonwebtoken.sign(
      { email, code, userType: modelToUse, verified: false },
      config.JWT.JWT_SECRET,
      { expiresIn: "20m" }
    );

    // Guardar el token en una cookie con duración de 20 minutos
    res.cookie("tokenRecoveryCode", token, { 
      maxAge: 20 * 60 * 1000, 
      path: '/',
      sameSite: 'lax'
    });

    // Enviar el correo electrónico con el código de verificación
    await sendEmail(
      email,
      "Your verification code",
      "Hello! Your password recovery code",
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "Recovery email sent successfully" });
  } catch (error) {
    console.log("Error in requestCode: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// FUNCIÓN PARA VERIFICAR EL CÓDIGO (sin cambios)
passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
      return res.status(400).json({ message: "No recovery token found" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);

    if (decoded.code !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // Marcar el token como verificado
    const newToken = jsonwebtoken.sign(
      {
        email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified: true,
      },
      config.JWT.JWT_SECRET,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", newToken, { 
      maxAge: 20 * 60 * 1000,
      path: '/',
      sameSite: 'lax'
    });

    res.json({ message: "Code verified successfully" });
  } catch (error) {
    console.log("Error in verifyCode: " + error);
    res.status(500).json({ message: "Token expired or invalid" });
  }
};

// FUNCIÓN PARA ASIGNAR LA NUEVA CONTRASEÑA (MEJORADA)
passwordRecoveryController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
      return res.status(400).json({ message: "No recovery token found" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    const { email, userType } = decoded;

    // Encriptar la nueva contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    let updatedUser;

    // Actualizar según el tipo de usuario
    if (userType === "client") {
      // Verificar que la nueva contraseña no sea igual a la actual
      const currentUser = await clientsModel.findOne({ email });
      const isSamePassword = await bcryptjs.compare(newPassword, currentUser.password);
      
      if (isSamePassword) {
        return res.status(400).json({ message: "New password must be different from current password" });
      }

      updatedUser = await clientsModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    } else if (userType === "admin") {
      // Verificar que la nueva contraseña no sea igual a la actual
      const currentUser = await adminModel.findOne({ email });
      const isSamePassword = await bcryptjs.compare(newPassword, currentUser.password);
      
      if (isSamePassword) {
        return res.status(400).json({ message: "New password must be different from current password" });
      }

      updatedUser = await adminModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Eliminar el token de las cookies por seguridad
    res.clearCookie("tokenRecoveryCode");

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in newPassword: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default passwordRecoveryController;