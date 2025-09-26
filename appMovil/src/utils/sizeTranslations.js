/**
 * Utilidades para traducir tallas y medidas
 * Centraliza todas las traducciones de tallas para consistencia en la app
 */

/**
 * Traduce una talla del inglés al español
 * @param {string} size - Talla en inglés o español
 * @returns {string} - Talla traducida al español
 */
export const translateSize = (size) => {
  if (!size || typeof size !== 'string') return 'Talla única';
  
  const sizeStr = size.trim().toLowerCase();
  
  // Mapeo de traducciones
  const translations = {
    // Tallas únicas
    'one size': 'Talla única',
    'unique': 'Talla única',
    'unica': 'Talla única',
    'free size': 'Talla libre',
    'adjustable': 'Ajustable',
    
    // Tallas descriptivas
    'small': 'Pequeña',
    'medium': 'Mediana',
    'large': 'Grande',
    
    // Tallas estándar (se mantienen)
    'xs': 'XS',
    'extra small': 'XS',
    's': 'S',
    'm': 'M',
    'l': 'L',
    'xl': 'XL',
    'extra large': 'XL',
    'xxl': 'XXL',
    '2xl': 'XXL',
    
    // Tallas numéricas (se mantienen como están)
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    '11': '11',
    '12': '12',
  };
  
  // Buscar traducción exacta
  if (translations[sizeStr]) {
    return translations[sizeStr];
  }
  
  // Si no encuentra traducción, devolver la talla original capitalizada
  return size.charAt(0).toUpperCase() + size.slice(1);
};

/**
 * Obtiene todas las traducciones disponibles
 * @returns {Object} - Objeto con todas las traducciones
 */
export const getAllSizeTranslations = () => {
  return {
    'one size': 'Talla única',
    'unique': 'Talla única',
    'unica': 'Talla única',
    'free size': 'Talla libre',
    'adjustable': 'Ajustable',
    'small': 'Pequeña',
    'medium': 'Mediana',
    'large': 'Grande',
    'xs': 'XS',
    'extra small': 'XS',
    's': 'S',
    'm': 'M',
    'l': 'L',
    'xl': 'XL',
    'extra large': 'XL',
    'xxl': 'XXL',
    '2xl': 'XXL',
  };
};
