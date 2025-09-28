// middlewares/auth.js
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.authToken; // 👈 JWT desde cookie
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const decoded = jwt.verify(token, config.jwt.secret);
      req.userId = decoded.id;
      req.userType = decoded.userType;

      if (allowedUserTypes.length && !allowedUserTypes.includes(decoded.userType)) {
        return res.status(403).json({ message: "Permisos insuficientes" });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado", expiredAt: error.expiredAt });
      }
      return res.status(401).json({ message: "Token inválido" });
    }
  };
};
