import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Venta } from '../../../types';
import { format } from 'date-fns';
import { formatDateString, formatTimeString } from '../../../utils/dateUtils';

interface HistorialVentaCardProps {
  venta: Venta;
  isAdmin?: boolean;
  onPress: () => void;
}

export const HistorialVentaCard: React.FC<HistorialVentaCardProps> = ({
  venta,
  isAdmin = false,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <View style={styles.itemHeaderLeft}>
            <Text style={styles.boucher}>{venta.numeroBoucher}</Text>
            <Text style={styles.turno}>
              {venta.turno?.nombre || `Turno ${venta.turnoId}`}
            </Text>
            {isAdmin && venta.usuario && (
              <Text style={styles.vendedor}>Vendedor: {venta.usuario.name}</Text>
            )}
          </View>
          <View style={styles.itemHeaderRight}>
            <Text style={styles.total}>${Number(venta.total).toFixed(2)}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          </View>
        </View>
        <View style={styles.itemDetails}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.date}>
              {formatDateString(venta.fecha)}
            </Text>
          </View>
          {venta.fechaHora && (
            <View style={styles.dateRow}>
              <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.date}>
                {formatTimeString(venta.fechaHora)}
              </Text>
            </View>
          )}
        </View>
        {venta.detalles && venta.detalles.length > 0 && (
          <View style={styles.numerosContainer}>
            <Text style={styles.numerosLabel}>Números:</Text>
            <View style={styles.numerosGrid}>
              {venta.detalles.slice(0, 10).map((detalle, idx) => (
                <View key={`${venta.id}-${detalle.numero}-${idx}`} style={styles.numeroTag}>
                  <Text style={styles.numeroText}>
                    {detalle.numero.toString().padStart(2, '0')}
                  </Text>
                </View>
              ))}
              {venta.detalles.length > 10 && (
                <View key={`${venta.id}-more`} style={styles.numeroTag}>
                  <Text style={styles.numeroText}>+{venta.detalles.length - 10}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemHeaderLeft: {
    flex: 1,
  },
  itemHeaderRight: {
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
    marginBottom: 4,
  },
  vendedor: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  itemDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  numerosContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  numerosLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  numerosGrid: {
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

