/**
 * Utilidades para conversión de colores
 */

export const hexToRgba = (hex: string, opacity: number = 1): string => {
  // Remover el # si existe
  const cleanHex = hex.replace('#', '');
  
  // Si es formato corto (3 caracteres), expandir
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;
  
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

