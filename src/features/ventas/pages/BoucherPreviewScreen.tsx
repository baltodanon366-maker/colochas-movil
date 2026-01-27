import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { Venta } from '../../../types';
import { printerService } from '../../../services/printer.service';
import { formatDateString, formatTimeString } from '../../../utils/dateUtils';

export const BoucherPreviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { venta } = route.params as { venta: Venta } || {};

  const [printing, setPrinting] = useState(false);

  const navigateToNuevaVenta = () => {
    // Regresar al formulario de nueva venta con los mismos parámetros del turno
    if (venta?.turnoId) {
      navigation.navigate('NuevaVenta', {
        turnoId: venta.turnoId,
        categoria: venta.turno?.categoria || undefined,
      });
    } else {
      // Si no hay turno, ir a la lista de ventas
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Ventas' },
                ],
                index: 0,
              },
            },
          ],
        })
      );
    }
  };

  if (!venta) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Boucher de Venta" onBack={navigateToNuevaVenta} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró la venta</Text>
        </View>
      </View>
    );
  }

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await printerService.printBoucher(venta, {
        nombreEmpresa: '$ LA CHELITA $',
      });
      // Navegar automáticamente al formulario de nueva venta después de imprimir
      navigateToNuevaVenta();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo procesar la impresión');
    } finally {
      setPrinting(false);
    }
  };

  const handleBack = () => {
    navigateToNuevaVenta();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Venta Creada Exitosamente"
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* Encabezado del Boucher */}
        <View style={styles.header}>
          <Text style={styles.title}>BOUCHER DE VENTA</Text>
          <Text style={styles.boucherNumber}>{venta.numeroBoucher}</Text>
        </View>

        {/* Información de la Venta */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>
              {formatDateString(venta.fecha || (venta.fechaHora ? venta.fechaHora.split('T')[0] : null) || new Date().toISOString().split('T')[0])}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>
              {formatTimeString(venta.fechaHora, true)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Turno:</Text>
            <Text style={styles.value}>
              {venta.turno?.nombre || `Turno ${venta.turnoId}`}
            </Text>
          </View>
          {venta.usuario && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Vendedor:</Text>
              <Text style={styles.value}>{venta.usuario.name}</Text>
            </View>
          )}
        </View>

        {/* Detalles de la Venta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Números Vendidos</Text>
          {(venta.detallesVenta || venta.detalles) && (venta.detallesVenta || venta.detalles)!.length > 0 ? (
            <View style={styles.detallesContainer}>
              {(venta.detallesVenta || venta.detalles)!.map((detalle, index) => (
                <View key={index} style={styles.detalleRow}>
                  <Text style={styles.detalleNumero}>
                    {detalle.numero.toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.detalleMonto}>
                    ${Number(detalle.monto).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDetalles}>No hay detalles disponibles</Text>
          )}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalValue}>${Number(venta.total).toFixed(2)}</Text>
        </View>

        {/* Observaciones */}
        {venta.observaciones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={styles.observaciones}>{venta.observaciones}</Text>
          </View>
        )}

        {/* Mensaje del Turno */}
        {venta.turno?.mensaje && (
          <View style={styles.mensajeSection}>
            <Text style={styles.mensajeText}>{venta.turno.mensaje}</Text>
          </View>
        )}

        {/* Botones de Acción */}
        <View style={styles.actions}>
          <Button
            title={printing ? 'Imprimiendo...' : 'Imprimir / Compartir'}
            onPress={handlePrint}
            loading={printing}
            disabled={printing}
            icon={
              printing ? (
                <ActivityIndicator size="small" color={Colors.text.inverse} />
              ) : (
                <Ionicons name="print-outline" size={20} color={Colors.text.inverse} />
              )
            }
            style={styles.printButton}
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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  boucherNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    letterSpacing: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  label: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  detallesContainer: {
    gap: 8,
  },
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  detalleNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    minWidth: 40,
  },
  detalleMonto: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  noDetalles: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.successLight,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.success,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.success,
  },
  observaciones: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
  },
  mensajeSection: {
    padding: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 20,
  },
  mensajeText: {
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  actions: {
    marginTop: 20,
    marginBottom: 10,
  },
  printButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
