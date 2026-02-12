import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Turno } from '../../../types';
import { formatearNombreTurno, getTurnosProximos } from '../../../utils/turnoUtils';
import { getNicaraguaDate } from '../../../utils/dateUtils';
import { turnosService } from '../../../services/turnos.service';

export const SeleccionarTurnoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { categoria, fecha: fechaParam, turnoIdActual, onSuccess } = (route.params as any) || {};

  const fecha = fechaParam || getNicaraguaDate();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTurnos();
  }, [categoria]);

  const loadTurnos = async () => {
    if (!categoria) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await turnosService.getActivos(categoria);
      setTurnos(data || []);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  const turnosProximos = useMemo(
    () => getTurnosProximos(turnos, fecha),
    [turnos, fecha]
  );

  const handleSelectTurno = (turno: Turno) => {
    navigation.replace('NuevaVenta', {
      turnoId: turno.id,
      categoria,
      onSuccess,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!categoria) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Seleccionar turno" onBack={handleBack} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se especificó la categoría</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Seleccionar turno" onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando turnos...</Text>
        </View>
      </View>
    );
  }

  if (turnosProximos.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Seleccionar turno" onBack={handleBack} />
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={48} color={Colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No hay turnos disponibles</Text>
          <Text style={styles.emptyText}>
            No hay turnos disponibles para esta fecha. Vuelve atrás para continuar con la venta.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <SubHeaderBar title="Seleccionar turno" onBack={handleBack} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <Text style={styles.instruction}>
          Elige el turno para el que registrarás la venta
        </Text>
        {turnosProximos.map((t) => {
          const isSelected = t.id === turnoIdActual;
          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.7}
              onPress={() => handleSelectTurno(t)}
            >
              <Card style={[styles.turnoCard, isSelected && styles.turnoCardSelected]}>
                <View style={styles.turnoRow}>
                  <Text style={styles.turnoName}>{formatearNombreTurno(t)}</Text>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                  ) : (
                    <Ionicons name="chevron-forward" size={22} color={Colors.text.tertiary} />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  instruction: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  turnoCard: {
    marginBottom: 12,
    padding: 16,
  },
  turnoCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  turnoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  turnoName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
