/*
Como vamos a validar si es cliente o administrador,
entonces importo ambos modelos
*/
import CustomersModel from "../models/Customers.js";
import AdministratorsModel from "../models/Administrator.js";
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

      return res.status(401).json({ 
        success: false, 
        message: "Usuario no encontrado" 
      });

    }

    // SISTEMA DE BLOQUEO POR INTENTOS FALLIDOS 
    // Verificar si el usuario está actualmente bloqueado
    if (userFound.lockUntil && userFound.lockUntil > Date.now()) {
      const minutosRestantes = Math.ceil((userFound.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Cuenta bloqueada. Intenta nuevamente en ${minutosRestantes} minutos`
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
          success: false,
          message: `Cuenta bloqueada por ${LOCK_TIME / 60000} minutos`
        });
      }

      // Guardar el nuevo número de intentos y mostrar intentos restantes
      await userFound.save();
      return res.status(401).json({

        success: false,
        message: `Contraseña incorrecta. Intentos restantes: ${MAX_ATTEMPTS - userFound.loginAttempts}`

      });
    }

    //  CONTRASEÑA CORRECTA 
    userFound.loginAttempts = 0;
    userFound.lockUntil = null;
    await userFound.save();

    // Generar token.jwt con la información del usuario
    const token = jsonwebtoken.sign(
      { 
        id: userFound._id,    // ID único del usuario
        userType             // Tipo: "admin" o "customer"
      },
      config.jwt.jwtSecret,      // Clave secreta para firmar el token
      { expiresIn: config.jwt.expiresIn }  // Tiempo de expiración
    );

    // Guardar el token en una cookie HTTP-only (más seguro)
    res.cookie("authToken", token, {
      path: '/',                         // Disponible en todas las rutas
      sameSite: 'lax',                  // Protección CSRF
      secure: false                      // false para desarrollo local (HTTP)
    });

    // Respuesta exitosa con formato esperado por el frontend
    res.json({ 
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: userFound._id,
        email: userFound.email,
        firstName: userFound.firstName || '',
        lastName: userFound.lastName || '',
        phone: userFound.phone || '',
        profilePicture: userFound.profilePicture || ''
      },
      userType: userType
    });

  } catch (error) {
    // Manejo de errores del servidor
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
};

export default loginController;