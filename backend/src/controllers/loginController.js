import CustomersModel from "../models/Customers.js";
import AdministratorsModel from "../models/Administrator.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound = await AdministratorsModel.findOne({ email });
    let userType = "admin";

    if (!userFound) {
      userFound = await CustomersModel.findOne({ email });
      userType = "customer";
    }

    if (!userFound)
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    // Bloqueo por intentos fallidos
    if (userFound.lockUntil && userFound.lockUntil > Date.now()) {
      const minutosRestantes = Math.ceil((userFound.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Cuenta bloqueada. Intenta nuevamente en ${minutosRestantes} minutos`,
      });
    }

    const isMatch = await bcryptjs.compare(password, userFound.password);
    if (!isMatch) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      if (userFound.loginAttempts >= MAX_ATTEMPTS) {
        userFound.lockUntil = Date.now() + LOCK_TIME;
        await userFound.save();
        return res.status(403).json({
          success: false,
          message: `Cuenta bloqueada por ${LOCK_TIME / 60000} minutos`,
        });
      }

      await userFound.save();
      return res.status(401).json({
        success: false,
        message: `Contraseña incorrecta. Intentos restantes: ${MAX_ATTEMPTS - userFound.loginAttempts}`,
      });
    }

    // Contraseña correcta
    userFound.loginAttempts = 0;
    userFound.lockUntil = null;
    await userFound.save();

    // Generar JWT
    const token = jsonwebtoken.sign(
      { id: userFound._id, userType },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Guardar cookie JWT (producción HTTPS)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,      // obligatorio en Render/Vercel
      sameSite: "none",  // necesario cross-site
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: userFound._id,
        email: userFound.email,
        firstName: userFound.firstName || "",
        lastName: userFound.lastName || "",
        phone: userFound.phone || "",
        profilePicture: userFound.profilePicture || "",
      },
      userType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

export default loginController;
