import { format } from 'date-fns';

/**
 * Parsea una fecha en formato YYYY-MM-DD sin problemas de zona horaria
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Date object con la fecha correcta en hora local
 */
export function parseDate(dateString: string | null | undefined): Date {
  if (!dateString) {
    return new Date(); // Retornar fecha actual si no hay fecha
  }
  
  // Si ya es un objeto Date, retornarlo
  if (dateString && typeof dateString === 'object' && 'getTime' in dateString && typeof (dateString as any).getTime === 'function') {
    return dateString as Date;
  }
  
  // Si es un string, parsearlo
  if (typeof dateString === 'string') {
    // Intentar parsear como YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      // Validar que los valores sean números válidos
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const date = new Date(year, month, day);
        // Validar que la fecha creada sea válida
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
    
    // Si no se pudo parsear, intentar con new Date()
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Si todo falla, retornar fecha actual
  return new Date();
}

/**
 * Formatea una fecha string (YYYY-MM-DD) a formato dd/MM/yyyy sin problemas de zona horaria
 * @param dateString - Fecha en formato YYYY-MM-DD o Date object
 * @returns String en formato dd/MM/yyyy
 */
export function formatDateString(dateString: string | Date | null | undefined): string {
  if (!dateString) {
    return format(new Date(), 'dd/MM/yyyy');
  }
  
  try {
    const date = typeof dateString === 'string' ? parseDate(dateString) : dateString;
    
    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return format(new Date(), 'dd/MM/yyyy');
    }
    
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formateando fecha:', error, dateString);
    return format(new Date(), 'dd/MM/yyyy');
  }
}

/**
 * Obtiene la fecha actual en la zona horaria de Nicaragua (UTC-6)
 * @returns String en formato YYYY-MM-DD
 */
export function getNicaraguaDate(): string {
  // Usar Intl.DateTimeFormat para obtener la fecha en zona horaria de Nicaragua
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Managua',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now);
}

/**
 * Obtiene la fecha y hora actual en la zona horaria de Nicaragua
 * @returns Date object con la fecha/hora de Nicaragua
 */
export function getNicaraguaDateTime(): Date {
  const now = new Date();
  // Obtener componentes de fecha/hora en zona horaria de Nicaragua
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Managua',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');
  
  return new Date(year, month, day, hour, minute, second);
}

/**
 * Formatea una hora desde un string ISO o Date, extrayendo la hora directamente
 * y convirtiéndola a la zona horaria de Nicaragua
 * @param fechaHora - String ISO (YYYY-MM-DDTHH:mm:ss) o Date object
 * @param includeSeconds - Si incluir segundos en el formato
 * @returns String en formato HH:mm o HH:mm:ss en hora de Nicaragua
 */
export function formatTimeString(fechaHora: string | Date | null | undefined, includeSeconds: boolean = false): string {
  if (!fechaHora) {
    return includeSeconds ? '00:00:00' : '00:00';
  }

  try {
    let date: Date;
    
    if (typeof fechaHora === 'string') {
      // Si es un string ISO, parsearlo y convertir a zona horaria de Nicaragua
      // Formato esperado: "2026-01-21T08:40:00.000Z" (UTC) o "2026-01-21 02:40:00" (local)
      
      // Intentar parsear como ISO string
      if (fechaHora.includes('T') || fechaHora.includes('Z')) {
        // Es un string ISO, crear Date y convertir a Nicaragua
        date = new Date(fechaHora);
        
        // Convertir a zona horaria de Nicaragua usando Intl.DateTimeFormat
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Managua',
          hour: '2-digit',
          minute: '2-digit',
          second: includeSeconds ? '2-digit' : undefined,
          hour12: false,
        });
        
        const parts = formatter.formatToParts(date);
        const hour = parts.find(p => p.type === 'hour')?.value || '00';
        const minute = parts.find(p => p.type === 'minute')?.value || '00';
        const second = includeSeconds ? (parts.find(p => p.type === 'second')?.value || '00') : null;
        
        if (includeSeconds && second) {
          return `${hour}:${minute}:${second}`;
        }
        return `${hour}:${minute}`;
      } else {
        // No es ISO, intentar extraer hora directamente del string
        const timeMatch = fechaHora.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
        if (timeMatch) {
          const hours = timeMatch[1];
          const minutes = timeMatch[2];
          const seconds = timeMatch[3] || '00';
          
          if (includeSeconds) {
            return `${hours}:${minutes}:${seconds}`;
          }
          return `${hours}:${minutes}`;
        }
        
        // Si no se puede extraer, intentar con Date
        date = new Date(fechaHora);
      }
    } else {
      date = fechaHora;
    }
    
    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return includeSeconds ? '00:00:00' : '00:00';
    }
    
    // Si llegamos aquí y es un Date object, convertir a Nicaragua
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Managua',
      hour: '2-digit',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: false,
    });
    
    const parts = formatter.formatToParts(date);
    const hour = parts.find(p => p.type === 'hour')?.value || '00';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';
    const second = includeSeconds ? (parts.find(p => p.type === 'second')?.value || '00') : null;
    
    if (includeSeconds && second) {
      return `${hour}:${minute}:${second}`;
    }
    return `${hour}:${minute}`;
  } catch (error) {
    console.error('Error formateando hora:', error, fechaHora);
    return includeSeconds ? '00:00:00' : '00:00';
  }
}

/**
 * Convierte una fecha a la zona horaria de Nicaragua
 * @param date - Fecha a convertir
 * @returns String en formato YYYY-MM-DD
 */
export function toNicaraguaDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Managua',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}
