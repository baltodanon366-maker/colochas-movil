import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Turno, CategoriaTurno } from '../../../types';
import { formatearNombreTurno } from '../../../utils/turnoUtils';

interface TurnoInfoCardProps {
  turno: Turno | null;
  categoria: CategoriaTurno | null;
}

export const TurnoInfoCard: React.FC<TurnoInfoCardProps> = ({ turno, categoria }) => {
  if (turno) {
    return (
      <Card style={styles.turnoInfoCard}>
        <View style={styles.turnoInfoHeader}>
          <Ionicons name="time" size={24} color={Colors.secondary} />
          <View style={styles.turnoInfoText}>
            <Text style={styles.turnoInfoTitle}>Turno Actual</Text>
            <Text style={styles.turnoInfoNombre}>{formatearNombreTurno(turno)}</Text>
            {turno.hora && (
              <Text style={styles.turnoInfoHora}>
                {turno.hora} {turno.horaCierre && `- ${turno.horaCierre}`}
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.turnoInfoCard}>
      <View style={styles.turnoInfoHeader}>
        <Ionicons name="alert-circle" size={24} color={Colors.warning} />
        <Text style={styles.turnoInfoText}>
          No hay un turno activo en este momento para {categoria === 'diaria' ? 'La Diaria' : 'La Tica'}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  turnoInfoCard: {
    marginBottom: 16,
    backgroundColor: Colors.primaryLight,
  },
  turnoInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  turnoInfoText: {
    flex: 1,
  },
  turnoInfoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 4,
  },
  turnoInfoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 4,
  },
  turnoInfoHora: {
    fontSize: 14,
    color: Colors.secondary,
    opacity: 0.9,
  },
});

