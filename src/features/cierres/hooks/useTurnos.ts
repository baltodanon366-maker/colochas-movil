import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { turnosService } from '../../../services/turnos.service';
import { restriccionesService } from '../../restricciones/services/restricciones.service';
import { Turno, CategoriaTurno, RestriccionNumero } from '../../../types';

export const useTurnos = (categoria: CategoriaTurno | null, selectedTurnoId: number | null, fecha: string) => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [restricciones, setRestricciones] = useState<RestriccionNumero[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!categoria) return;

    setLoading(true);
    try {
      const turnosData = await turnosService.getActivos(categoria);
      setTurnos(turnosData);

      if (selectedTurnoId) {
        const restriccionesData = await restriccionesService.getAll(selectedTurnoId, fecha);
        setRestricciones(restriccionesData);
      } else {
        setRestricciones([]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [categoria, selectedTurnoId, fecha]);

  useEffect(() => {
    if (categoria) {
      loadData();
    }
  }, [categoria, selectedTurnoId, fecha, loadData]);

  return {
    turnos,
    restricciones,
    loading,
    reloadData: loadData,
  };
};

