import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { usersService, User } from '../../../services/users.service';
import { rolesService, Role } from '../../../services/roles.service';

export const useUsers = (searchQuery?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      
      // Construir parámetros de búsqueda
      const userParams: any = {
        page: 1,
        limit: 100,
      };

      // Si hay búsqueda, agregar filtros
      if (query && query.trim().length > 0) {
        userParams.filterField = 'name';
        userParams.filterRule = 'like';
        userParams.filterValue = query.trim();
      }

      const [usersResponse, rolesResponse] = await Promise.all([
        usersService.getAllUsers(userParams),
        rolesService.getAll(),
      ]);

      if (usersResponse.succeeded && usersResponse.data) {
        setUsers(usersResponse.data.data || []);
      }
      if (rolesResponse.succeeded && rolesResponse.data) {
        setRoles(rolesResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Limpiar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Si no hay query, cargar inmediatamente
    if (!searchQuery || searchQuery.trim().length === 0) {
      loadData();
      return;
    }

    // Si hay query, esperar 500ms antes de buscar
    debounceTimerRef.current = setTimeout(() => {
      loadData(searchQuery);
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, loadData]);

  return {
    users,
    roles,
    loading,
    reloadData: () => loadData(searchQuery),
  };
};

