import CustomersModel from "../models/Customers.js";
import AdministratorsModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos
const loginController = {};

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await AdministratorsModel.findOne({ email });
    let userType = "admin";

    if (!user) {
      user = await CustomersModel.findOne({ email });
      userType = "customer";
    }

    if (!user)
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    // Bloqueo por intentos fallidos
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutosRestantes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Cuenta bloqueada. Intenta nuevamente en ${minutosRestantes} minutos`,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();
        return res.status(403).json({
          success: false,
          message: `Cuenta bloqueada por ${LOCK_TIME / 60000} minutos`,
        });
      }

      await user.save();
      return res.status(401).json({
        success: false,
        message: `Contraseña incorrecta. Intentos restantes: ${MAX_ATTEMPTS - user.loginAttempts}`,
      });
    }

    // Contraseña correcta
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, userType },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Guardar cookie JWT (producción HTTPS)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        profilePicture: user.profilePicture || "",
      },
      userType,
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

export default loginController;
