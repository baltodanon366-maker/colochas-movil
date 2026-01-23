import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Turno } from '../../../types';

interface TurnoInfoCardProps {
  turno: Turno;
}

export const TurnoInfoCard: React.FC<TurnoInfoCardProps> = ({ turno }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="time" size={24} color={Colors.secondary} />
        <View style={styles.text}>
          <Text style={styles.title}>Turno Seleccionado</Text>
          <Text style={styles.nombre}>{turno.nombre}</Text>
          {turno.hora && (
            <Text style={styles.hora}>
              {turno.hora} {turno.horaCierre && `- ${turno.horaCierre}`}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  hora: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});

