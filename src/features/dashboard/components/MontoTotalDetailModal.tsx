import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Modal } from '../../../components/Modal';
import { Card } from '../../../components/Card';
import { Loading } from '../../../components/Loading';
import { Colors } from '../../../constants/colors';
import { Venta } from '../../../types';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { formatTimeString } from '../../../utils/dateUtils';

interface MontoTotalDetailModalProps {
  visible: boolean;
  loading: boolean;
  ventasDetalle: Venta[];
  ventasPorTurno: Array<{
    turnoId: number;
    turnoNombre: string;
    cantidad: number;
    monto: number;
  }>;
  totalMonto: number;
  onClose: () => void;
}

export const MontoTotalDetailModal: React.FC<MontoTotalDetailModalProps> = ({
  visible,
  loading,
  ventasDetalle,
  ventasPorTurno,
  totalMonto,
  onClose,
}) => {
  const montoTotal = ventasDetalle.reduce((sum, v) => sum + Number(v.total || 0), 0);

  return (
    <Modal visible={visible} onClose={onClose} title="Detalle de Monto del Día">
      {loading ? (
        <Loading message="Cargando detalles..." />
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <View style={styles.detalleResumen}>
            <View style={styles.detalleResumenItem}>
              <Ionicons name="cash-outline" size={24} color={Colors.secondary} />
              <View style={styles.detalleResumenContent}>
                <Text style={styles.detalleResumenValue}>C${montoTotal.toFixed(2)}</Text>
                <Text style={styles.detalleResumenLabel}>Monto Total del Día</Text>
              </View>
            </View>
          </View>

          {ventasPorTurno.length > 0 && (
            <View style={styles.detalleSection}>
              <Text style={styles.detalleSectionTitle}>Monto por Turno</Text>
              {ventasPorTurno.map((venta) => {
                const ventasTurno = ventasDetalle.filter((v) => v.turnoId === venta.turnoId);
                const montoTurno = ventasTurno.reduce(
                  (sum, v) => sum + Number(v.total || 0),
                  0
                );
                const porcentaje = totalMonto ? ((montoTurno / totalMonto) * 100).toFixed(1) : '0';

                return (
                  <Card key={venta.turnoId} style={styles.detalleTurnoCard}>
                    <View style={styles.detalleTurnoHeader}>
                      <Ionicons name="time-outline" size={20} color={Colors.secondary} />
                      <Text style={styles.detalleTurnoName}>{venta.turnoNombre}</Text>
                    </View>
                    <View style={styles.detalleTurnoStats}>
                      <View style={styles.detalleTurnoStat}>
                        <Text style={styles.detalleTurnoStatValue}>C${montoTurno.toFixed(2)}</Text>
                        <Text style={styles.detalleTurnoStatLabel}>Monto</Text>
                      </View>
                      <View style={styles.detalleTurnoStat}>
                        <Text style={styles.detalleTurnoStatValue}>{porcentaje}%</Text>
                        <Text style={styles.detalleTurnoStatLabel}>del Total</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}

          {ventasDetalle.length > 0 && (
            <View style={styles.detalleSection}>
              <Text style={styles.detalleSectionTitle}>
                Top Ventas por Monto ({Math.min(10, ventasDetalle.length)})
              </Text>
              {ventasDetalle
                .sort((a, b) => Number(b.total || 0) - Number(a.total || 0))
                .slice(0, 10)
                .map((venta) => (
                  <Card key={venta.id} style={styles.ventaCard}>
                    <View style={styles.ventaHeader}>
                      <View style={styles.ventaLeft}>
                        <Text style={styles.ventaBoucher}>{venta.numeroBoucher}</Text>
                        <Text style={styles.ventaFecha}>
                          {formatTimeString(venta.fechaHora || venta.fecha)}
                        </Text>
                      </View>
                      <Text style={styles.ventaMonto}>
                        C${Number(venta.total || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.ventaDetails}>
                      <View style={styles.ventaDetailRow}>
                        <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
                        <Text style={styles.ventaDetailText}>
                          {venta.turno?.nombre || `Turno ${venta.turnoId}`}
                        </Text>
                      </View>
                      {venta.usuario && (
                        <View style={styles.ventaDetailRow}>
                          <Ionicons name="person-outline" size={14} color={Colors.text.secondary} />
                          <Text style={styles.ventaDetailText}>{venta.usuario.name}</Text>
                        </View>
                      )}
                    </View>
                  </Card>
                ))}
            </View>
          )}

          {ventasDetalle.length === 0 && !loading && (
            <View style={styles.emptyDetalle}>
              <Ionicons name="cash-outline" size={48} color={Colors.text.secondary} />
              <Text style={styles.emptyDetalleText}>No hay ventas registradas hoy</Text>
            </View>
          )}
        </ScrollView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  detalleResumen: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  detalleResumenItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  detalleResumenContent: {
    flex: 1,
  },
  detalleResumenValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  detalleResumenLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  detalleSection: {
    marginBottom: 24,
  },
  detalleSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  detalleTurnoCard: {
    marginBottom: 12,
    padding: 16,
  },
  detalleTurnoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detalleTurnoName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  detalleTurnoStats: {
    flexDirection: 'row',
    gap: 16,
  },
  detalleTurnoStat: {
    flex: 1,
  },
  detalleTurnoStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 4,
  },
  detalleTurnoStatLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  ventaCard: {
    marginBottom: 12,
    padding: 16,
  },
  ventaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ventaLeft: {
    flex: 1,
  },
  ventaBoucher: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ventaFecha: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  ventaMonto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  ventaDetails: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  ventaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ventaDetailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptyDetalle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyDetalleText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

