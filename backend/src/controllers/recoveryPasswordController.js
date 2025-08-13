import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import clientsModel from "../models/Customers.js";
import adminModel from "../models/Administrator.js";
import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";
import { config } from "../config.js";

// Define el objeto
const recoveryPasswordController = {};

// ---------- solicitar código ----------
recoveryPasswordController.requestCode = async (req, res) => {
  let { email, userType } = req.body;
  email = String(email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "El correo no es válido." });
  }
  if (userType !== "customer" && userType !== "admin") {
    return res.status(400).json({ message: "Tipo de usuario inválido." });
  }

  try {
    const Model = userType === "customer" ? clientsModel : adminModel;
    const userFound = await Model.findOne({ email });
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado." });

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    const token = jsonwebtoken.sign(
      { email, code, userType, verified: false },
      config.JWT.JWT_SECRET,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, {
      maxAge: 20 * 60 * 1000,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });

    await sendEmail(email, "Código de recuperación", "Tu código es:", HTMLRecoveryEmail(code));
    res.json({ message: "Correo de recuperación enviado correctamente." });
  } catch (error) {
    console.error("Error in requestCode:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// ---------- verificar código ----------
recoveryPasswordController.verifyCode = async (req, res) => {
  const { code } = req.body;
  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) return res.status(400).json({ message: "No se encontró token de recuperación." });

    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);
    if (decoded.code !== code) {
      return res.status(400).json({ message: "Código incorrecto." });
    }

    const { exp, iat, ...rest } = decoded;
    const newToken = jsonwebtoken.sign(
      { ...rest, verified: true },
      config.JWT.JWT_SECRET,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", newToken, {
      maxAge: 20 * 60 * 1000,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });

    res.json({ message: "Código verificado correctamente." });
  } catch (error) {
    console.error("Error in verifyCode:", error);
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};

// ---------- nueva contraseña ----------
recoveryPasswordController.newPassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) return res.status(400).json({ message: "No se encontró token de recuperación." });

    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);
    if (!decoded.verified) {
      return res.status(400).json({ message: "El código no está verificado." });
    }

    if (!newPassword || newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({
        message: "La contraseña debe tener mínimo 8 caracteres y al menos 1 carácter especial.",
      });
    }

    const Model =
      decoded.userType === "customer" || decoded.userType === "client"
        ? clientsModel
        : adminModel;

    const email = String(decoded.email || "").trim().toLowerCase();

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const isSame = await bcryptjs.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "La nueva contraseña debe ser diferente de la actual." });
    }

    const hashed = await bcryptjs.hash(newPassword, 10);
    await Model.findOneAndUpdate({ email }, { password: hashed });

    res.clearCookie("tokenRecoveryCode");
    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error in newPassword:", error);
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};

export default recoveryPasswordController;
