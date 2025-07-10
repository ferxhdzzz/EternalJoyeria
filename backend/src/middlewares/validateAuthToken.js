import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      // 1. Extraer el token de las cookies
      const { authToken } = req.cookies;

      // 2. Si no hay token, denegar acceso
      if (!authToken) {
        return res.status(401).json({ message: "Token no proporcionado. Debes iniciar sesión." });
      }

      // 3. Verificar y decodificar el token
      const decoded = jwt.verify(authToken, config.JWT.JWT_SECRET);

      // 4. Verificar tipo de usuario si se especificaron roles permitidos
      if (allowedUserTypes.length && !allowedUserTypes.includes(decoded.userType)) {
        return res.status(403).json({ message: "Acceso denegado. No tienes permisos suficientes." });
      }

      // 5. Guardar datos en el request para usarlos después
      req.userId = decoded.id;
      req.userType = decoded.userType;

      next();
    } catch (error) {
      console.error("Error al validar token:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};

