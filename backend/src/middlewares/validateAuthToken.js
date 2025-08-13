// backend/src/middlewares/validateAuthToken.js
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      const { authToken } = req.cookies;
      if (!authToken) {
        return res.status(401).json({ message: "Token no proporcionado. Debes iniciar sesión." });
      }


      // 3. Verificar y decodificar el token
      const decoded = jwt.verify(authToken, config.jwt.jwtSecret);


      // Validar contra la lista de roles permitidos
      if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decoded.userType)) {
        return res.status(403).json({ message: "Acceso denegado. No tienes permisos suficientes." });
      }

      req.userId = decoded.id;
      req.userType = decoded.userType;

      next();
    } catch (error) {
      console.error("Error al validar token:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};
