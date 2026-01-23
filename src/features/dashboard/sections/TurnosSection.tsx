import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Turno } from '../../../types';

interface TurnosSectionProps {
  turnos: Turno[];
  onTurnoPress: (turnoId: number) => void;
  onSeeAll?: () => void;
  maxItems?: number;
}

export const TurnosSection: React.FC<TurnosSectionProps> = ({ 
  turnos, 
  onTurnoPress, 
  onSeeAll,
  maxItems = 3 
}) => {
  if (turnos.length === 0) {
    return (
      <Card>
        <Text style={styles.emptyText}>No hay turnos activos</Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {turnos.slice(0, maxItems).map((turno) => (
        <Card key={turno.id} style={styles.turnoCard}>
          <View style={styles.turnoContent}>
            <View style={styles.turnoLeft}>
              <Text style={styles.turnoName}>{turno.nombre}</Text>
              {turno.descripcion && (
                <Text style={styles.turnoDesc}>{turno.descripcion}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => onTurnoPress(turno.id)}
              style={styles.turnoButton}
            >
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
      {turnos.length > maxItems && onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Ver todos los turnos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  turnoCard: {
    marginBottom: 0,
  },
  turnoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  turnoLeft: {
    flex: 1,
  },
  turnoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  turnoDesc: {
    fontSize: 14,
    color: '#666',
  },
  turnoButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  seeAllButton: {
    padding: 12,
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

