import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Loading } from '../../../components/Loading';
import { EmptyState } from '../../../components/EmptyState';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Colors } from '../../../constants/colors';
import { useAuth } from '../../../hooks/useAuth';
import { turnosService } from '../../../services/turnos.service';
import { Turno } from '../../../types';
import { format } from 'date-fns';
import {
  HistorialSelector,
  UserSelector,
  FiltrosFecha,
  FiltrosTurno,
  HistorialVentaCard,
  DatePickerModal,
  ReporteCierreScreen,
} from '../components';
import { useHistorial } from '../hooks/useHistorial';
import { FiltroFecha } from '../components/FiltrosFecha';
import { CategoriaTurno } from '../../../types';

type HistorialView = 'selector' | 'reporte' | 'reporteCierre';

export const HistorialScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const params = (route.params || {}) as { initialView?: 'reporte' | 'reporteCierre' };
  const initialView = params.initialView ?? 'selector';

  const [view, setView] = useState<HistorialView>(initialView);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('Mi Historial');
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>('todos');
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'inicio' | 'fin'>('inicio');
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaTurno | null>(null);
  const [filtroTurnoId, setFiltroTurnoId] = useState<number | null>(null);

  const isAdmin = user?.roles?.some((role: any) => {
    if (typeof role === 'string') {
      return role.toLowerCase() === 'admin';
    }
    if (typeof role === 'object' && role.nombre) {
      return role.nombre.toLowerCase() === 'admin';
    }
    return false;
  });

  const userId = user ? (typeof user.id === 'string' ? parseInt(user.id) : user.id) : null;

  const { ventas, users, loading } = useHistorial({
    isAdmin: !!isAdmin,
    userId,
    selectedUserId,
    filtroFecha,
    fechaInicio,
    fechaFin,
    filtroCategoria,
    filtroTurnoId,
    turnos,
  });

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    try {
      const turnosData = await turnosService.getActivos();
      setTurnos(turnosData);
    } catch (error) {
      console.error('Error loading turnos:', error);
    }
  };

  const handleSelectUser = (userId: number | null, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

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
    const fechaStr = format(fecha, 'yyyy-MM-dd');
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

  const handleVentaPress = (ventaId: number) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('VentaDetalle', { ventaId });
    } else {
      navigation.navigate('VentaDetalle', { ventaId });
    }
  };

  // Vista de selector (pantalla inicial)
  if (view === 'selector') {
    return (
      <View style={styles.container}>
        <AppHeader />
        <HistorialSelector
          onSelectReporte={() => setView('reporte')}
          onSelectReporteCierre={() => setView('reporteCierre')}
        />
      </View>
    );
  }

  // Vista de Reporte de Cierre
  if (view === 'reporteCierre') {
    return (
      <View style={styles.container}>
        <AppHeader />
        <ReporteCierreScreen onBack={() => setView('selector')} />
      </View>
    );
  }

  if (loading && ventas.length === 0 && view === 'reporte') {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Loading message="Cargando reporte..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Reporte"
        onBack={() => setView('selector')}
        showBackButton={false}
        showAddButton={false}
      />

      <ScrollView style={styles.content}>
        {isAdmin && (
          <UserSelector
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={handleSelectUser}
          />
        )}

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

        <View style={styles.headerSection}>
          <Text style={styles.historialTitle}>Reporte</Text>
          {isAdmin && selectedUserId && (
            <Text style={styles.selectedUserText}>{selectedUserName}</Text>
          )}
        </View>

        {ventas.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={isAdmin && selectedUserId ? 'No hay ventas' : 'No hay ventas registradas'}
            message={
              isAdmin && selectedUserId
                ? `${selectedUserName} no tiene ventas registradas`
                : 'Aún no se han registrado ventas'
            }
          />
        ) : (
          ventas.map((venta) => (
            <HistorialVentaCard
              key={venta.id}
              venta={venta}
              isAdmin={!!isAdmin}
              onPress={() => handleVentaPress(venta.id)}
            />
          ))
        )}
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
  headerSection: {
    marginBottom: 16,
  },
  historialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  selectedUserText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});
