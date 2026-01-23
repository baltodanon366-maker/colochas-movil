import { Turno, CategoriaTurno } from '../types';

/**
 * Detecta el turno actual basado en la hora del sistema
 * @param turnos Lista de turnos activos de una categoría
 * @returns El turno actual o null si no hay turno activo en este momento
 */
export function detectarTurnoActual(turnos: Turno[]): Turno | null {
  if (!turnos || turnos.length === 0) {
    return null;
  }

  const ahora = new Date();
  const horaActual = ahora.getHours();
  const minutosActual = ahora.getMinutes();

  // Convertir hora actual a minutos desde medianoche para comparar
  const minutosActuales = horaActual * 60 + minutosActual;

  // Ordenar turnos por hora de inicio
  const turnosOrdenados = turnos
    .filter(t => t.hora && t.estado === 'activo')
    .map(t => {
      const [h, m] = (t.hora || '00:00').split(':').map(Number);
      const minutosInicio = h * 60 + m;
      
      // Calcular minutos de cierre
      let minutosCierre: number | null = null;
      if (t.horaCierre) {
        const [hc, mc] = t.horaCierre.split(':').map(Number);
        minutosCierre = hc * 60 + mc;
        // Si la hora de cierre es menor que la de inicio, asumimos que es del día siguiente
        if (minutosCierre < minutosInicio) {
          minutosCierre += 24 * 60;
        }
      }
      
      return {
        turno: t,
        minutosInicio,
        minutosCierre,
      };
    })
    .sort((a, b) => a.minutosInicio - b.minutosInicio);

  // Buscar el turno actual (que esté activo en este momento)
  for (let i = 0; i < turnosOrdenados.length; i++) {
    const turnoData = turnosOrdenados[i];

    // Si hay hora de cierre, verificar que estemos dentro del rango
    if (turnoData.minutosCierre !== null) {
      if (
        minutosActuales >= turnoData.minutosInicio &&
        minutosActuales < turnoData.minutosCierre
      ) {
        return turnoData.turno;
      }
    } else {
      // Si no hay hora de cierre, usar el siguiente turno como límite
      const siguienteTurno = turnosOrdenados[i + 1];
      const limiteSuperior = siguienteTurno
        ? siguienteTurno.minutosInicio
        : 24 * 60; // Medianoche del día siguiente

      if (
        minutosActuales >= turnoData.minutosInicio &&
        minutosActuales < limiteSuperior
      ) {
        return turnoData.turno;
      }
    }
  }

  // Si no se encontró ningún turno activo en el rango actual,
  // buscar el turno más próximo que aún no haya comenzado
  const turnoProximo = turnosOrdenados.find(t => t.minutosInicio > minutosActuales);
  if (turnoProximo) {
    return turnoProximo.turno;
  }

  // Si todos los turnos ya pasaron, retornar el último turno del día
  // (útil para cuando es muy tarde y queremos seguir vendiendo en el último turno)
  if (turnosOrdenados.length > 0) {
    const ultimoTurno = turnosOrdenados[turnosOrdenados.length - 1];
    // Solo retornar el último turno si ya pasó su hora de inicio
    if (minutosActuales >= ultimoTurno.minutosInicio) {
      return ultimoTurno.turno;
    }
  }

  return null;
}

/**
 * Formatea el nombre del turno para mostrar
 * @param turno El turno a formatear
 * @returns String formateado como "Turno 1 PM - La Tica"
 */
export function formatearNombreTurno(turno: Turno): string {
  const categoriaNombre = turno.categoria === 'diaria' ? 'La Diaria' : 'La Tica';
  return `${turno.nombre} - ${categoriaNombre}`;
}

