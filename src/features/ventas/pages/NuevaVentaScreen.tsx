import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Loading } from '../../../components/Loading';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { NumericKeyboard } from '../../../components/NumericKeyboard';
import { RestriccionesCard } from '../components/RestriccionesCard';
import { DetallesList } from '../components/DetallesList';
import { Colors } from '../../../constants/colors';
import { Turno, DetalleVenta, Venta, RestriccionNumero } from '../../../types';
import { formatearNombreTurno, getTurnosProximos } from '../../../utils/turnoUtils';
import { restriccionesService } from '../../restricciones/services/restricciones.service';
import { ventasService } from '../services/ventas.service';
import { getNicaraguaDate } from '../../../utils/dateUtils';
import { turnosService } from '../../../services/turnos.service';

export const NuevaVentaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { turnoId, categoria, onSuccess } = route.params as any || {};

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loadingTurnos, setLoadingTurnos] = useState(true);
  const [fecha, setFecha] = useState(getNicaraguaDate());
  const [selectedTurnoIndex, setSelectedTurnoIndex] = useState(0);

  useEffect(() => {
    loadTurnos();
  }, [categoria]);

  const loadTurnos = async () => {
    if (!categoria) {
      setLoadingTurnos(false);
      return;
    }
    try {
      setLoadingTurnos(true);
      const data = await turnosService.getActivos(categoria);
      setTurnos(data || []);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      setTurnos([]);
    } finally {
      setLoadingTurnos(false);
    }
  };

  const turnosProximos = useMemo(
    () => getTurnosProximos(turnos, fecha),
    [turnos, fecha]
  );

  const turno = turnosProximos[selectedTurnoIndex] ?? null;

  // Sincronizar índice cuando cambian turnos próximos (p. ej. al cambiar fecha)
  useEffect(() => {
    if (turnosProximos.length === 0) return;
    const idxById = turnosProximos.findIndex((t) => t.id === turnoId);
    if (idxById >= 0 && selectedTurnoIndex !== idxById) {
      setSelectedTurnoIndex(idxById);
    } else if (selectedTurnoIndex >= turnosProximos.length) {
      setSelectedTurnoIndex(0);
    }
  }, [turnosProximos, turnoId]);

  const handleSeleccionarTurno = () => {
    navigation.navigate('SeleccionarTurno', {
      categoria,
      fecha,
      turnoIdActual: turno?.id,
      onSuccess,
    });
  };

  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [numeroInput, setNumeroInput] = useState('');
  const [montoInput, setMontoInput] = useState('');
  const [inputFocus, setInputFocus] = useState<'numero' | 'monto' | null>(null);
  const [restricciones, setRestricciones] = useState<RestriccionNumero[]>([]);
  const [loadingRestricciones, setLoadingRestricciones] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorMontoRestriccion, setErrorMontoRestriccion] = useState<string | null>(null);
  const turnoAnteriorRef = useRef<Turno | null>(null);
  const creatingRef = useRef(false);

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
      setRestricciones([]);
      return;
    }

    if (mostrarLoading) {
      setLoadingRestricciones(true);
    }

    try {
      const restriccionesData = await restriccionesService.getAll(turno.id, fecha);
      setRestricciones(restriccionesData || []);
    } catch (error) {
      console.error('Error al cargar restricciones:', error);
      setRestricciones([]);
    } finally {
      setLoadingRestricciones(false);
    }
  };

  const handleNumeroChange = (text: string) => {
    setErrorMontoRestriccion(null);
    const digits = text.replace(/\D/g, '').slice(0, 2);
    const num = parseInt(digits, 10);
    if (digits.length <= 2 && (digits === '' || num <= 99)) {
      setNumeroInput(digits);
      if (digits.length === 2) setInputFocus('monto');
    }
  };

  const handleNumericInput = (value: string) => {
    const focus = inputFocus ?? 'numero';
    if (focus === 'numero') {
      if (value === '-') {
        setNumeroInput('');
      } else if (value === 'BORRAR') {
        setNumeroInput(prev => prev.slice(0, -1));
      } else {
        const newValue = numeroInput + value;
        if (newValue.length <= 2 && parseInt(newValue) <= 99) {
          setNumeroInput(newValue);
          if (newValue.length === 2) setInputFocus('monto');
        }
      }
    } else if (focus === 'monto') {
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

    const restriccion = restricciones.find((r) => r.numero === numero && r.estaRestringido);
    if (restriccion) {
      if (restriccion.tipoRestriccion === 'completo') {
        Alert.alert(
          '⚠️ Número Restringido',
          `El número ${numero.toString().padStart(2, '0')} no puede ser vendido en este turno.`,
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
      if (restriccion.tipoRestriccion === 'monto' && restriccion.limiteMonto != null && monto >= Number(restriccion.limiteMonto)) {
        setErrorMontoRestriccion(`El número solo está disponible con menos de C$${Number(restriccion.limiteMonto).toFixed(2)}`);
        return;
      }
    }

    setErrorMontoRestriccion(null);
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
    if (creatingRef.current) return;
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

    creatingRef.current = true;
    setCreating(true);
    try {
      const venta = await ventasService.create({
        turnoId: turno.id,
        fecha,
        detalles,
      });
      onSuccess?.();
      navigation.replace('BoucherPreview', { venta });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la venta');
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const total = detalles.reduce((sum, d) => sum + d.monto, 0);

  if (loadingTurnos && turnos.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Nueva Venta" onBack={handleBack} />
        <Loading message="Cargando turnos..." />
      </View>
    );
  }

  if (!categoria && !loadingTurnos) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Nueva Venta" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se especificó la categoría</Text>
        </View>
      </View>
    );
  }

  if (!loadingTurnos && categoria && turnos.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Nueva Venta" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontraron turnos para esta categoría</Text>
        </View>
      </View>
    );
  }

  if (!loadingTurnos && turnos.length > 0 && turnosProximos.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Nueva Venta" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No hay turnos disponibles para esta fecha. Todos los turnos ya pasaron.
          </Text>
        </View>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <AppHeader />
      <SubHeaderBar title="Nueva Venta" onBack={handleBack} />

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {/* Página 1: Todo en un solo scroll (turno, fecha, inputs, teclado, botón) */}
        <View style={[styles.page, { width: screenWidth }]}>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {turnosProximos.length > 0 && turno && (
              <TouchableOpacity activeOpacity={0.8} onPress={handleSeleccionarTurno}>
                <Card style={styles.turnoCard}>
                  <View style={styles.turnoCardRow}>
                    <View>
                      <Text style={styles.turnoLabel}>Turno</Text>
                      <Text style={styles.turnoValue}>{formatearNombreTurno(turno)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
                  </View>
                </Card>
              </TouchableOpacity>
            )}

            <View style={styles.fechaInputContainer}>
              <Text style={styles.fechaLabel}>Fecha</Text>
              <Text style={styles.fechaValue}>{fecha}</Text>
            </View>

            <RestriccionesCard
              restricciones={restricciones}
              loading={loadingRestricciones}
            />

            <View style={styles.detallesSection}>
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Input
                    label="Número (0-99)"
                    placeholder="00"
                    value={numeroInput}
                    onChangeText={handleNumeroChange}
                    onFocus={() => setInputFocus('numero')}
                    keyboardType="numeric"
                    maxLength={2}
                    showSoftInputOnFocus={false}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Input
                    label="Monto"
                    placeholder="0.00"
                    value={montoInput}
                    onChangeText={(text) => {
                      setErrorMontoRestriccion(null);
                      setMontoInput(text);
                    }}
                    onFocus={() => setInputFocus('monto')}
                    keyboardType="decimal-pad"
                    showSoftInputOnFocus={false}
                  />
                  {errorMontoRestriccion ? (
                    <Text style={styles.errorMontoRestriccion}>{errorMontoRestriccion}</Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.keyboardSection}>
              <NumericKeyboard
                onNumberPress={handleNumericInput}
                onDelete={() => handleNumericInput('BORRAR')}
                onNext={addDetalle}
                showNext={!!(numeroInput && montoInput)}
              />
            </View>
            <Button
              title="Crear Venta"
              onPress={handleCreate}
              loading={creating}
              style={styles.createButton}
            />
          </ScrollView>
        </View>

        {/* Página 2: Lista de números y total; botón Crear Venta abajo */}
        <View style={[styles.page, styles.listPage, { width: screenWidth }]}>
          <Text style={styles.listPageTitle}>Números a comprar</Text>
          <Text style={styles.listPageHint}>Desliza a la izquierda para volver al formulario</Text>
          <ScrollView style={styles.listPageScroll} contentContainerStyle={styles.listPageScrollContent}>
            {detalles.length === 0 ? (
              <Text style={styles.emptyListText}>Aún no hay números. Agrega número y monto en la otra pantalla.</Text>
            ) : (
              <DetallesList detalles={detalles} onRemove={removeDetalle} total={total} />
            )}
          </ScrollView>
          <Button
            title="Crear Venta"
            onPress={handleCreate}
            loading={creating}
            style={styles.createButton}
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
  horizontalScroll: {
    flex: 1,
  },
  horizontalScrollContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingBottom: 16,
  },
  turnoCard: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  turnoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  turnoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 2,
  },
  turnoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  turnoHint: {
    fontSize: 10,
    color: Colors.secondary,
    marginTop: 4,
    opacity: 0.9,
  },
  fechaInputContainer: {
    marginBottom: 12,
  },
  fechaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  fechaValue: {
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  detallesSection: {
    marginTop: 4,
    marginBottom: 12,
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
  errorMontoRestriccion: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
  keyboardSection: {
    paddingTop: 8,
  },
  createButton: {
    marginTop: 12,
  },
  listPage: {
    paddingTop: 16,
  },
  listPageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  listPageHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  listPageScroll: {
    flex: 1,
  },
  listPageScrollContent: {
    paddingBottom: 16,
  },
  emptyListText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
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
