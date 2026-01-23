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

interface VentasHoyDetailModalProps {
  visible: boolean;
  loading: boolean;
  ventasDetalle: Venta[];
  ventasPorTurno: Array<{
    turnoId: number;
    turnoNombre: string;
    cantidad: number;
    monto: number;
  }>;
  onClose: () => void;
}

export const VentasHoyDetailModal: React.FC<VentasHoyDetailModalProps> = ({
  visible,
  loading,
  ventasDetalle,
  ventasPorTurno,
  onClose,
}) => {
  return (
    <Modal visible={visible} onClose={onClose} title="Detalle de Ventas del Día">
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
              <Ionicons name="receipt-outline" size={24} color={Colors.primary} />
              <View style={styles.detalleResumenContent}>
                <Text style={styles.detalleResumenValue}>{ventasDetalle.length}</Text>
                <Text style={styles.detalleResumenLabel}>Total de Ventas</Text>
              </View>
            </View>
          </View>

          {ventasPorTurno.length > 0 && (
            <View style={styles.detalleSection}>
              <Text style={styles.detalleSectionTitle}>Ventas por Turno</Text>
              {ventasPorTurno.map((venta) => {
                const ventasTurno = ventasDetalle.filter((v) => v.turnoId === venta.turnoId);
                return (
                  <Card key={venta.turnoId} style={styles.detalleTurnoCard}>
                    <View style={styles.detalleTurnoHeader}>
                      <Ionicons name="time-outline" size={20} color={Colors.primary} />
                      <Text style={styles.detalleTurnoName}>{venta.turnoNombre}</Text>
                    </View>
                    <View style={styles.detalleTurnoStats}>
                      <View style={styles.detalleTurnoStat}>
                        <Text style={styles.detalleTurnoStatValue}>{ventasTurno.length}</Text>
                        <Text style={styles.detalleTurnoStatLabel}>Ventas</Text>
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
                Lista de Ventas ({ventasDetalle.length})
              </Text>
              {ventasDetalle.map((venta) => (
                <Card key={venta.id} style={styles.ventaCard}>
                  <View style={styles.ventaHeader}>
                    <View style={styles.ventaLeft}>
                      <Text style={styles.ventaBoucher}>{venta.numeroBoucher}</Text>
                      <Text style={styles.ventaFecha}>
                        {formatTimeString(venta.fechaHora || venta.fecha)}
                      </Text>
                    </View>
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
                    {venta.detalles && venta.detalles.length > 0 && (
                      <View style={styles.ventaDetailRow}>
                        <Ionicons name="grid-outline" size={14} color={Colors.text.secondary} />
                        <Text style={styles.ventaDetailText}>
                          {venta.detalles.length} número(s) vendido(s)
                        </Text>
                      </View>
                    )}
                  </View>
                </Card>
              ))}
            </View>
          )}

          {ventasDetalle.length === 0 && !loading && (
            <View style={styles.emptyDetalle}>
              <Ionicons name="receipt-outline" size={48} color={Colors.text.secondary} />
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

