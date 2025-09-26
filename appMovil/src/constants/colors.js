// Paleta de colores basada en el nuevo diseño
export const COLORS = {
  // Colores principales
  primary: '#000000',           // Negro para botones principales
  secondary: '#F5E6E8',         // Rosa suave para acentos
  accent: '#F0D0D7',           // Rosa medio para elementos destacados
  
  // Fondos
  background: '#FEFEFE',        // Fondo principal blanco
  backgroundSecondary: '#FFF8F8', // Fondo secundario crema muy claro
  cardBackground: '#FFFFFF',    // Fondo de cards
  
  // Textos
  textPrimary: '#2D2D2D',      // Texto principal
  textSecondary: '#666666',     // Texto secundario
  textLight: '#888888',         // Texto claro
  textMuted: '#AAAAAA',         // Texto muy claro
  
  // Estados
  success: '#4CAF50',           // Verde para éxito
  warning: '#FF9800',           // Naranja para advertencias
  error: '#F44336',             // Rojo para errores
  info: '#2196F3',              // Azul para información
  
  // Elementos UI
  border: '#E8E8E8',            // Bordes suaves
  borderLight: '#F0F0F0',       // Bordes muy suaves
  shadow: 'rgba(0, 0, 0, 0.08)', // Sombras suaves
  shadowMedium: 'rgba(0, 0, 0, 0.12)', // Sombras medias
  
  // Transparencias
  overlay: 'rgba(0, 0, 0, 0.5)', // Overlay oscuro
  overlayLight: 'rgba(255, 255, 255, 0.9)', // Overlay claro
  
  // Gradientes
  gradientPrimary: ['#FEFEFE', '#FFF8F8'],
  gradientSecondary: ['#F5E6E8', '#F0D0D7'],
  gradientCard: ['#FFFFFF', '#FEFEFE'],
};

// Espaciado consistente
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tamaños de fuente
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  title: 32,
};

// Radios de borde
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

// Sombras
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadowMedium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};
