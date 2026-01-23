import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { historialService, EstadisticaNumero, EstadisticasTurno } from '../../../services/historial.service';
import { turnosService } from '../../../services/turnos.service';
import { Turno, CategoriaTurno } from '../../../types';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { FiltroFecha } from '../components/FiltrosFecha';
import { getNicaraguaDateTime } from '../../../utils/dateUtils';

interface UseAnalisisNumerosParams {
  filtroFecha: FiltroFecha;
  fechaInicio: string | null;
  fechaFin: string | null;
  filtroCategoria: CategoriaTurno | null;
  filtroTurnoId: number | null;
}

export const useAnalisisNumeros = ({
  filtroFecha,
  fechaInicio,
  fechaFin,
  filtroCategoria,
  filtroTurnoId,
}: UseAnalisisNumerosParams) => {
  const [numeros, setNumeros] = useState<EstadisticaNumero[]>([]);
  const [estadisticasTurno, setEstadisticasTurno] = useState<EstadisticasTurno | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);

  const calcularFechasFiltro = useCallback(
    (filtro: FiltroFecha): { inicio: string | null; fin: string | null } => {
      // Usar fecha en zona horaria de Nicaragua
      const hoy = getNicaraguaDateTime();
      switch (filtro) {
        case 'ultimo-dia':
          return {
            inicio: format(startOfDay(hoy), 'yyyy-MM-dd'),
            fin: format(endOfDay(hoy), 'yyyy-MM-dd'),
          };
        case 'ultima-semana':
          return {
            inicio: format(startOfDay(subDays(hoy, 7)), 'yyyy-MM-dd'),
            fin: format(endOfDay(hoy), 'yyyy-MM-dd'),
          };
        case 'ultimos-15-dias':
          return {
            inicio: format(startOfDay(subDays(hoy, 15)), 'yyyy-MM-dd'),
            fin: format(endOfDay(hoy), 'yyyy-MM-dd'),
          };
        case 'ultimo-mes':
          return {
            inicio: format(startOfDay(subDays(hoy, 30)), 'yyyy-MM-dd'),
            fin: format(endOfDay(hoy), 'yyyy-MM-dd'),
          };
        case 'personalizado':
          return {
            inicio: fechaInicio,
            fin: fechaFin,
          };
        default:
          return { inicio: null, fin: null };
      }
    },
    [fechaInicio, fechaFin]
  );

  const loadTurnos = useCallback(async () => {
    try {
      const turnosData = await turnosService.getActivos();
      setTurnos(turnosData);
    } catch (error) {
      console.error('Error loading turnos:', error);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const fechas = calcularFechasFiltro(filtroFecha);

      const params: any = {};
      if (fechas.inicio) params.fechaInicio = fechas.inicio;
      if (fechas.fin) params.fechaFin = fechas.fin;
      if (filtroTurnoId) params.turnoId = filtroTurnoId;
      if (filtroCategoria) params.categoria = filtroCategoria;

      const response = await historialService.getAnalisisNumeros(params);

      if (response.succeeded && response.data) {
        setNumeros(response.data.numeros || []);
        setEstadisticasTurno(response.data.estadisticasTurno || null);
      } else {
        setNumeros([]);
        setEstadisticasTurno(null);
      }
    } catch (error) {
      console.error('Error loading análisis:', error);
      Alert.alert('Error', 'No se pudo cargar el análisis de números');
      setNumeros([]);
      setEstadisticasTurno(null);
    } finally {
      setLoading(false);
    }
  }, [filtroFecha, filtroCategoria, filtroTurnoId, calcularFechasFiltro]);

  useEffect(() => {
    loadTurnos();
  }, [loadTurnos]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    numeros,
    estadisticasTurno,
    turnos,
    loading,
    reloadData: loadData,
  };
};

