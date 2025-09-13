// backend/src/middlewares/validateAuthToken.js
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      console.log('🔐 Middleware validateAuthToken ejecutándose...');
      console.log('🔐 URL solicitada:', req.originalUrl);
      console.log('🔐 Método HTTP:', req.method);
      
      // 1. Obtener el token de las cookies o del header Authorization
      let token = req.cookies?.authToken;
      
      // Si no está en las cookies, intentar obtenerlo del header Authorization
      if (!token && (req.headers.authorization || req.headers.Authorization)) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1]; // Obtener el token después de 'Bearer '
          console.log('🔐 Token obtenido del header Authorization');
        }
      }

      // Si no hay token, devolver error
      if (!token) {
        console.log('❌ No se proporcionó token de autenticación');
        return res.status(401).json({ 
          success: false,
          message: "Token no proporcionado. Debes iniciar sesión.",
          code: "NO_TOKEN"
        });
      }

      console.log('🔐 Token encontrado, verificando...');

      // Verificar y decodificar el token
      let decoded;
      try {
        decoded = jwt.verify(token, config.jwt.jwtSecret);
        console.log('✅ Token verificado correctamente:', {
          id: decoded.id,
          email: decoded.email,
          userType: decoded.userType || 'customer' // Valor por defecto
        });
      } catch (error) {
        console.error('❌ Error al verificar el token:', error);
        
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        return res.status(401).json({
          success: false,
          message: 'Token inválido o expirado',
          code: 'INVALID_TOKEN'
        });
      }

      // Validar contra la lista de roles permitidos
      const userType = decoded.userType || 'customer'; // Valor por defecto
      if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(userType)) {
        console.log('❌ Usuario no tiene permisos:', userType, 'Permitidos:', allowedUserTypes);
        return res.status(403).json({ 
          success: false,
          message: 'Acceso denegado. No tienes permisos suficientes.',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Asignar información del usuario al request
      req.userId = decoded.id;
      req.userType = userType; // Ya tiene el valor por defecto si es necesario
      req.email = decoded.email;
      
      console.log('✅ Middleware completado, información establecida:', {
        userId: req.userId,
        userType: req.userType,
        email: req.email,
        url: req.originalUrl
      });

      next();
    } catch (error) {
      console.error("❌ Error al validar token:", error);
      
      if (error.name === 'TokenExpiredError') {
        console.log('❌ Token expirado:', error.expiredAt);
        return res.status(401).json({ 
          message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          code: "TOKEN_EXPIRED",
          expiredAt: error.expiredAt
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        console.log('❌ Token inválido');
        return res.status(401).json({ 
          message: "Token inválido. Por favor, inicia sesión nuevamente.",
          code: "INVALID_TOKEN"
        });
      }
      
      console.log('❌ Error desconocido en validación de token');
      return res.status(401).json({ 
        message: "Error de autenticación. Por favor, inicia sesión nuevamente.",
        code: "AUTH_ERROR"
      });
    }
  };
};
