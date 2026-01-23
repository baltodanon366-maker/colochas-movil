// Paleta de colores Morado y Dorado - Colochas
export const Colors = {
  // Colores principales
  primary: '#6A1B9A',        // Morado oscuro principal
  primaryLight: '#9C27B0',   // Morado medio
  primaryDark: '#4A148C',    // Morado muy oscuro
  
  secondary: '#D4AF37',      // Dorado principal
  secondaryLight: '#F4D03F', // Dorado claro
  secondaryDark: '#B8941F',  // Dorado oscuro
  
  // Colores de acento
  accent: '#BA68C8',         // Morado claro/accent
  accentLight: '#E1BEE7',    // Morado muy claro
  
  // Colores de estado
  success: '#9C27B0',        // Morado éxito
  successLight: '#E1BEE7',   // Morado éxito claro
  warning: '#FFC107',        // Amarillo/dorado advertencia
  warningLight: '#FFF9C4',   // Amarillo claro
  danger: '#F44336',         // Rojo error
  dangerLight: '#FFCDD2',    // Rojo claro
  info: '#2196F3',           // Azul info
  infoLight: '#BBDEFB',      // Azul claro
  
  // Textos
  text: {
    primary: '#1A1A1A',      // Texto principal (casi negro)
    secondary: '#4A4A4A',    // Texto secundario
    tertiary: '#757575',     // Texto terciario
    inverse: '#FFFFFF',      // Texto sobre fondos oscuros
    onPrimary: '#FFFFFF',    // Texto sobre morado
    onSecondary: '#1A1A1A',  // Texto sobre dorado
  },
  
  // Fondos
  background: {
    primary: '#F5F5F5',      // Fondo principal (gris muy claro)
    secondary: '#FFFFFF',    // Fondo secundario (blanco)
    tertiary: '#FAFAFA',     // Fondo terciario
    card: '#FFFFFF',         // Fondo de cards
    header: '#6A1B9A',       // Fondo de header (morado oscuro)
    headerGradient: ['#6A1B9A', '#9C27B0'], // Gradiente header
  },
  
  // Bordes
  border: {
    light: '#E0E0E0',        // Borde claro
    medium: '#BDBDBD',       // Borde medio
    dark: '#757575',         // Borde oscuro
    primary: '#6A1B9A',      // Borde morado
    secondary: '#D4AF37',    // Borde dorado
  },
  
  // Estados
  disabled: '#E0E0E0',       // Deshabilitado
  disabledText: '#9E9E9E',   // Texto deshabilitado
  error: '#F44336',          // Error
  errorLight: '#FFEBEE',    // Error claro
  
  // Gradientes
  gradients: {
    primary: ['#6A1B9A', '#9C27B0'],      // Gradiente morado
    secondary: ['#D4AF37', '#F4D03F'],    // Gradiente dorado
    header: ['#6A1B9A', '#9C27B0'],       // Gradiente header
    success: ['#9C27B0', '#BA68C8'],       // Gradiente éxito
  },
  
  // Sombras
  shadow: {
    color: '#000000',
    opacity: 0.1,
  },

  // Input (para compatibilidad con componentes)
  input: {
    border: '#BDBDBD',
    borderFocused: '#6A1B9A',
    background: '#FFFFFF',
    text: '#1A1A1A',
    placeholder: '#757575',
  },
};

// Colores específicos para componentes
export const ComponentColors = {
  button: {
    primary: Colors.primary,
    primaryPressed: Colors.primaryDark,
    secondary: Colors.secondary,
    secondaryPressed: Colors.secondaryDark,
    success: Colors.success,
    danger: Colors.danger,
  },
  input: {
    border: Colors.border.medium,
    borderFocused: Colors.primary,
    background: Colors.background.secondary,
    text: Colors.text.primary,
    placeholder: Colors.text.tertiary,
  },
  card: {
    background: Colors.background.card,
    border: Colors.border.light,
    shadow: Colors.shadow,
  },
};
