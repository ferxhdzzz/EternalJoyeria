import Cookies from 'js-cookie'; // <-- ¡IMPORTAR LA LIBRERÍA!

// URL de tu API 
export const API_BASE_URL = 'https://eternaljoyeria-cg5d.onrender.com/api'; 

/**
 * Obtiene el token JWT. 
 * ¡Cambiado para leer de las cookies!
 * @returns {string | null} El token JWT o null si no existe.
 */
export const getAuthToken = () => {
    // 🚨 ASUME que el nombre de tu cookie es 'token' o el nombre que uses en el backend
    // Si tu cookie se llama diferente (ej: 'jwt'), debes cambiar 'token' aquí.
    const token = Cookies.get('token'); 

    // Opcionalmente, si también lo guardas en localStorage, puedes hacer un fallback:
    // return token || localStorage.getItem('token'); 
    
    return token;
};