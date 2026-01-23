import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { Colors } from '../../../constants/colors';
import { RestriccionNumero } from '../../../types';
import { RestriccionCard } from './RestriccionCard';
import { restriccionesService } from '../services/restricciones.service';
import { Alert } from 'react-native';

interface RestriccionesListProps {
  restricciones: RestriccionNumero[];
  turnoId: number | null;
  fecha: string;
  isAdmin: boolean;
  onReload: () => void;
}

export const RestriccionesList: React.FC<RestriccionesListProps> = ({
  restricciones,
  turnoId,
  fecha,
  isAdmin,
  onReload,
}) => {
  const handleDelete = async (id: number) => {
    Alert.alert(
      'Eliminar Restricción',
      '¿Estás seguro de que deseas eliminar esta restricción? El número quedará disponible nuevamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await restriccionesService.delete(id);
              Alert.alert('Éxito', 'Restricción eliminada correctamente');
              onReload();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar la restricción');
            }
          },
        },
      ]
    );
  };

  if (restricciones.length === 0) {
    return (
      <EmptyState
        icon="ban-outline"
        title="No hay restricciones"
        message={turnoId ? 'No hay números restringidos para este turno en esta fecha' : 'Selecciona un turno'}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Números Restringidos ({restricciones.length})</Text>
      <View style={styles.grid}>
        {restricciones.map((restriccion) => (
          <RestriccionCard
            key={restriccion.id}
            restriccion={restriccion}
            onDelete={() => handleDelete(restriccion.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  grid: {
    gap: 12,
  },
});

