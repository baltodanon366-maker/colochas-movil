import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { DetalleVenta } from '../../../types';

interface DetallesListProps {
  detalles: DetalleVenta[];
  onRemove: (index: number) => void;
  total: number;
}

export const DetallesList: React.FC<DetallesListProps> = ({ detalles, onRemove, total }) => {
  if (detalles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.detallesList}>
        {detalles.map((detalle, index) => (
          <View key={index} style={styles.detalleItem}>
            <Text style={styles.detalleText}>
              {detalle.numero.toString().padStart(2, '0')} - ${Number(detalle.monto).toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => onRemove(index)}>
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {total > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  detallesList: {
    gap: 8,
  },
  detalleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  detalleText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
});

