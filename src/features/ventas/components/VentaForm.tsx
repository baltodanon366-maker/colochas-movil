import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import { DetalleVenta } from '../../../types';

interface VentaFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (detalles: DetalleVenta[], observaciones?: string) => void;
  loading?: boolean;
}

export const VentaForm: React.FC<VentaFormProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false 
}) => {
  const [numeroInput, setNumeroInput] = useState('');
  const [montoInput, setMontoInput] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);

  const handleAddDetalle = () => {
    const numero = parseInt(numeroInput);
    const monto = parseFloat(montoInput);

    if (isNaN(numero) || numero < 0 || numero > 99) {
      Alert.alert('Error', 'El número debe estar entre 0 y 99');
      return;
    }

    if (isNaN(monto) || monto <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a 0');
      return;
    }

    if (detalles.some(d => d.numero === numero)) {
      Alert.alert('Error', 'Este número ya está en la lista');
      return;
    }

    setDetalles([...detalles, { numero, monto }]);
    setNumeroInput('');
    setMontoInput('');
  };

  const handleRemoveDetalle = (numero: number) => {
    setDetalles(detalles.filter(d => d.numero !== numero));
  };

  const handleSubmit = () => {
    if (detalles.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos un detalle');
      return;
    }

    onSubmit(detalles, observaciones || undefined);
    handleReset();
  };

  const handleReset = () => {
    setDetalles([]);
    setNumeroInput('');
    setMontoInput('');
    setObservaciones('');
  };

  const total = detalles.reduce((sum, d) => sum + d.monto, 0);

  return (
    <Modal visible={visible} onClose={onClose} title="Nueva Venta">
      <View style={styles.container}>
        <View style={styles.formRow}>
          <Input
            label="Número"
            value={numeroInput}
            onChangeText={setNumeroInput}
            placeholder="0-99"
            keyboardType="numeric"
            style={styles.input}
          />
          <Input
            label="Monto"
            value={montoInput}
            onChangeText={setMontoInput}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleAddDetalle}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {detalles.length > 0 && (
          <View style={styles.detallesContainer}>
            <Text style={styles.detallesTitle}>Detalles:</Text>
            {detalles.map((detalle) => (
              <View key={detalle.numero} style={styles.detalleItem}>
                <Text style={styles.detalleText}>
                  Número {detalle.numero}: ${detalle.monto.toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveDetalle(detalle.numero)}
                >
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.totalText}>
              Total: ${total.toFixed(2)}
            </Text>
          </View>
        )}

        <Input
          label="Observaciones (opcional)"
          value={observaciones}
          onChangeText={setObservaciones}
          placeholder="Observaciones..."
          multiline
          numberOfLines={3}
          style={styles.observacionesInput}
        />

        <View style={styles.buttons}>
          <Button
            title="Cancelar"
            onPress={onClose}
            style={styles.button}
          />
          <Button
            title="Crear Venta"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
  },
  addButton: {
    paddingBottom: 8,
  },
  detallesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  detallesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detalleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detalleText: {
    fontSize: 14,
    color: '#000',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  observacionesInput: {
    marginTop: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});

