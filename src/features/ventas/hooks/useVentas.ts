import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { historialService } from '../../../services/historial.service';
import { turnosService } from '../../../services/turnos.service';
import { Venta, Turno, CategoriaTurno } from '../../../types';
import { detectarTurnoActual } from '../../../utils/turnoUtils';
import { useAuth } from '../../../hooks/useAuth';
import { getNicaraguaDate } from '../../../utils/dateUtils';

export const useVentas = (categoria: CategoriaTurno | null) => {
  const { user } = useAuth();
  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const categoriaAnteriorRef = useRef<CategoriaTurno | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Usar refs para acceder a valores actuales sin causar re-renders
  const turnosRef = useRef<Turno[]>([]);
  const turnoActualRef = useRef<Turno | null>(null);
  const categoriaRef = useRef<CategoriaTurno | null>(null);
  const userRef = useRef<any>(null);

  // Actualizar refs cuando cambian los valores
  useEffect(() => {
    turnosRef.current = turnos;
  }, [turnos]);

  useEffect(() => {
    turnoActualRef.current = turnoActual;
  }, [turnoActual]);

  useEffect(() => {
    categoriaRef.current = categoria;
  }, [categoria]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadVentasData = useCallback(async () => {
    const currentCategoria = categoriaRef.current;
    const currentUser = userRef.current;

    const safeSet = <T,>(setter: (v: T) => void, value: T) => {
      if (isMountedRef.current) setter(value);
    };

    if (!currentCategoria) {
      safeSet(setLoading, false);
      safeSet(setTurnoActual, null);
      safeSet(setTurnos, []);
      safeSet(setVentas, []);
      categoriaAnteriorRef.current = null;
      return;
    }

    // Si no hay usuario logueado, no cargar ventas
    if (!currentUser) {
      safeSet(setLoading, false);
      safeSet(setVentas, []);
      return;
    }

    // Si cambió la categoría, limpiar datos anteriores pero NO mostrar loading
    const cambioCategoria = categoriaAnteriorRef.current !== null && categoriaAnteriorRef.current !== currentCategoria;
    if (cambioCategoria) {
      safeSet(setTurnoActual, null);
      safeSet(setVentas, []);
    } else {
      const esPrimeraCarga = categoriaAnteriorRef.current === null;
      if (esPrimeraCarga) {
        safeSet(setLoading, true);
      }
    }

    try {
      const turnosData = await turnosService.getActivos(currentCategoria);
      if (!isMountedRef.current) return;
      safeSet(setTurnos, turnosData);
      turnosRef.current = turnosData;

      const turno = detectarTurnoActual(turnosData);
      safeSet(setTurnoActual, turno);
      turnoActualRef.current = turno;

      if (turno && currentUser) {
        const isAdmin = currentUser.roles?.some((role: any) => {
          if (typeof role === 'string') {
            return role.toLowerCase() === 'admin';
          }
          if (typeof role === 'object' && role.nombre) {
            return role.nombre.toLowerCase() === 'admin';
          }
          return false;
        });

        const userId = currentUser ? (typeof currentUser.id === 'string' ? parseInt(currentUser.id) : currentUser.id) : null;
        const fechaInicio = getNicaraguaDate();
        const fechaFin = getNicaraguaDate();
        const params: any = {
          fechaInicio,
          fechaFin,
          turnoId: turno.id,
        };
        if (isAdmin && userId) {
          params.usuarioId = userId;
        }

        const response = await historialService.getVentas(params);
        if (!isMountedRef.current) return;

        let ventasDelTurno: Venta[] = [];
        if (response.succeeded && response.data) {
          if (Array.isArray(response.data)) {
            ventasDelTurno = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            ventasDelTurno = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            ventasDelTurno = response.data;
          }
        }
        safeSet(setVentas, ventasDelTurno);
      } else {
        safeSet(setVentas, []);
      }

      categoriaAnteriorRef.current = currentCategoria;
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error cargando ventas:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos');
      }
    } finally {
      safeSet(setLoading, false);
    }
  }, []);

  const detectarYActualizarTurno = useCallback(async () => {
    if (!isMountedRef.current) return;
    const currentCategoria = categoriaRef.current;
    const currentTurnos = turnosRef.current;
    const currentTurnoActual = turnoActualRef.current;
    const currentUser = userRef.current;

    if (currentCategoria && currentTurnos.length > 0 && currentUser) {
      const isAdmin = currentUser.roles?.some((role: any) => {
        if (typeof role === 'string') {
          return role.toLowerCase() === 'admin';
        }
        if (typeof role === 'object' && role.nombre) {
          return role.nombre.toLowerCase() === 'admin';
        }
        return false;
      });

      const userId = currentUser ? (typeof currentUser.id === 'string' ? parseInt(currentUser.id) : currentUser.id) : null;
      const turno = detectarTurnoActual(currentTurnos);
      const turnoAnteriorId = currentTurnoActual?.id;

      if (turno && turno.id !== turnoAnteriorId) {
        if (!isMountedRef.current) return;
        setTurnoActual(turno);
        turnoActualRef.current = turno;
        try {
          const fechaInicio = getNicaraguaDate();
          const fechaFin = getNicaraguaDate();
          const params: any = {
            fechaInicio,
            fechaFin,
            turnoId: turno.id,
          };
          if (isAdmin && userId) {
            params.usuarioId = userId;
          }

          const response = await historialService.getVentas(params);
          if (!isMountedRef.current) return;

          let ventasDelTurno: Venta[] = [];
          if (response.succeeded && response.data) {
            if (Array.isArray(response.data)) {
              ventasDelTurno = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              ventasDelTurno = response.data.data;
            } else if (response.data && Array.isArray(response.data)) {
              ventasDelTurno = response.data;
            }
          }
          setVentas(ventasDelTurno);
        } catch (error) {
          if (isMountedRef.current) console.error('Error al actualizar ventas:', error);
        }
      } else if (!turno && currentTurnoActual) {
        if (!isMountedRef.current) return;
        setTurnoActual(null);
        turnoActualRef.current = null;
        setVentas([]);
      }
    }
  }, []);

  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (categoria && user) {
      loadVentasData();
      
      // Crear intervalo solo una vez por categoría
      intervalRef.current = setInterval(() => {
        detectarYActualizarTurno();
      }, 30000); // 30 segundos
    } else {
      // Si no hay categoría o usuario, limpiar todo
      setTurnoActual(null);
      setTurnos([]);
      setVentas([]);
      categoriaAnteriorRef.current = null;
    }

    // Cleanup: limpiar intervalo cuando cambia la categoría o se desmonta
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [categoria, user]); // Agregar user como dependencia

  return {
    turnoActual,
    turnos,
    ventas,
    loading,
    reloadVentas: loadVentasData,
  };
};

