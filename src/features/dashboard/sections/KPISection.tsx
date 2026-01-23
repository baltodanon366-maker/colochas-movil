import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatCard } from '../../../components/StatCard';
import { KPIVentasHoy } from '../../../types';

interface KPISectionProps {
  kpis: KPIVentasHoy | null;
}

export const KPISection: React.FC<KPISectionProps> = ({ kpis }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <StatCard
          title="Ventas Hoy"
          value={kpis?.totalVentas || 0}
          icon="receipt-outline"
          color="#007AFF"
        />
        <StatCard
          title="Monto Total"
          value={`$${kpis?.totalMonto.toFixed(2) || '0.00'}`}
          icon="cash-outline"
          color="#34C759"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

