// backend/src/middlewares/validateAuthToken.js
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      console.log(' Middleware validateAuthToken ejecutándose...');
      console.log(' Cookies recibidas:', req.cookies);
      console.log(' URL solicitada:', req.originalUrl);
      console.log(' Método HTTP:', req.method);
      
      const { authToken } = req.cookies;
      if (!authToken) {
        console.log(' No hay authToken en cookies');
        return res.status(401).json({ 
          message: "Token no proporcionado. Debes iniciar sesión.",
          code: "NO_TOKEN"
        });
      }

      console.log('🔐 Token encontrado, verificando...');

      // 3. Verificar y decodificar el token
      const decoded = jwt.verify(authToken, config.jwt.jwtSecret);
      console.log(' Token verificado correctamente:', {
        id: decoded.id,
        email: decoded.email,
        userType: decoded.userType
      });

      // Validar contra la lista de roles permitidos
      if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decoded.userType)) {
        console.log(' Usuario no tiene permisos:', decoded.userType, 'Permitidos:', allowedUserTypes);
        return res.status(403).json({ 
          message: "Acceso denegado. No tienes permisos suficientes.",
          code: "INSUFFICIENT_PERMISSIONS"
        });
      }

      req.userId = decoded.id;
      req.userType = decoded.userType;
      
      console.log(' Middleware completado, userId establecido:', req.userId);

      next();
    } catch (error) {
      console.error(" Error al validar token:", error);
      
      if (error.name === 'TokenExpiredError') {
        console.log(' Token expirado:', error.expiredAt);
        return res.status(401).json({ 
          message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          code: "TOKEN_EXPIRED",
          expiredAt: error.expiredAt
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        console.log(' Token inválido');
        return res.status(401).json({ 
          message: "Token inválido. Por favor, inicia sesión nuevamente.",
          code: "INVALID_TOKEN"
        });
      }
      
      console.log(' Error desconocido en validación de token');
      return res.status(401).json({ 
        message: "Error de autenticación. Por favor, inicia sesión nuevamente.",
        code: "AUTH_ERROR"
      });
    }
  };
};
