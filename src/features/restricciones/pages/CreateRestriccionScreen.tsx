import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { NumberGrid } from '../../../components/NumberGrid';
import { Colors } from '../../../constants/colors';
import { TipoRestriccion } from '../../../types';
import { restriccionesService } from '../services/restricciones.service';

export const CreateRestriccionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { turnoId, fecha, onSuccess } = route.params as any || {};

  const [tipoRestriccion, setTipoRestriccion] = useState<TipoRestriccion>('completo');
  const [limiteMonto, setLimiteMonto] = useState('');
  const [limiteCantidad, setLimiteCantidad] = useState('');
  const [numerosSeleccionados, setNumerosSeleccionados] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);

  const handleToggleNumero = (numero: number) => {
    if (numerosSeleccionados.includes(numero)) {
      setNumerosSeleccionados(numerosSeleccionados.filter(n => n !== numero));
    } else {
      setNumerosSeleccionados([...numerosSeleccionados, numero]);
    }
  };

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

    if (tipoRestriccion === 'cantidad') {
      const cantidad = parseInt(limiteCantidad);
      if (!limiteCantidad || isNaN(cantidad) || cantidad <= 0) {
        Alert.alert('Error', 'Debe especificar un límite de cantidad mayor a 0');
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
      } else if (tipoRestriccion === 'cantidad') {
        payload.limiteCantidad = parseInt(limiteCantidad);
      }

      await restriccionesService.createMultiple(payload);
      Alert.alert('Éxito', 'Restricciones creadas exitosamente');
      onSuccess?.();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron crear las restricciones');
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const numeros = Array.from({ length: 100 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Crear Restricciones"
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
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
          <TouchableOpacity
            style={[
              styles.tipoOption,
              tipoRestriccion === 'cantidad' && styles.tipoOptionActive,
            ]}
            onPress={() => setTipoRestriccion('cantidad')}
          >
            <Text
              style={[
                styles.tipoOptionText,
                tipoRestriccion === 'cantidad' && styles.tipoOptionTextActive,
              ]}
            >
              Por Cantidad
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

        {tipoRestriccion === 'cantidad' && (
          <Input
            label="Límite de Cantidad"
            value={limiteCantidad}
            onChangeText={setLimiteCantidad}
            placeholder="Ej: 5"
            keyboardType="numeric"
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
          onNumberPress={handleToggleNumero}
        />

        <Button
          title="Crear Restricciones"
          onPress={handleCreate}
          loading={creating}
          disabled={numerosSeleccionados.length === 0}
          style={styles.createButton}
        />
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
