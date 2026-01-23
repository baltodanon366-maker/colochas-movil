import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface ResumenCardProps {
  numerosVendidos: number;
  numerosNoVendidos: number;
}

export const ResumenCard: React.FC<ResumenCardProps> = ({
  numerosVendidos,
  numerosNoVendidos,
}) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Resumen General</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <Text style={styles.value}>{numerosVendidos}</Text>
          <Text style={styles.label}>Números Vendidos</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="close-circle" size={24} color={Colors.text.secondary} />
          <Text style={styles.value}>{numerosNoVendidos}</Text>
          <Text style={styles.label}>Números No Vendidos</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

