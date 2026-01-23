import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Venta } from '../../../types';
import { format } from 'date-fns';
import { formatDateString } from '../../../utils/dateUtils';

interface VentaCardProps {
  venta: Venta;
  onPress: () => void;
}

export const VentaCard: React.FC<VentaCardProps> = ({ venta, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.ventaCard}>
        <View style={styles.ventaHeader}>
          <View>
            <Text style={styles.boucher}>{venta.numeroBoucher}</Text>
            <Text style={styles.turno}>{venta.turno?.nombre || `Turno ${venta.turnoId}`}</Text>
          </View>
          <View style={styles.ventaHeaderRight}>
            <Text style={styles.total}>${Number(venta.total).toFixed(2)}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          </View>
        </View>
        <View style={styles.ventaDetails}>
          <Text style={styles.date}>
            {formatDateString(venta.fecha)}
          </Text>
          {venta.detalles && venta.detalles.length > 0 && (
            <View style={styles.numerosContainer}>
              {venta.detalles.map((detalle, idx) => (
                <View key={idx} style={styles.numeroTag}>
                  <Text style={styles.numeroText}>
                    {detalle.numero.toString().padStart(2, '0')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ventaCard: {
    marginBottom: 12,
  },
  ventaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ventaHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  boucher: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  turno: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  ventaDetails: {
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  numerosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numeroTag: {
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  numeroText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
});

