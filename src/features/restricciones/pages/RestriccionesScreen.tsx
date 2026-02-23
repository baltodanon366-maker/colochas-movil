import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { MainDrawerParamList } from '../../../navigation/AppNavigator';
import { TurnoSelector, TurnoInfoCard, RestriccionesList } from '../components';
import { useRestricciones } from '../hooks/useRestricciones';

export const RestriccionesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = (route.params || {}) as MainDrawerParamList['Restricciones'];
  const { user } = useAuth();
  const isAdmin = user?.roles?.some((role: any) => {
    if (typeof role === 'string') return role.toLowerCase() === 'admin';
    if (typeof role === 'object' && role.nombre) return role.nombre.toLowerCase() === 'admin';
    return false;
  });

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaTurno | null>(params.categoria ?? 'diaria');
  const [selectedTurnoId, setSelectedTurnoId] = useState<number | null>(null);
  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { turnos, restricciones, loading, reloadRestricciones } = useRestricciones(
    categoriaSeleccionada,
    selectedTurnoId,
    fecha
  );

  useEffect(() => {
    if (categoriaSeleccionada && turnos.length > 0 && selectedTurnoId === null) {
      setSelectedTurnoId(turnos[0].id);
    }
  }, [categoriaSeleccionada, turnos, selectedTurnoId]);

  const handleSeleccionarTurno = (turnoId: number) => {
    setSelectedTurnoId(turnoId);
  };

  const handleBack = () => {
    if ((navigation as any).openDrawer) {
      (navigation as any).openDrawer();
    } else {
      navigation.navigate('MainDrawer', { screen: 'DrawerMenu' } as any);
    }
  };

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
        onBack={handleBack}
        showBackButton={false}
        showAddButton={!!isAdmin && !!selectedTurnoId}
        rightLabel={categoriaSeleccionada === 'diaria' ? 'La Tica' : 'La Diaria'}
        onRightPress={() => setCategoriaSeleccionada(categoriaSeleccionada === 'diaria' ? 'tica' : 'diaria')}
        onAddPress={() => {
          if (!selectedTurnoId) return;
          const parent = navigation.getParent();
          const nav = parent || navigation;
          nav.navigate('CreateRestriccion', {
            turnoId: selectedTurnoId,
            fecha,
            onSuccess: reloadRestricciones,
          });
        }}
      />

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >

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
