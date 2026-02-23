import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/Button';
import { Loading } from '../../../components/Loading';
import { EmptyState } from '../../../components/EmptyState';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Colors } from '../../../constants/colors';
import { TurnoInfoCard, VentaCard } from '../components';
import { useVentas } from '../hooks/useVentas';
import { ventasService } from '../services/ventas.service';
import { CategoriaTurno, Venta } from '../../../types';
import { RootStackParamList, MainDrawerParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const VentasScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const params = (route.params || {}) as MainDrawerParamList['Ventas'];
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaTurno | null>(params.categoria ?? 'diaria');

  const { turnoActual, ventas, loading, reloadVentas } = useVentas(categoriaSeleccionada);

  const handleNavigateToNuevaVenta = () => {
    if (!turnoActual) return;
    const parent = navigation.getParent();
    const nav = parent || navigation;
    (nav as any).navigate('NuevaVenta', {
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

  const handleDeleteVenta = async (venta: Venta) => {
    try {
      await ventasService.delete(venta.id);
      reloadVentas();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo eliminar la venta');
    }
  };

  const handleBack = () => {
    if ((navigation as any).openDrawer) {
      (navigation as any).openDrawer();
    } else {
      navigation.navigate('MainDrawer', { screen: 'DrawerMenu' } as any);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title={categoriaSeleccionada === 'diaria' ? 'La Diaria' : 'La Tica'}
        onBack={handleBack}
        showBackButton={false}
        showAddButton={false}
        rightLabel={categoriaSeleccionada === 'diaria' ? 'La Tica' : 'La Diaria'}
        onRightPress={() => setCategoriaSeleccionada(categoriaSeleccionada === 'diaria' ? 'tica' : 'diaria')}
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
              onDelete={handleDeleteVenta}
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
