import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function validateAuthToken(rolesPermitidos = []) {
  return (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
      const decoded = jwt.verify(token, config.JWT.JWT_SECRET);

      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.userType)) {
        return res.status(403).json({ message: "No tienes permiso" });
      }

      req.userId = decoded.id;
      req.userType = decoded.userType;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
}
