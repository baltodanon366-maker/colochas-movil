import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { NumericKeyboard } from '../../../components/NumericKeyboard';
import { RestriccionesCard } from '../components/RestriccionesCard';
import { DetallesList } from '../components/DetallesList';
import { BoucherPreview } from '../../../components/BoucherPreview';
import { Colors } from '../../../constants/colors';
import { Turno, DetalleVenta, Venta } from '../../../types';
import { formatearNombreTurno } from '../../../utils/turnoUtils';
import { restriccionesService } from '../../restricciones/services/restricciones.service';
import { ventasService } from '../services/ventas.service';
import { getNicaraguaDate } from '../../../utils/dateUtils';
import { turnosService } from '../../../services/turnos.service';

export const NuevaVentaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { turnoId, categoria, onSuccess } = route.params as any || {};

  const [turno, setTurno] = useState<Turno | null>(null);
  const [loadingTurnos, setLoadingTurnos] = useState(true);

  useEffect(() => {
    loadTurno();
  }, [turnoId]);

  const loadTurno = async () => {
    if (!turnoId) {
      setLoadingTurnos(false);
      return;
    }

    try {
      setLoadingTurnos(true);
      const turnoData = await turnosService.getById(turnoId);
      setTurno(turnoData);
    } catch (error) {
      console.error('Error al cargar turno:', error);
    } finally {
      setLoadingTurnos(false);
    }
  };

  const [fecha, setFecha] = useState(getNicaraguaDate());
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [numeroInput, setNumeroInput] = useState('');
  const [montoInput, setMontoInput] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [inputFocus, setInputFocus] = useState<'numero' | 'monto' | null>(null);
  const [numerosRestringidos, setNumerosRestringidos] = useState<number[]>([]);
  const [loadingRestricciones, setLoadingRestricciones] = useState(false);
  const [creating, setCreating] = useState(false);
  const [ventaCreada, setVentaCreada] = useState<Venta | null>(null);
  const [showBoucherPreview, setShowBoucherPreview] = useState(false);
  const turnoAnteriorRef = useRef<Turno | null>(null);

  useEffect(() => {
    if (turno) {
      const cambioTurno = turnoAnteriorRef.current?.id !== turno.id;
      if (cambioTurno) {
        loadRestricciones(true);
        turnoAnteriorRef.current = turno;
      }
    }
  }, [turno]);

  const loadRestricciones = async (mostrarLoading: boolean = false) => {
    if (!turno) {
      setNumerosRestringidos([]);
      return;
    }

    if (mostrarLoading) {
      setLoadingRestricciones(true);
    }

    try {
      const restriccionesData = await restriccionesService.getAll(turno.id, fecha);
      const numerosRestringidosList = restriccionesData
        .filter(r => r.estaRestringido)
        .map(r => r.numero);
      setNumerosRestringidos(numerosRestringidosList);
    } catch (error) {
      console.error('Error al cargar restricciones:', error);
      setNumerosRestringidos([]);
    } finally {
      setLoadingRestricciones(false);
    }
  };

  const handleFechaChange = (newFecha: string) => {
    setFecha(newFecha);
    if (turno) {
      setTimeout(() => {
        loadRestricciones(false);
      }, 100);
    }
  };

  const handleNumericInput = (value: string) => {
    if (inputFocus === 'numero') {
      if (value === '-') {
        setNumeroInput('');
      } else if (value === 'BORRAR') {
        setNumeroInput(prev => prev.slice(0, -1));
      } else {
        const newValue = numeroInput + value;
        if (newValue.length <= 2 && parseInt(newValue) <= 99) {
          setNumeroInput(newValue);
        }
      }
    } else if (inputFocus === 'monto') {
      if (value === '-') {
        setMontoInput('');
      } else if (value === 'BORRAR') {
        setMontoInput(prev => prev.slice(0, -1));
      } else {
        setMontoInput(prev => prev + value);
      }
    }
  };

  const addDetalle = () => {
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

    if (detalles.some((d) => d.numero === numero)) {
      Alert.alert('Error', 'Este número ya está en la lista');
      return;
    }

    if (numerosRestringidos.includes(numero)) {
      Alert.alert(
        '⚠️ Número Restringido',
        `El número ${numero.toString().padStart(2, '0')} no puede ser vendido en este turno.\n\nPor favor, selecciona otro número disponible.`,
        [
          {
            text: 'Entendido',
            style: 'default',
            onPress: () => {
              setNumeroInput('');
              setInputFocus('numero');
            },
          },
        ]
      );
      return;
    }

    setDetalles([...detalles, { numero, monto }]);
    setNumeroInput('');
    setMontoInput('');
    setInputFocus(null);
  };

  const removeDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const verificarRestricciones = async (): Promise<boolean> => {
    if (!turno) return true;

    try {
      const numeros = detalles.map((d) => d.numero);
      const response = await restriccionesService.verificarMultiples(
        turno.id,
        numeros,
        fecha
      );

      if (response.restringidos > 0) {
        Alert.alert(
          'Números Restringidos',
          `Los siguientes números están restringidos: ${response.numerosRestringidos.join(', ')}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verificando restricciones:', error);
      return true;
    }
  };

  const handleCreate = async () => {
    if (!turno) {
      Alert.alert('Error', 'No hay un turno activo');
      return;
    }

    if (detalles.length === 0) {
      Alert.alert('Error', 'Agrega al menos un número');
      return;
    }

    const puedeVender = await verificarRestricciones();
    if (!puedeVender) return;

    setCreating(true);
    try {
      const venta = await ventasService.create({
        turnoId: turno.id,
        fecha,
        detalles,
        observaciones: observaciones || undefined,
      });
      setVentaCreada(venta);
      setShowBoucherPreview(true);
      onSuccess?.();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la venta');
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const total = detalles.reduce((sum, d) => sum + d.monto, 0);

  if (!turno && !loadingTurnos) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Nueva Venta" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró el turno</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Nueva Venta"
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Card style={styles.turnoCard}>
          <Text style={styles.turnoLabel}>Turno:</Text>
          <Text style={styles.turnoValue}>{formatearNombreTurno(turno!)}</Text>
        </Card>

        <View style={styles.fechaInputContainer}>
          <Input
            label="Fecha"
            value={fecha}
            onChangeText={handleFechaChange}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <RestriccionesCard
          numerosRestringidos={numerosRestringidos}
          loading={loadingRestricciones}
        />

        <View style={styles.detallesSection}>
          <Text style={styles.label}>Números</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Input
                label="Número (0-99)"
                placeholder="00"
                value={numeroInput}
                onChangeText={setNumeroInput}
                onFocus={() => setInputFocus('numero')}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.inputHalf}>
              <Input
                label="Monto"
                placeholder="0.00"
                value={montoInput}
                onChangeText={setMontoInput}
                onFocus={() => setInputFocus('monto')}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {inputFocus && (
            <View style={styles.keyboardContainer}>
              <NumericKeyboard
                onNumberPress={handleNumericInput}
                onDelete={() => handleNumericInput('BORRAR')}
                onNext={addDetalle}
                showNext={!!(numeroInput && montoInput)}
              />
            </View>
          )}

          <Button
            title="Agregar Número"
            onPress={addDetalle}
            variant="primary"
            disabled={!numeroInput || !montoInput}
            style={styles.addDetalleButton}
          />

          <DetallesList detalles={detalles} onRemove={removeDetalle} total={total} />
        </View>

        <Input
          label="Observaciones (opcional)"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={3}
        />

        <Button
          title="Crear Venta"
          onPress={handleCreate}
          loading={creating}
          style={styles.createButton}
        />
      </ScrollView>

      <BoucherPreview
        visible={showBoucherPreview}
        venta={ventaCreada}
        onClose={() => {
          setShowBoucherPreview(false);
          setVentaCreada(null);
          navigation.goBack();
        }}
        onPrint={() => {
          setShowBoucherPreview(false);
          setVentaCreada(null);
        }}
      />
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
  turnoCard: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  turnoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 4,
  },
  turnoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  fechaInputContainer: {
    marginBottom: 20,
  },
  detallesSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  inputHalf: {
    flex: 1,
  },
  keyboardContainer: {
    marginVertical: 16,
  },
  addDetalleButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  createButton: {
    marginTop: 16,
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
