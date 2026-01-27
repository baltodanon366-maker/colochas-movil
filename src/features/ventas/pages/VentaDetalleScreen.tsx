import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Loading } from '../../../components/Loading';
import { EmptyState } from '../../../components/EmptyState';
import { AppHeader } from '../../../components/AppHeader';
import { Colors } from '../../../constants/colors';
import { ventasService } from '../services/ventas.service';
import { Venta } from '../../../types';
import { format } from 'date-fns';
import { formatDateString, formatTimeString } from '../../../utils/dateUtils';

export const VentaDetalleScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const ventaId = (route.params as any)?.ventaId as number;

  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ventaId) {
      loadVenta();
    }
  }, [ventaId]);

  const loadVenta = async () => {
    try {
      setLoading(true);
      const ventaEncontrada = await ventasService.getById(ventaId);
      setVenta(ventaEncontrada);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar la venta');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Loading message="Cargando venta..." />
      </View>
    );
  }

  if (!venta) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <EmptyState
          icon="receipt-outline"
          title="Venta no encontrada"
          message="La venta que buscas no existe"
        />
      </View>
    );
  }

  const detalles = venta.detalles || venta.detallesVenta || [];
  const total = Number(venta.total);

  return (
    <View style={styles.container}>
      <AppHeader
        rightIcon={<Ionicons name="arrow-back" size={24} color={Colors.text.inverse} />}
        onRightPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {/* Información Principal */}
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.boucherLabel}>Boucher</Text>
              <Text style={styles.boucherValue}>{venta.numeroBoucher}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        {/* Información del Turno */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Turno</Text>
              <Text style={styles.infoValue}>
                {venta.turno?.nombre || `Turno ${venta.turnoId}`}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>
                {formatDateString(venta.fecha)}
              </Text>
            </View>
          </View>

          {venta.fechaHora && (
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hora</Text>
                <Text style={styles.infoValue}>
                  {formatTimeString(venta.fechaHora)}
                </Text>
              </View>
            </View>
          )}

          {venta.usuario && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Vendedor</Text>
                <Text style={styles.infoValue}>{venta.usuario.name}</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Detalles de Números */}
        <Card style={styles.detallesCard}>
          <Text style={styles.sectionTitle}>Números Vendidos</Text>
          {detalles.length === 0 ? (
            <Text style={styles.emptyText}>No hay números en esta venta</Text>
          ) : (
            <View style={styles.detallesGrid}>
              {detalles.map((detalle, index) => (
                <View key={index} style={styles.detalleItem}>
                  <View style={styles.detalleNumeroContainer}>
                    <Text style={styles.detalleNumero}>
                      {detalle.numero.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <Text style={styles.detalleMonto}>
                    ${Number(detalle.monto).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {detalles.length > 0 && (
            <View style={styles.totalDetallesContainer}>
              <Text style={styles.totalDetallesLabel}>Total:</Text>
              <Text style={styles.totalDetallesValue}>${total.toFixed(2)}</Text>
            </View>
          )}
        </Card>

        {/* Observaciones */}
        {venta.observaciones && (
          <Card style={styles.observacionesCard}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={styles.observacionesText}>{venta.observaciones}</Text>
          </Card>
        )}

        {/* Información Adicional */}
        <Card style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>ID de Venta:</Text>
            <Text style={styles.metaValue}>#{venta.id}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Creada:</Text>
            <Text style={styles.metaValue}>
              {format(new Date(venta.createdAt), 'dd/MM/yyyy HH:mm')}
            </Text>
          </View>
          {venta.updatedAt && venta.updatedAt !== venta.createdAt && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Actualizada:</Text>
              <Text style={styles.metaValue}>
                {format(new Date(venta.updatedAt), 'dd/MM/yyyy HH:mm')}
              </Text>
            </View>
          )}
        </Card>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <Button
            title="Ver Boucher"
            onPress={() => navigation.navigate('BoucherPreview', { venta })}
            icon={<Ionicons name="receipt" size={20} color={Colors.text.inverse} />}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: Colors.primaryLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  boucherLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 4,
  },
  boucherValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  detallesCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  detallesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detalleItem: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  detalleNumeroContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.successLight,
    borderWidth: 2,
    borderColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detalleNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  detalleMonto: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalDetallesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  totalDetallesLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalDetallesValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  observacionesCard: {
    marginBottom: 16,
  },
  observacionesText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  metaCard: {
    marginBottom: 16,
    backgroundColor: Colors.background.tertiary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
});

