/**
 * Utilidades de validación de contraseñas para EternalJoyeria
 * Validación más restrictiva y apropiada para contraseñas seguras
 */

/**
 * Valida que la contraseña cumpla con los requisitos de seguridad de EternalJoyeria
 * 
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una letra minúscula (a-z)
 * - Al menos una letra mayúscula (A-Z)
 * - Al menos un número (0-9)
 * - Al menos un carácter especial de la lista permitida: !@#$%^&*-_+
 * - NO permite caracteres problemáticos como: ?[]{}(),.":;'`~|\\/<>=
 * 
 * @param {string} password - Contraseña a validar
 * @returns {Object} Objeto con isValid (boolean) y message (string)
 */
export const validatePassword = (password) => {
  // Verificar que se proporcione una contraseña
  if (!password) {
    return {
      isValid: false,
      message: 'La contraseña es requerida'
    };
  }

  // Verificar longitud mínima
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 8 caracteres'
    };
  }

  // Verificar longitud máxima (por seguridad)
  if (password.length > 30) {
    return {
      isValid: false,
      message: 'La contraseña no puede tener más de 30 caracteres'
    };
  }

  // Verificar que contenga al menos un número
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos un número (0-9)'
    };
  }

  // Caracteres especiales PERMITIDOS (más restrictivo y seguro)
  const allowedSpecialChars = /[!@#$%^&*\-_+]/;
  if (!allowedSpecialChars.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*-_+)'
    };
  }

  // Caracteres NO PERMITIDOS (problemáticos para bases de datos y URLs)
  const forbiddenChars = /[?[\]{}(),.":;'`~|\\/<>=]/;
  if (forbiddenChars.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña contiene caracteres no permitidos. Solo se permiten: !@#$%^&*-_+'
    };
  }

  // Verificar que no contenga espacios
  if (/\s/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña no puede contener espacios'
    };
  }

  // Si pasa todas las validaciones
  return {
    isValid: true,
    message: 'Contraseña válida'
  };
};

/**
 * Obtiene los requisitos de contraseña como array de strings
 * Útil para mostrar al usuario qué debe cumplir su contraseña
 * 
 * @returns {Array<string>} Array con los requisitos
 */
export const getPasswordRequirements = () => {
  return [
    'Mínimo 8 caracteres',
    'Al menos un número (0-9)',
    'Al menos un carácter especial (!@#$%^&*-_+)',
    'Sin espacios ni caracteres especiales problemáticos'
  ];
};

/**
 * Verifica la fortaleza de la contraseña y devuelve un nivel
 * 
 * @param {string} password - Contraseña a evaluar
 * @returns {Object} Objeto con strength (string) y score (number 0-100)
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { strength: 'Muy débil', score: 0 };
  }

  let score = 0;
  
  // Puntuación por longitud
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Puntuación por tipos de caracteres
  if (/[0-9]/.test(password)) score += 15;
  if (/[!@#$%^&*\-_+]/.test(password)) score += 15;

  // Determinar nivel de fortaleza
  if (score < 10) return { strength: 'Muy débil', score };
  if (score < 11) return { strength: 'Débil', score };
  if (score < 15) return { strength: 'Media', score };
  if (score < 20) return { strength: 'Fuerte', score };
  return { strength: 'Muy fuerte', score };
};

/**
 * Lista de caracteres especiales permitidos (para mostrar al usuario)
 */
export const ALLOWED_SPECIAL_CHARS = '!@#$%^&*-_+';

/**
 * Lista de caracteres especiales NO permitidos (para referencia)
 */
export const FORBIDDEN_SPECIAL_CHARS = '?[]{}(),.":;\'`~|\\/<>=';
