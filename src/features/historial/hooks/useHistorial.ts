import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { historialService } from '../../../services/historial.service';
import { usersService, User } from '../../../services/users.service';
import { turnosService } from '../../../services/turnos.service';
import { Venta, Turno, CategoriaTurno } from '../../../types';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { FiltroFecha } from '../components/FiltrosFecha';
import { getNicaraguaDateTime } from '../../../utils/dateUtils';

interface UseHistorialParams {
  isAdmin: boolean;
  userId: number | null;
  selectedUserId: number | null;
  filtroFecha: FiltroFecha;
  fechaInicio: string | null;
  fechaFin: string | null;
  filtroCategoria: CategoriaTurno | null;
  filtroTurnoId: number | null;
  turnos: Turno[];
}

export const useHistorial = ({
  isAdmin,
  userId,
  selectedUserId,
  filtroFecha,
  fechaInicio,
  fechaFin,
  filtroCategoria,
  filtroTurnoId,
  turnos,
}: UseHistorialParams) => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

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

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;

    setLoadingUsers(true);
    try {
      const response = await usersService.getAllUsers({
        page: 1,
        limit: 100,
      });
      if (response.succeeded && response.data) {
        const allUsers = response.data.data || [];
        const currentUserId = userId;

        const usersMap = new Map<number, User>();
        allUsers.forEach((u) => {
          if (u.id !== currentUserId && !usersMap.has(u.id)) {
            usersMap.set(u.id, u);
          }
        });

        setUsers(Array.from(usersMap.values()));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin, userId]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: 1,
        limit: 100,
      };

      if (isAdmin) {
        if (selectedUserId !== null) {
          params.usuarioId = selectedUserId;
        } else if (userId) {
          params.usuarioId = userId;
        }
      }

      if (filtroFecha !== 'todos') {
        const fechas = calcularFechasFiltro(filtroFecha);
        if (fechas.inicio) params.fechaInicio = fechas.inicio;
        if (fechas.fin) params.fechaFin = fechas.fin;
      }

      if (filtroTurnoId) {
        params.turnoId = filtroTurnoId;
      }

      const response = await historialService.getVentas(params);

      if (response.succeeded && response.data) {
        let ventasData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        if (filtroCategoria && !filtroTurnoId) {
          const turnosIdsCategoria = turnos
            .filter((t) => t.categoria === filtroCategoria)
            .map((t) => t.id);
          ventasData = ventasData.filter((v) => turnosIdsCategoria.includes(v.turnoId));
        }

        setVentas(ventasData);
      } else {
        setVentas([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'No se pudo cargar el historial de ventas');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  }, [
    isAdmin,
    selectedUserId,
    userId,
    filtroFecha,
    filtroCategoria,
    filtroTurnoId,
    turnos,
    calcularFechasFiltro,
  ]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, loadUsers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ventas,
    users,
    loading,
    loadingUsers,
    reloadData: loadData,
  };
};

