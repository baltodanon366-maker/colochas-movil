import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button';
import { Colors } from '../constants/colors';
import { printerService, BluetoothDevice } from '../services/printer.service';
import { Ionicons } from '@expo/vector-icons';

interface PrinterSelectorProps {
  visible: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const PrinterSelector: React.FC<PrinterSelectorProps> = ({
  visible,
  onClose,
  onConnected,
}) => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (visible) {
      // Inicializar el servicio cuando se abre el modal
      printerService.initialize();
      searchDevices();
    }
  }, [visible]);

  const searchDevices = async () => {
    setSearching(true);
    setLoading(true);
    try {
      const foundDevices = await printerService.findDevices();
      setDevices(foundDevices);
      
      if (foundDevices.length === 0) {
        Alert.alert(
          'No se encontraron impresoras',
          'Asegúrate de que tu impresora esté encendida y emparejada con este dispositivo.',
          [
            { text: 'Buscar de nuevo', onPress: searchDevices },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudieron encontrar impresoras. Verifica que Bluetooth esté activado.'
      );
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleConnect = async (device: BluetoothDevice) => {
    setConnecting(device.address);
    try {
      const connected = await printerService.connect(device.address);
      if (connected) {
        Alert.alert(
          'Éxito',
          `Conectado a ${device.name || 'la impresora'}`,
          [
            {
              text: 'OK',
              onPress: () => {
                onConnected();
                onClose();
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo conectar a la impresora');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      await printerService.disconnect();
      Alert.alert('Éxito', 'Impresora desconectada');
      setDevices([]);
      searchDevices();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo desconectar');
    }
  };

  const connectedDevice = printerService.getConnectedDevice();

  return (
    <Modal visible={visible} onClose={onClose} title="Seleccionar Impresora">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        {/* Estado de conexión actual */}
        {connectedDevice && (
          <View style={styles.connectedContainer}>
            <View style={styles.connectedInfo}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <View style={styles.connectedTextContainer}>
                <Text style={styles.connectedLabel}>Conectado a:</Text>
                <Text style={styles.connectedName}>{connectedDevice.name}</Text>
                <Text style={styles.connectedAddress}>{connectedDevice.address}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={handleDisconnect}
            >
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
              <Text style={styles.disconnectText}>Desconectar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Buscar dispositivos */}
        <View style={styles.searchContainer}>
          <Button
            title={searching ? 'Buscando...' : 'Buscar Impresoras'}
            onPress={searchDevices}
            loading={searching}
            disabled={searching}
            icon={<Ionicons name="search" size={20} color={Colors.text.inverse} />}
            style={styles.searchButton}
          />
        </View>

        {/* Lista de dispositivos */}
        {loading && !searching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Buscando impresoras...</Text>
          </View>
        ) : devices.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bluetooth-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No se encontraron impresoras</Text>
            <Text style={styles.emptyText}>
              Asegúrate de que tu impresora esté:{'\n'}
              • Encendida{'\n'}
              • Emparejada con este dispositivo{'\n'}
              • Dentro del rango de Bluetooth
            </Text>
            <Button
              title="Buscar de nuevo"
              onPress={searchDevices}
              variant="secondary"
              style={styles.retryButton}
            />
          </View>
        ) : (
          <>
            <Text style={styles.label}>
              Dispositivos encontrados ({devices.length}):
            </Text>
            {devices.map((device) => {
              const isConnecting = connecting === device.address;
              const isConnected = connectedDevice?.address === device.address;

              return (
                <TouchableOpacity
                  key={device.address}
                  style={[
                    styles.deviceItem,
                    isConnected && styles.deviceItemConnected,
                  ]}
                  onPress={() => !isConnected && handleConnect(device)}
                  disabled={isConnecting || isConnected}
                >
                  <View style={styles.deviceInfo}>
                    <Ionicons
                      name={isConnected ? 'checkmark-circle' : 'bluetooth'}
                      size={24}
                      color={isConnected ? Colors.success : Colors.primary}
                    />
                    <View style={styles.deviceTextContainer}>
                      <Text style={styles.deviceName}>
                        {device.name || 'Dispositivo desconocido'}
                      </Text>
                      <Text style={styles.deviceAddress}>{device.address}</Text>
                    </View>
                  </View>
                  {isConnecting ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : isConnected ? (
                    <View style={styles.connectedBadge}>
                      <Text style={styles.connectedBadgeText}>Conectado</Text>
                    </View>
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.text.secondary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Instrucciones:</Text>
          <Text style={styles.infoText}>
            1. Asegúrate de que tu impresora esté encendida{'\n'}
            2. Empareja la impresora desde los ajustes de Bluetooth{'\n'}
            3. Presiona "Buscar Impresoras" para encontrarla{'\n'}
            4. Selecciona tu impresora de la lista
          </Text>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  connectedContainer: {
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  connectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectedTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  connectedLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  connectedName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  connectedAddress: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background.primary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  disconnectText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchButton: {
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border.medium,
  },
  deviceItemConnected: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  connectedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  connectedBadgeText: {
    fontSize: 12,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});
