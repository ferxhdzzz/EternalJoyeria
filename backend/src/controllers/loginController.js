/*
Como vamos a validar si es cliente o administrador,
entonces importo ambos modelos
*/
import CustomersModel from "../models/Customers.js";
import AdministratorsModel from "../models/administrators.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

const MAX_ATTEMPTS = 3;               // Máximo de intentos fallidos permitidos
const LOCK_TIME = 15 * 60 * 1000;     // Tiempo de bloqueo (15 minutos en milisegundos)

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound; 
    let userType; 

    // 1. Buscar primero en la tabla de administradores
    userFound = await AdministratorsModel.findOne({ email });
    userType = "admin";

    // 2. Si no es administrador, buscar en la tabla de clientes
    if (!userFound) {
      userFound = await CustomersModel.findOne({ email });
      userType = "customer";
    }

    // Si no encontramos el usuario en ninguna tabla
    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    // SISTEMA DE BLOQUEO POR INTENTOS FALLIDOS 
    // Verificar si el usuario está actualmente bloqueado
    if (userFound.lockUntil && userFound.lockUntil > Date.now()) {
      const minutosRestantes = Math.ceil((userFound.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        message: `Account locked. Try again in ${minutosRestantes} minutes`
      });
    }

    // Validar la contraseña usando bcrypt
    const isMatch = await bcryptjs.compare(password, userFound.password);
    if (!isMatch) {
      // Si la contraseña es incorrecta → incrementar contador de intentos
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      // Si alcanzó el máximo de intentos → bloquear cuenta
      if (userFound.loginAttempts >= MAX_ATTEMPTS) {
        userFound.lockUntil = Date.now() + LOCK_TIME;
        await userFound.save();
        return res.status(403).json({
          message: `Account locked for ${LOCK_TIME / 60000} minutes`
        });
      }

      // Guardar el nuevo número de intentos y mostrar intentos restantes
      await userFound.save();
      return res.json({
        message: `Invalid password. Remaining attempts: ${MAX_ATTEMPTS - userFound.loginAttempts}`
      });
    }

    //  CONTRASEÑA CORRECTA 
    // Resetear contador de intentos y tiempo de bloqueo
    userFound.loginAttempts = 0;
    userFound.lockUntil = null;
    await userFound.save();

    // Generar token JWT con la información del usuario
    const token = jsonwebtoken.sign(
      { 
        id: userFound._id,    // ID único del usuario
        userType             // Tipo: "admin" o "customer"
      },
      config.JWT.secret,      // Clave secreta para firmar el token
      { expiresIn: config.JWT.expiresIn }  // Tiempo de expiración
    );

    // Guardar el token en una cookie HTTP-only (más seguro)
    res.cookie("authToken", token, {
      httpOnly: true,                    // Solo accesible desde el servidor
      maxAge: 24 * 60 * 60 * 1000,      // 24 horas en milisegundos
      path: '/',                         // Disponible en todas las rutas
      sameSite: 'lax'                   // Protección CSRF
    });

    // Respuesta exitosa
    res.json({ message: "login successful" });

  } catch (error) {
    // Manejo de errores del servidor
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default loginController;