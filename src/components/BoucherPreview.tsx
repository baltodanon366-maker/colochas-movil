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
import { Ionicons } from '@expo/vector-icons';
import { Modal } from './Modal';
import { Button } from './Button';
import { Colors } from '../constants/colors';
import { Venta } from '../types';
import { format } from 'date-fns';
import { printerService } from '../services/printer.service';
import { PrinterSelector } from './PrinterSelector';
import { formatDateString, formatTimeString } from '../utils/dateUtils';

interface BoucherPreviewProps {
  visible: boolean;
  venta: Venta | null;
  onClose: () => void;
  onPrint?: () => void;
}

export const BoucherPreview: React.FC<BoucherPreviewProps> = ({
  visible,
  venta,
  onClose,
  onPrint,
}) => {
  const [showPrinterSelector, setShowPrinterSelector] = useState(false);
  const [printing, setPrinting] = useState(false);

  if (!venta) return null;

  const handlePrint = async () => {
    // En web, usar window.print() - solo disponible en web
    if (Platform.OS === 'web') {
      // En web, la función print está disponible globalmente
      try {
        if (typeof (globalThis as any).print === 'function') {
          (globalThis as any).print();
          onPrint?.();
          return;
        }
      } catch (e) {
        // Si no está disponible, continuar con el flujo normal
      }
    }

    // En móvil, verificar si hay impresora conectada
    if (!printerService.isConnected()) {
      // Mostrar selector de impresora
      setShowPrinterSelector(true);
      return;
    }

    // Imprimir directamente
    setPrinting(true);
    try {
      await printerService.printBoucher(venta, {
        nombreEmpresa: '$ LA CHELITA $',
        // Puedes agregar más configuraciones aquí si es necesario
      });
      
      Alert.alert('Éxito', 'Boucher impreso correctamente');
      onPrint?.();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo imprimir el boucher');
    } finally {
      setPrinting(false);
    }
  };

  const handlePrinterConnected = () => {
    // Cuando se conecta una impresora, intentar imprimir automáticamente
    handlePrint();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Venta Creada Exitosamente"
    >
      <ScrollView style={styles.container}>
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
            title={printing ? 'Imprimiendo...' : 'Imprimir'}
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
          <Button
            title="Cerrar"
            onPress={onClose}
            variant="secondary"
            style={styles.closeButton}
            disabled={printing}
          />
        </View>

        {/* Indicador de impresora conectada */}
        {printerService.isConnected() && (
          <View style={styles.printerStatus}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.printerStatusText}>
              Impresora conectada: {printerService.getConnectedDevice()?.name}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de selección de impresora */}
      <PrinterSelector
        visible={showPrinterSelector}
        onClose={() => setShowPrinterSelector(false)}
        onConnected={handlePrinterConnected}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    maxHeight: '90%',
  },
  container: {
    flex: 1,
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
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  printButton: {
    flex: 1,
  },
  closeButton: {
    flex: 1,
  },
  printerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  printerStatusText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.text.primary,
    fontWeight: '500',
  },
});

