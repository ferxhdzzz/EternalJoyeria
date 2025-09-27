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


// Define el objeto
const recoveryPasswordController = {};

// ---------- solicitar código ----------
recoveryPasswordController.requestCode = async (req, res) => {
  let { email, userType } = req.body;
  email = String(email || "").trim().toLowerCase();


  // validar que el correo tenga un formato válido
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "el correo no es válido." });
  }

  if (userType !== "customer" && userType !== "admin") {
    return res.status(400).json({ message: "Tipo de usuario inválido." });
  }

  try {
    const Model = userType === "customer" ? clientsModel : adminModel;
    const userFound = await Model.findOne({ email });
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado." });

    // generar un código de 5 dígitos aleatorio
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // crear token con email, código y tipo de usuario, expira en 20 minutos
    const token = jsonwebtoken.sign(
      { email, code, userType, verified: false },
      config.jwt.secret,
      { expiresIn: "20m" }
    );

    // guardar el token en una cookie con duración de 20 minutos
    res.cookie("tokenRecoveryCode", token, {
      maxAge: 20 * 60 * 1000,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });

    // Intentar enviar el correo
    try {
      await sendEmail(email, "Código de recuperación", "Tu código es:", HTMLRecoveryEmail(code));
      return res.json({
        success: true,
        message: "Código de recuperación enviado correctamente.",
        recoveryToken: token // Incluir token para app móvil
      });
    } catch (emailError) {
      console.error("Error al enviar el correo:", emailError);
      // Aún así respondemos con éxito pero indicamos que hubo un problema con el correo
      return res.status(200).json({
        success: true,
        message: "El código se generó correctamente, pero hubo un problema al enviar el correo.",
        recoveryToken: token // Incluir token para app móvil
      });
    }
  } catch (error) {
    console.error("Error en requestCode:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al procesar la solicitud."
    });
  }
};

// ---------- verificar código ----------
recoveryPasswordController.verifyCode = async (req, res) => {

  const { code } = req.body;
  try {
    // obtener token desde cookie (web) o Authorization header (móvil)
    const token = req.cookies.tokenRecoveryCode || 
                  (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                    ? req.headers.authorization.substring(7) 
                    : null);

    if (!token) return res.status(400).json({ message: "No se encontró token de recuperación." });

    const decoded = jsonwebtoken.verify(token, config.jwt.secret);

    if (decoded.code !== code) {
      return res.status(400).json({ message: "código incorrecto." });
    }

    // eliminar datos automáticos del token y mantener el resto
    const { exp, iat, ...rest } = decoded;


    // generar nuevo token con propiedad verified en true

    const newToken = jsonwebtoken.sign(
      { ...rest, verified: true },
      config.jwt.secret,
      { expiresIn: "20m" }
    );

    // guardar nuevo token en la cookie
    res.cookie("tokenRecoveryCode", newToken, {
      maxAge: 20 * 60 * 1000,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });

    res.json({ 
      message: "código verificado correctamente.",
      token: newToken // Incluir token para app móvil
    });
  } catch (error) {
    console.error("error en verifyCode:", error);
    res.status(400).json({ message: "token inválido o expirado." });
  }
};


// ---------- nueva contraseña ----------
recoveryPasswordController.newPassword = async (req, res) => {

  const { newPassword } = req.body;
  try {
    // obtener token desde cookie (web) o Authorization header (móvil)
    const token = req.cookies.tokenRecoveryCode || 
                  (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                    ? req.headers.authorization.substring(7) 
                    : null);

    if (!token) return res.status(400).json({ message: "No se encontró token de recuperación." });

    const decoded = jsonwebtoken.verify(token, config.jwt.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "el código no está verificado." });
    }

    // validar que la contraseña cumpla con longitud y carácter especial
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


    // comprobar que la nueva contraseña no sea igual a la actual
    const isSame = await bcryptjs.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "La nueva contraseña debe ser diferente de la actual." });

    }

    // encriptar nueva contraseña
    const hashed = await bcryptjs.hash(newPassword, 10);
    await Model.findOneAndUpdate({ email }, { password: hashed });


    // eliminar cookie del token de recuperación
    res.clearCookie("tokenRecoveryCode");

    res.json({ message: "contraseña actualizada correctamente." });
  } catch (error) {
    console.error("error en newPassword:", error);
    res.status(400).json({ message: "token inválido o expirado." });
  }
};

// exportar el controlador
export default recoveryPasswordController;

