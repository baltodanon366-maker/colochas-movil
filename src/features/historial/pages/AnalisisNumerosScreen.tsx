import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Loading } from '../../../components/Loading';
import { Colors } from '../../../constants/colors';
import { CategoriaTurno } from '../../../types';
import {
  FiltrosFecha,
  FiltrosTurno,
  TurnoStatsCard,
  ResumenCard,
  NumeroGrid,
  DatePickerModal,
} from '../components';
import { useAnalisisNumeros } from '../hooks/useAnalisisNumeros';
import { FiltroFecha } from '../components/FiltrosFecha';

export const AnalisisNumerosScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>('todos');
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaTurno | null>(null);
  const [filtroTurnoId, setFiltroTurnoId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'inicio' | 'fin'>('inicio');

  const { numeros, estadisticasTurno, turnos, loading } = useAnalisisNumeros({
    filtroFecha,
    fechaInicio,
    fechaFin,
    filtroCategoria,
    filtroTurnoId,
  });

  const handleFiltroFecha = (filtro: FiltroFecha) => {
    setFiltroFecha(filtro);
    if (filtro === 'personalizado') {
      setShowDatePicker(true);
      setDatePickerMode('inicio');
    } else {
      setFechaInicio(null);
      setFechaFin(null);
    }
  };

  const handleFechaSeleccionada = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    if (datePickerMode === 'inicio') {
      setFechaInicio(fechaStr);
      setDatePickerMode('fin');
    } else {
      setFechaFin(fechaStr);
      setShowDatePicker(false);
    }
  };

  const handleFiltroCategoria = (categoria: CategoriaTurno | null) => {
    setFiltroCategoria(categoria);
    setFiltroTurnoId(null);
  };

  const handleNumeroPress = (numero: number) => {
    const numeroDetalle = numeros[numero];
    if (numeroDetalle && numeroDetalle.vendido) {
      navigation.navigate('NumeroDetalle', { numero: numeroDetalle });
    }
  };

  if (loading && numeros.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar
          title="Análisis de Números"
          onBack={() => navigation.goBack()}
          showAddButton={false}
        />
        <Loading message="Cargando análisis..." />
      </View>
    );
  }

  const numerosVendidos = numeros.filter((n) => n.vendido);
  const numerosNoVendidos = numeros.filter((n) => !n.vendido);

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Análisis de Números"
        onBack={() => navigation.goBack()}
        showAddButton={false}
      />

      <ScrollView style={styles.content}>
        <FiltrosFecha
          filtroFecha={filtroFecha}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          onSelectFiltro={handleFiltroFecha}
        />

        <FiltrosTurno
          turnos={turnos}
          filtroCategoria={filtroCategoria}
          filtroTurnoId={filtroTurnoId}
          onSelectCategoria={handleFiltroCategoria}
          onSelectTurno={setFiltroTurnoId}
        />

        {estadisticasTurno && <TurnoStatsCard estadisticas={estadisticasTurno} />}

        <ResumenCard
          numerosVendidos={numerosVendidos.length}
          numerosNoVendidos={numerosNoVendidos.length}
        />

        <Text style={styles.sectionTitle}>Análisis por Número (0-99)</Text>
        <NumeroGrid numeros={numeros} onNumeroPress={handleNumeroPress} />
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        mode={datePickerMode}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onDateSelected={handleFechaSeleccionada}
        onClose={() => {
          setShowDatePicker(false);
          if (datePickerMode === 'inicio') {
            setFechaInicio(null);
          } else {
            setFechaFin(null);
          }
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
});
