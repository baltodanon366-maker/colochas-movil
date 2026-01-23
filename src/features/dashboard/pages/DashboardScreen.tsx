import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { StatCard } from '../../../components/StatCard';
import { Card } from '../../../components/Card';
import { Loading } from '../../../components/Loading';
import { AppHeader } from '../../../components/AppHeader';
import { Colors } from '../../../constants/colors';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import {
  VentasHoyDetailModal,
  MontoTotalDetailModal,
  MetricCard,
  ChartsSection,
} from '../components';
import { useDashboard } from '../hooks/useDashboard';

export const DashboardScreen: React.FC = () => {
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [modalTipo, setModalTipo] = useState<'ventas' | 'monto' | null>(null);

  const {
    kpis,
    ventasDetalle,
    loading,
    refreshing,
    loadingDetalle,
    loadVentasDetalle,
    onRefresh,
  } = useDashboard();

  const handleStatCardPress = async (tipo: 'ventas' | 'monto') => {
    setModalTipo(tipo);
    setShowDetalleModal(true);
    await loadVentasDetalle();
  };

  const handleCloseModal = () => {
    setShowDetalleModal(false);
    setModalTipo(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Loading message="Cargando dashboard..." />
      </View>
    );
  }

  const ventasPorTurnoData = kpis?.ventasPorTurno || [];

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Día</Text>
          <Text style={styles.sectionSubtitle}>{format(new Date(), 'EEEE, d MMMM yyyy')}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCardWrapper}>
              <StatCard
                title="Ventas Hoy"
                value={kpis?.totalVentas || 0}
                icon="receipt-outline"
                color={Colors.primary}
                onPress={() => handleStatCardPress('ventas')}
              />
            </View>
            <View style={styles.statCardWrapper}>
              <StatCard
                title="Monto Total"
                value={`C$${(kpis?.totalMonto || 0).toFixed(2)}`}
                icon="cash-outline"
                color={Colors.secondary}
                onPress={() => handleStatCardPress('monto')}
              />
            </View>
          </View>
        </View>

        <ChartsSection ventasPorTurno={ventasPorTurnoData} />

        {ventasPorTurnoData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Métricas por Turno</Text>
            {ventasPorTurnoData.map((venta) => (
              <MetricCard
                key={venta.turnoId}
                turnoNombre={venta.turnoNombre}
                cantidad={venta.cantidad}
                monto={venta.monto}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Información</Text>
                <Text style={styles.infoText}>
                  Los datos mostrados corresponden a las ventas del día de hoy. Toca las tarjetas
                  de resumen para ver el detalle completo.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      <VentasHoyDetailModal
        visible={showDetalleModal && modalTipo === 'ventas'}
        loading={loadingDetalle}
        ventasDetalle={ventasDetalle}
        ventasPorTurno={ventasPorTurnoData}
        onClose={handleCloseModal}
      />

      <MontoTotalDetailModal
        visible={showDetalleModal && modalTipo === 'monto'}
        loading={loadingDetalle}
        ventasDetalle={ventasDetalle}
        ventasPorTurno={ventasPorTurnoData}
        totalMonto={kpis?.totalMonto || 0}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCardWrapper: {
    flex: 1,
    minWidth: '45%',
  },
  infoCard: {
    padding: 16,
    backgroundColor: Colors.infoLight,
    borderColor: Colors.info,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
