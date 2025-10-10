import jwt from "jsonwebtoken";
// Asegúrate de que este path es correcto para importar tu configuración
import { config } from "../config.js";

/**
 * Middleware para validar el JWT de la cookie y verificar los roles de acceso.
 * @param {Array<string>} allowedRoles - Array de roles permitidos (e.g., ["admin", "customer"]).
 * @returns {function} Función middleware de Express.
 */
export const validateAuthToken = (allowedRoles) => (req, res, next) => {
    console.log(`🔐 [AUTH] Validando token para ruta: ${req.method} ${req.path}`);
    
    // 1. Obtener el token de cookies (web) o headers (móvil)
    let token = req.cookies.authToken; // Para frontend web
    console.log(`🔐 [AUTH] Token en cookies: ${token ? 'SÍ' : 'NO'}`);
    
    // Si no hay token en cookies, buscar en headers (para app móvil)
    if (!token) {
        const authHeader = req.headers.authorization || req.headers['x-access-token'];
        console.log(`🔐 [AUTH] Authorization header: ${authHeader ? 'SÍ' : 'NO'}`);
        if (authHeader) {
            // Si viene como "Bearer TOKEN", extraer solo el TOKEN
            token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
            console.log(`🔐 [AUTH] Token extraído de header: ${token ? 'SÍ' : 'NO'}`);
        }
    }

    if (!token) {
        console.log("Acceso denegado: Token no encontrado en cookies ni headers.");
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

        console.log(`✅ [AUTH] Token válido - Usuario: ${id}, Tipo: ${userType}`);
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