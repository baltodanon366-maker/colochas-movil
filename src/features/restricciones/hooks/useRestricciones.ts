import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { restriccionesService } from '../services/restricciones.service';
import { turnosService } from '../../../services/turnos.service';
import { RestriccionNumero, Turno, CategoriaTurno } from '../../../types';

export const useRestricciones = (
  categoria: CategoriaTurno | null,
  selectedTurnoId: number | null,
  fecha: string
) => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [restricciones, setRestricciones] = useState<RestriccionNumero[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTurnos = useCallback(async () => {
    if (!categoria) return;

    try {
      const turnosData = await turnosService.getActivos(categoria);
      setTurnos(turnosData);
      if (turnosData.length > 0 && !selectedTurnoId) {
        // Auto-seleccionar el primer turno si no hay uno seleccionado
        return turnosData[0].id;
      }
    } catch (error) {
      console.error('Error loading turnos:', error);
    }
    return null;
  }, [categoria, selectedTurnoId]);

  const loadRestricciones = useCallback(async () => {
    if (!selectedTurnoId) {
      setRestricciones([]);
      return;
    }

    try {
      const restriccionesData = await restriccionesService.getAll(selectedTurnoId, fecha);
      setRestricciones(restriccionesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las restricciones');
    }
  }, [selectedTurnoId, fecha]);

  useEffect(() => {
    if (categoria) {
      setLoading(true);
      loadTurnos().then((firstTurnoId) => {
        if (firstTurnoId && !selectedTurnoId) {
          // El hook no puede cambiar el estado del componente padre directamente
          // Esto se manejará en el componente
        }
        setLoading(false);
      });
    }
  }, [categoria, loadTurnos]);

  useEffect(() => {
    if (selectedTurnoId) {
      loadRestricciones();
    }
  }, [selectedTurnoId, fecha, loadRestricciones]);

  return {
    turnos,
    restricciones,
    loading,
    reloadRestricciones: loadRestricciones,
  };
};

