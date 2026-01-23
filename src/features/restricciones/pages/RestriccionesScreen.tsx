import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Loading } from '../../../components/Loading';
import { Input } from '../../../components/Input';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { format } from 'date-fns';
import { useAuth } from '../../../hooks/useAuth';
import { CategoriaTurno } from '../../../types';
import {
  CategoriaSelector,
  TurnoSelector,
  TurnoInfoCard,
  RestriccionesList,
  RestriccionFormModal,
} from '../components';
import { useRestricciones } from '../hooks/useRestricciones';

type RestriccionesView = 'categoria' | 'restricciones';

export const RestriccionesScreen: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some((role: any) => {
    if (typeof role === 'string') return role.toLowerCase() === 'admin';
    if (typeof role === 'object' && role.nombre) return role.nombre.toLowerCase() === 'admin';
    return false;
  });

  const [view, setView] = useState<RestriccionesView>('categoria');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaTurno | null>(null);
  const [selectedTurnoId, setSelectedTurnoId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [numerosSeleccionados, setNumerosSeleccionados] = useState<number[]>([]);

  const { turnos, restricciones, loading, reloadRestricciones } = useRestricciones(
    categoriaSeleccionada,
    selectedTurnoId,
    fecha
  );

  const handleSeleccionarCategoria = async (categoria: CategoriaTurno) => {
    setCategoriaSeleccionada(categoria);
    setView('restricciones');
    if (turnos.length > 0) {
      setSelectedTurnoId(turnos[0].id);
    }
  };

  const handleSeleccionarTurno = (turnoId: number) => {
    setSelectedTurnoId(turnoId);
  };

  const toggleNumero = (numero: number) => {
    if (numerosSeleccionados.includes(numero)) {
      setNumerosSeleccionados(numerosSeleccionados.filter((n) => n !== numero));
    } else {
      setNumerosSeleccionados([...numerosSeleccionados, numero]);
    }
  };

  const handleBackToCategoria = () => {
    setView('categoria');
    setCategoriaSeleccionada(null);
    setSelectedTurnoId(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNumerosSeleccionados([]);
  };

  if (view === 'categoria') {
    return (
      <View style={styles.container}>
        <AppHeader />
        <CategoriaSelector onSelectCategoria={handleSeleccionarCategoria} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Loading message="Cargando turnos..." />
      </View>
    );
  }

  const turnoSeleccionado = turnos.find((t) => t.id === selectedTurnoId);

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title={categoriaSeleccionada === 'diaria' ? 'La Diaria' : 'La Tica'}
        onBack={handleBackToCategoria}
        showAddButton={!!isAdmin && !!selectedTurnoId}
        onAddPress={() => setShowCreateModal(true)}
      />

      <ScrollView style={styles.content}>

        <TurnoSelector
          turnos={turnos}
          selectedTurnoId={selectedTurnoId}
          onSelectTurno={handleSeleccionarTurno}
        />

        {turnoSeleccionado && <TurnoInfoCard turno={turnoSeleccionado} />}

        <Card style={styles.fechaCard}>
          <Input
            label="Fecha"
            value={fecha}
            onChangeText={setFecha}
            placeholder="YYYY-MM-DD"
          />
        </Card>

        <RestriccionesList
          restricciones={restricciones}
          turnoId={selectedTurnoId}
          fecha={fecha}
          isAdmin={isAdmin || false}
          onReload={reloadRestricciones}
        />
      </ScrollView>

      {isAdmin && selectedTurnoId && (
        <RestriccionFormModal
          visible={showCreateModal}
          turnoId={selectedTurnoId}
          fecha={fecha}
          numerosSeleccionados={numerosSeleccionados}
          onClose={handleCloseModal}
          onSuccess={reloadRestricciones}
          onToggleNumero={toggleNumero}
        />
      )}
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
  fechaCard: {
    marginBottom: 20,
    padding: 16,
  },
});
