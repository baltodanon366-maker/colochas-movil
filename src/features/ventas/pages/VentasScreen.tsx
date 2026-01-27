import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { Loading } from '../../../components/Loading';
import { EmptyState } from '../../../components/EmptyState';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Colors } from '../../../constants/colors';
import {
  CategoriaSelector,
  TurnoInfoCard,
  VentaCard,
} from '../components';
import { useVentas } from '../hooks/useVentas';
import { ventasService } from '../services/ventas.service';
import { CategoriaTurno, Venta } from '../../../types';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type VentasView = 'categoria' | 'ventas';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VentasScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [view, setView] = useState<VentasView>('categoria');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaTurno | null>(null);

  const { turnoActual, ventas, loading, reloadVentas } = useVentas(categoriaSeleccionada);

  // Cambiar a vista de ventas cuando se selecciona una categoría
  useEffect(() => {
    if (categoriaSeleccionada) {
      setView('ventas');
    }
  }, [categoriaSeleccionada]);

  const handleSeleccionarCategoria = async (categoria: CategoriaTurno) => {
    setCategoriaSeleccionada(categoria);
  };

  const handleNavigateToNuevaVenta = () => {
    if (!turnoActual) return;
    
    const parent = navigation.getParent();
    const nav = parent || navigation;
    nav.navigate('NuevaVenta', {
      turnoId: turnoActual.id,
      categoria: categoriaSeleccionada,
      onSuccess: reloadVentas,
    });
  };

  const handleVentaPress = (ventaId: number) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('VentaDetalle', { ventaId });
    } else {
      navigation.navigate('VentaDetalle', { ventaId });
    }
  };

  const handleBack = () => {
    setView('categoria');
    setCategoriaSeleccionada(null);
  };

  // Vista de selección de categoría
  if (view === 'categoria') {
    return (
      <View style={styles.container}>
        <AppHeader />
        <CategoriaSelector onSelectCategoria={handleSeleccionarCategoria} />
      </View>
    );
  }

  // Vista de ventas - Mostrar siempre el header y subheader para evitar parpadeo
  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title={categoriaSeleccionada === 'diaria' ? 'La Diaria' : 'La Tica'}
        onBack={handleBack}
        showAddButton={!!turnoActual && !loading}
        onAddPress={handleNavigateToNuevaVenta}
      />

      <ScrollView style={styles.content}>
        <TurnoInfoCard turno={turnoActual} categoria={categoriaSeleccionada} />

        {turnoActual && !loading && (
          <Button
            title="Nueva Venta"
            onPress={handleNavigateToNuevaVenta}
            style={styles.nuevaVentaButton}
            icon={<Ionicons name="add-circle" size={20} color={Colors.text.inverse} />}
          />
        )}

        {loading && ventas.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="Cargando..."
            message="Obteniendo información del turno"
          />
        ) : ventas.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="No hay ventas"
            message={turnoActual ? "Crea tu primera venta para este turno" : "No hay turno activo"}
          />
        ) : (
          ventas.map((venta) => (
            <VentaCard
              key={venta.id}
              venta={venta}
              onPress={() => handleVentaPress(venta.id)}
            />
          ))
        )}
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
  nuevaVentaButton: {
    marginBottom: 16,
  },
});
