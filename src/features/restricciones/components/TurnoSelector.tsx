import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Turno } from '../../../types';

interface TurnoSelectorProps {
  turnos: Turno[];
  selectedTurnoId: number | null;
  onSelectTurno: (turnoId: number) => void;
}

export const TurnoSelector: React.FC<TurnoSelectorProps> = ({
  turnos,
  selectedTurnoId,
  onSelectTurno,
}) => {
  if (turnos.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Text style={styles.emptyText}>No hay turnos disponibles</Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Seleccionar Turno:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {turnos.map((turno) => (
          <TouchableOpacity
            key={turno.id}
            style={[
              styles.turnoChip,
              selectedTurnoId === turno.id && styles.turnoChipActive,
            ]}
            onPress={() => onSelectTurno(turno.id)}
          >
            <Text
              style={[
                styles.turnoChipText,
                selectedTurnoId === turno.id && styles.turnoChipTextActive,
              ]}
            >
              {turno.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  scrollView: {
    maxHeight: 60,
  },
  turnoChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    marginRight: 8,
  },
  turnoChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  turnoChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  turnoChipTextActive: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
});

