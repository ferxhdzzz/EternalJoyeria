// importación de librerías necesarias
import jsonwebtoken from "jsonwebtoken"; // para generar y verificar tokens
import bcryptjs from "bcryptjs"; // para encriptar y comparar contraseñas

// importación de modelos de base de datos
import clientsModel from "../models/Customers.js";
import adminModel from "../models/Administrator.js";

// importación de funciones para envío de correos y plantilla html
import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";

// importación de configuración general del proyecto
import { config } from "../config.js";

// objeto que agrupa todas las funciones de recuperación de contraseña
const passwordRecoveryController = {};

// ===============================
// solicitar código de recuperación
// ===============================
passwordRecoveryController.requestCode = async (req, res) => {
  const { email, userType } = req.body;

  // validar que el correo tenga un formato válido
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "el correo no es válido." });
  }

  // validar que el tipo de usuario sea válido
  if (userType !== "client" && userType !== "admin") {
    return res.status(400).json({ message: "tipo de usuario inválido." });
  }

  try {
    // seleccionar el modelo según el tipo de usuario
    const Model = userType === "client" ? clientsModel : adminModel;

    // buscar usuario por email
    const userFound = await Model.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "usuario no encontrado." });
    }

    // generar un código de 5 dígitos aleatorio
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // crear token con email, código y tipo de usuario, expira en 20 minutos
    const token = jsonwebtoken.sign(
      { email, code, userType, verified: false },
      config.jwt.jwtSecret,
      { expiresIn: "20m" }
    );

    // guardar el token en una cookie con duración de 20 minutos
    res.cookie("tokenRecoveryCode", token, {
      maxAge: 20 * 60 * 1000,
      sameSite: "lax",
      path: "/"
    });

    // enviar el código al correo del usuario
    await sendEmail(
      email,
      "código de recuperación",
      "tu código es:",
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "correo de recuperación enviado correctamente." });
  } catch (error) {
    console.error("error en requestCode:", error);
    res.status(500).json({ message: "error interno del servidor." });
  }
};

// ===============================
// verificar código de recuperación
// ===============================
passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    // obtener token de la cookie
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
      return res.status(400).json({ message: "no se encontró token de recuperación." });
    }

    // verificar el token
    const decoded = jsonwebtoken.verify(token, config.jwt.jwtSecret);

    // comparar el código recibido con el que está en el token
    if (decoded.code !== code) {
      return res.status(400).json({ message: "código incorrecto." });
    }

    // eliminar datos automáticos del token y mantener el resto
    const { exp, iat, ...rest } = decoded;

    // generar nuevo token con propiedad verified en true
    const newToken = jsonwebtoken.sign(
      { ...rest, verified: true },
      config.jwt.jwtSecret,
      { expiresIn: "20m" }
    );

    // guardar nuevo token en la cookie
    res.cookie("tokenRecoveryCode", newToken, {
      maxAge: 20 * 60 * 1000,
      sameSite: "lax",
      path: "/"
    });

    res.json({ message: "código verificado correctamente." });
  } catch (error) {
    console.error("error en verifyCode:", error);
    res.status(400).json({ message: "token inválido o expirado." });
  }
};

// ===============================
// establecer nueva contraseña
// ===============================
passwordRecoveryController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    // obtener token de la cookie
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
      return res.status(400).json({ message: "no se encontró token de recuperación." });
    }

    // verificar token
    const decoded = jsonwebtoken.verify(token, config.jwt.jwtSecret);

    // validar que el código haya sido verificado antes
    if (!decoded.verified) {
      return res.status(400).json({ message: "el código no está verificado." });
    }

    // validar que la contraseña cumpla con longitud y carácter especial
    if (!newPassword || newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({
        message: "la contraseña debe tener mínimo 8 caracteres y al menos 1 carácter especial."
      });
    }

    // seleccionar el modelo según el tipo de usuario
    const Model = decoded.userType === "client" ? clientsModel : adminModel;

    // buscar usuario por email
    const user = await Model.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "usuario no encontrado." });
    }

    // comprobar que la nueva contraseña no sea igual a la actual
    const isSame = await bcryptjs.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        message: "la nueva contraseña debe ser diferente de la actual."
      });
    }

    // encriptar nueva contraseña
    const hashed = await bcryptjs.hash(newPassword, 10);

    // actualizar la contraseña en base de datos
    await Model.findOneAndUpdate({ email: decoded.email }, { password: hashed });

    // eliminar cookie del token de recuperación
    res.clearCookie("tokenRecoveryCode");

    res.json({ message: "contraseña actualizada correctamente." });
  } catch (error) {
    console.error("error en newPassword:", error);
    res.status(400).json({ message: "token inválido o expirado." });
  }
};

// exportar el controlador
export default passwordRecoveryController;
