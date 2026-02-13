import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { NumberGrid } from '../../../components/NumberGrid';
import { Colors } from '../../../constants/colors';
import { TipoRestriccion } from '../../../types';
import { restriccionesService } from '../services/restricciones.service';

interface RestriccionFormModalProps {
  visible: boolean;
  turnoId: number | null;
  fecha: string;
  numerosSeleccionados: number[];
  onClose: () => void;
  onSuccess: () => void;
  onToggleNumero: (numero: number) => void;
}

export const RestriccionFormModal: React.FC<RestriccionFormModalProps> = ({
  visible,
  turnoId,
  fecha,
  numerosSeleccionados,
  onClose,
  onSuccess,
  onToggleNumero,
}) => {
  const [tipoRestriccion, setTipoRestriccion] = useState<TipoRestriccion>('completo');
  const [limiteMonto, setLimiteMonto] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!visible) {
      setTipoRestriccion('completo');
      setLimiteMonto('');
    }
  }, [visible]);

  const handleCreate = async () => {
    if (!turnoId) {
      Alert.alert('Error', 'Selecciona un turno');
      return;
    }

    if (numerosSeleccionados.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un número');
      return;
    }

    if (tipoRestriccion === 'monto') {
      const monto = parseFloat(limiteMonto);
      if (!limiteMonto || isNaN(monto) || monto <= 0) {
        Alert.alert('Error', 'Debe especificar un límite de monto mayor a 0');
        return;
      }
    }

    setCreating(true);
    try {
      const payload: any = {
        turnoId,
        fecha,
        numeros: numerosSeleccionados,
        tipoRestriccion,
      };

      if (tipoRestriccion === 'monto') {
        payload.limiteMonto = parseFloat(limiteMonto);
      }

      await restriccionesService.createMultiple(payload);
      Alert.alert('Éxito', 'Restricciones creadas exitosamente');
      onClose();
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron crear las restricciones');
    } finally {
      setCreating(false);
    }
  };

  const numeros = Array.from({ length: 100 }, (_, i) => i);

  return (
    <Modal visible={visible} onClose={onClose} title="Crear Restricciones">
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <Text style={styles.label}>Tipo de Restricción:</Text>
        <View style={styles.tipoOptions}>
          <TouchableOpacity
            style={[
              styles.tipoOption,
              tipoRestriccion === 'completo' && styles.tipoOptionActive,
            ]}
            onPress={() => setTipoRestriccion('completo')}
          >
            <Text
              style={[
                styles.tipoOptionText,
                tipoRestriccion === 'completo' && styles.tipoOptionTextActive,
              ]}
            >
              Completo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tipoOption,
              tipoRestriccion === 'monto' && styles.tipoOptionActive,
            ]}
            onPress={() => setTipoRestriccion('monto')}
          >
            <Text
              style={[
                styles.tipoOptionText,
                tipoRestriccion === 'monto' && styles.tipoOptionTextActive,
              ]}
            >
              Por Monto
            </Text>
          </TouchableOpacity>
        </View>

        {tipoRestriccion === 'monto' && (
          <Input
            label="Límite de Monto (C$)"
            value={limiteMonto}
            onChangeText={setLimiteMonto}
            placeholder="Ej: 50.00"
            keyboardType="decimal-pad"
          />
        )}

        <Text style={styles.label}>Seleccionar Números:</Text>
        <Text style={styles.selectedCount}>
          {numerosSeleccionados.length} número(s) seleccionado(s)
        </Text>

        <NumberGrid
          numbers={numeros}
          selectedNumbers={numerosSeleccionados}
          restrictedNumbers={[]}
          onNumberPress={onToggleNumero}
        />

        <Button
          title="Crear Restricciones"
          onPress={handleCreate}
          loading={creating}
          disabled={numerosSeleccionados.length === 0}
          style={styles.createButton}
        />
      </ScrollView>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  tipoOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tipoOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    alignItems: 'center',
  },
  tipoOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tipoOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  tipoOptionTextActive: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  createButton: {
    marginTop: 16,
  },
});

