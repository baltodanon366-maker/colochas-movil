import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Loading } from '../../../components/Loading';
import { EmptyState } from '../../../components/EmptyState';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Colors } from '../../../constants/colors';
import { useAuth } from '../../../hooks/useAuth';
import { Turno, CategoriaTurno } from '../../../types';
import { format } from 'date-fns';
import {
  CategoriaSelector,
  TurnoCard,
  RestriccionesList,
} from '../components';
import { useTurnos } from '../hooks/useTurnos';
import { turnosService } from '../../../services/turnos.service';

export const TurnosScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('admin');

  const [filterCategoria, setFilterCategoria] = useState<CategoriaTurno | null>(null);
  const [selectedTurnoId, setSelectedTurnoId] = useState<number | null>(null);
  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { turnos, restricciones, loading, reloadData } = useTurnos(
    filterCategoria,
    selectedTurnoId,
    fecha
  );

  const handleSeleccionarCategoria = (categoria: CategoriaTurno) => {
    setFilterCategoria(categoria);
    setSelectedTurnoId(null);
  };

  const handleSeleccionarTurno = async (turnoId: number) => {
    setSelectedTurnoId(turnoId);
  };

  const handleEditTurno = (turno: Turno) => {
    const parent = navigation.getParent();
    const nav = parent || navigation;
    nav.navigate('EditTurno', {
      turnoId: turno.id,
      onSuccess: reloadData,
    });
  };

  const handleDeleteTurno = async (turno: Turno) => {
    const turnosEstandar = ['12 MD', '3 PM', '6 PM', '9 PM', '1 PM', '4:30 PM', '7:30 PM'];
    const esEstandar = turnosEstandar.includes(turno.nombre);

    Alert.alert(
      esEstandar ? 'Desactivar Turno Estándar' : 'Eliminar Turno',
      esEstandar
        ? `El turno "${turno.nombre}" es un turno estándar. Solo se puede desactivar, no eliminar. ¿Deseas desactivarlo?`
        : `¿Estás seguro de que deseas eliminar el turno "${turno.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: esEstandar ? 'Desactivar' : 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await turnosService.delete(turno.id);
              Alert.alert(
                'Éxito',
                esEstandar ? 'Turno desactivado exitosamente' : 'Turno eliminado exitosamente'
              );
              reloadData();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || `No se pudo ${esEstandar ? 'desactivar' : 'eliminar'} el turno`
              );
            }
          },
        },
      ]
    );
  };

  const turnosEstandar = ['12 MD', '3 PM', '6 PM', '9 PM', '1 PM', '4:30 PM', '7:30 PM'];

  const turnosOrdenados = turnos.sort((a, b) => {
    const aEsEstandar = turnosEstandar.includes(a.nombre);
    const bEsEstandar = turnosEstandar.includes(b.nombre);
    if (aEsEstandar && !bEsEstandar) return -1;
    if (!aEsEstandar && bEsEstandar) return 1;
    if (a.hora && b.hora) {
      return a.hora.localeCompare(b.hora);
    }
    return 0;
  });

  const turnoSeleccionado = turnos.find((t) => t.id === selectedTurnoId);

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Loading message="Cargando turnos..." />
      </View>
    );
  }

  if (!filterCategoria) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <CategoriaSelector
          onSelectCategoria={handleSeleccionarCategoria}
          showAddButton={!!isAdmin}
          onAddPress={() => {
            const parent = navigation.getParent();
            const nav = parent || navigation;
            nav.navigate('CreateTurno', {
              onSuccess: reloadData,
            });
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title={filterCategoria === 'diaria' ? 'La Diaria' : 'La Tica'}
        onBack={() => {
          setFilterCategoria(null);
          setSelectedTurnoId(null);
        }}
        showAddButton={!!isAdmin}
        onAddPress={() => {
          const parent = navigation.getParent();
          const nav = parent || navigation;
          nav.navigate('CreateTurno', {
            onSuccess: reloadData,
          });
        }}
      />

      <ScrollView style={styles.content}>

        {turnos.length === 0 ? (
          <EmptyState
            icon="time-outline"
            title="No hay turnos"
            message={isAdmin ? 'Crea tu primer turno' : 'No hay turnos disponibles'}
          />
        ) : (
          <>
            {turnosOrdenados.map((turno) => (
              <TurnoCard
                key={turno.id}
                turno={turno}
                isSelected={selectedTurnoId === turno.id}
                isAdmin={!!isAdmin}
                onSelect={() => handleSeleccionarTurno(turno.id)}
                onEdit={isAdmin ? () => handleEditTurno(turno) : undefined}
                onDelete={isAdmin ? () => handleDeleteTurno(turno) : undefined}
                onCerrar={
                  isAdmin && selectedTurnoId === turno.id
                    ? () => {
                        const parent = navigation.getParent();
                        const nav = parent || navigation;
                        nav.navigate('CerrarTurno', {
                          turnoId: turno.id,
                          fecha,
                          onSuccess: () => {
                            setSelectedTurnoId(null);
                            reloadData();
                          },
                        });
                      }
                    : undefined
                }
              />
            ))}
          </>
        )}

        {selectedTurnoId && turnoSeleccionado && (
          <RestriccionesList restricciones={restricciones} fecha={fecha} />
        )}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
