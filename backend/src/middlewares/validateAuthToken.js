import jwt from "jsonwebtoken";
// Asegúrate de que este path es correcto para importar tu configuración
import { config } from "../config.js";

/**
 * Middleware para validar el JWT de la cookie y verificar los roles de acceso.
 * @param {Array<string>} allowedRoles - Array de roles permitidos (e.g., ["admin", "customer"]).
 * @returns {function} Función middleware de Express.
 */
export const validateAuthToken = (allowedRoles) => (req, res, next) => {
    // 1. Obtener el token de la cookie
    // El nombre de la cookie debe coincidir exactamente con el usado en loginController.js ("authToken")
    const token = req.cookies.authToken;

    if (!token) {
        console.log("Acceso denegado: Token no encontrado en las cookies.");
        return res.status(401).json({ 
            success: false, 
            message: "Acceso denegado. No se ha proporcionado un token." 
        });
    }

    // 2. Verificar y decodificar el token
    try {
        // La clave secreta debe coincidir con la usada para firmar el token en el login
        const decoded = jwt.verify(token, config.jwt.secret); 
        
        // El payload del token es { id: user._id, userType }
        const { id, userType } = decoded;

        // 3. Verificar si el rol del usuario está permitido
        if (!allowedRoles.includes(userType)) {
            console.log(`Acceso denegado: El usuario de tipo '${userType}' no tiene permiso para acceder a esta ruta.`);
            return res.status(403).json({ 
                success: false, 
                message: "Acceso prohibido. Permisos insuficientes." 
            });
        }

        // 4. Adjuntar datos de usuario a la solicitud y continuar
        // Esto permite acceder a req.userId y req.userType en los controladores subsiguientes
        req.userId = id;
        req.userType = userType; 

        next();
    } catch (error) {
        // Manejar errores de token (expiración, firma inválida, etc.)
        console.error("Error de verificación de JWT:", error.message);
        
        // Opcional: Limpiar la cookie expirada o inválida
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || req.protocol === 'https',
            sameSite: "none",
            path: "/",
        });

        return res.status(401).json({ 
            success: false, 
            message: "Token inválido o expirado." 
        });
    }
};