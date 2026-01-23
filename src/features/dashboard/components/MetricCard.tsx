import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface MetricCardProps {
  turnoNombre: string;
  cantidad: number;
  monto: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ turnoNombre, cantidad, monto }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Ionicons name="time-outline" size={20} color={Colors.primary} />
          <Text style={styles.title}>{turnoNombre}</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.item}>
          <Text style={styles.value}>{cantidad}</Text>
          <Text style={styles.label}>Ventas</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={styles.value}>C${monto.toFixed(2)}</Text>
          <Text style={styles.label}>Monto</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.light,
  },
});

