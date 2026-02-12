import { Turno } from '../types';
import { getNicaraguaDate, getNicaraguaDateTime } from './dateUtils';

/** Hora de inicio de ventas (Nicaragua): 6:00 AM en minutos desde medianoche */
const MINUTOS_INICIO_VENTAS = 6 * 60; // 360

/** Minutos antes del cierre en que se bloquea la venta (por defecto 10) */
const MINUTOS_BLOQUEO_DEFAULT = 10;

function parseHoraToMinutes(hora: string): number {
  const [h, m] = hora.trim().split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Detecta el turno actual (por defecto) en hora Nicaragua.
 * Ventas desde las 6 AM. Turno actual = primer turno cuya ventana [hora, hora_cierre - tiempoBloqueo) contiene la hora actual.
 * Si no hay ninguno en esa ventana pero hay turnos vendibles, devuelve el primero de ellos para que siempre se pueda crear venta.
 * @param turnos Lista de turnos activos de una categoría
 * @returns El turno actual o null (ej. antes de las 6 AM o después del último cierre)
 */
export function detectarTurnoActual(turnos: Turno[]): Turno | null {
  if (!turnos || turnos.length === 0) return null;

  const nowNic = getNicaraguaDateTime();
  const minutosActuales = nowNic.getHours() * 60 + nowNic.getMinutes();

  if (minutosActuales < MINUTOS_INICIO_VENTAS) return null;

  const today = getNicaraguaDate();
  const turnosOrdenados = turnos
    .filter((t) => t.estado === 'activo' && t.hora && (t.horaCierre ?? (t as any).hora_cierre))
    .map((t) => {
      const horaCierre = t.horaCierre ?? (t as any).hora_cierre ?? t.hora!;
      const minutosInicio = parseHoraToMinutes(t.hora!);
      const minutosCierre = parseHoraToMinutes(horaCierre);
      const bloqueo = t.tiempoBloqueo ?? (t as any).tiempo_bloqueo ?? MINUTOS_BLOQUEO_DEFAULT;
      const limiteVenta = minutosCierre - bloqueo;
      return { turno: t, minutosInicio, minutosCierre, limiteVenta };
    })
    .sort((a, b) => a.minutosInicio - b.minutosInicio);

  let actual = turnosOrdenados.find(
    (t) => minutosActuales >= t.minutosInicio && minutosActuales < t.limiteVenta
  );
  if (actual) return actual.turno;
  const proximos = getTurnosProximos(turnos, today);
  return proximos.length > 0 ? proximos[0] : null;
}

/**
 * Indica si un turno ya no es vendible para la fecha dada (zona Nicaragua).
 * - Fecha pasada: ya pasó.
 * - Fecha futura: no pasó.
 * - Hoy: no vendible si estamos antes de las 6 AM o si ya pasó el cierre menos tiempo de bloqueo (ej. 10 min antes de hora_cierre).
 */
export function turnoYaPasado(turno: Turno, fecha: string): boolean {
  const today = getNicaraguaDate();
  if (fecha < today) return true;
  if (fecha > today) return false;
  const horaCierre = turno.horaCierre ?? (turno as any).hora_cierre;
  if (!turno.hora || !horaCierre) return false;

  const nowNic = getNicaraguaDateTime();
  const minutosActuales = nowNic.getHours() * 60 + nowNic.getMinutes();

  if (minutosActuales < MINUTOS_INICIO_VENTAS) return true; // Antes de las 6 AM ningún turno está disponible hoy
  const minutosCierre = parseHoraToMinutes(horaCierre);
  const bloqueo = turno.tiempoBloqueo ?? (turno as any).tiempo_bloqueo ?? MINUTOS_BLOQUEO_DEFAULT;
  return minutosActuales >= minutosCierre - bloqueo;
}

/**
 * Devuelve los turnos aún vendibles para la fecha dada, ordenados por hora de inicio (zona Nicaragua).
 * Desde las 6 AM; cada turno se cierra 10 min (o tiempoBloqueo) antes de hora_cierre.
 */
export function getTurnosProximos(turnos: Turno[], fecha: string): Turno[] {
  if (!turnos?.length) return [];

  const today = getNicaraguaDate();
  if (fecha === today) {
    const nowNic = getNicaraguaDateTime();
    const minutosActuales = nowNic.getHours() * 60 + nowNic.getMinutes();
    if (minutosActuales < MINUTOS_INICIO_VENTAS) return [];
  }

  return turnos
    .filter((t) => t.estado === 'activo' && t.hora && (t.horaCierre ?? (t as any).hora_cierre) && !turnoYaPasado(t, fecha))
    .map((t) => ({
      turno: t,
      minutosInicio: parseHoraToMinutes(t.hora!),
    }))
    .sort((a, b) => a.minutosInicio - b.minutosInicio)
    .map((x) => x.turno);
}

/**
 * Formatea el nombre del turno para mostrar
 */
export function formatearNombreTurno(turno: Turno): string {
  const categoriaNombre = turno.categoria === 'diaria' ? 'La Diaria' : 'La Tica';
  return `${turno.nombre} - ${categoriaNombre}`;
}
