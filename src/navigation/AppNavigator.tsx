import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// Auth Pages
import { LoginScreen } from '../features/auth/pages/LoginScreen';

// Main Pages
import { DashboardScreen } from '../features/dashboard/pages/DashboardScreen';
import { VentasScreen } from '../features/ventas/pages/VentasScreen';
import { RestriccionesScreen } from '../features/restricciones/pages/RestriccionesScreen';
import { TurnosScreen } from '../features/cierres/pages/TurnosScreen';
import { PerfilScreen } from '../features/perfil/pages/PerfilScreen';
import { HistorialScreen } from '../features/historial/pages/HistorialScreen';
import { AnalisisNumerosScreen } from '../features/historial/pages/AnalisisNumerosScreen';
import { UserManagementScreen } from '../features/users/pages/UserManagementScreen';
import { VentaDetalleScreen } from '../features/ventas/pages/VentaDetalleScreen';

// New Form Screens
import { NuevaVentaScreen } from '../features/ventas/pages/NuevaVentaScreen';
import { SeleccionarTurnoScreen } from '../features/ventas/pages/SeleccionarTurnoScreen';
import { CreateUserScreen } from '../features/users/pages/CreateUserScreen';
import { EditUserScreen } from '../features/users/pages/EditUserScreen';
import { CreateTurnoScreen } from '../features/cierres/pages/CreateTurnoScreen';
import { EditTurnoScreen } from '../features/cierres/pages/EditTurnoScreen';
import { CerrarTurnoScreen } from '../features/cierres/pages/CerrarTurnoScreen';
import { CreateRestriccionScreen } from '../features/restricciones/pages/CreateRestriccionScreen';
import { BoucherPreviewScreen } from '../features/ventas/pages/BoucherPreviewScreen';
import { NumeroDetalleScreen } from '../features/historial/pages/NumeroDetalleScreen';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Perfil: undefined;
  UserManagement: undefined;
  VentaDetalle: { ventaId: number };
  AnalisisNumeros: undefined;
  NuevaVenta: { turnoId: number; categoria?: string; onSuccess?: () => void };
  SeleccionarTurno: { categoria: string; fecha?: string; turnoIdActual?: number; onSuccess?: () => void };
  CreateUser: { availableRoles?: any[]; onSuccess?: () => void };
  EditUser: { userId: number; availableRoles?: any[]; onReload?: () => void };
  CreateTurno: { onSuccess?: () => void };
  EditTurno: { turnoId: number; onSuccess?: () => void };
  CerrarTurno: { turnoId: number; fecha: string; onSuccess?: () => void };
  CreateRestriccion: { turnoId: number; fecha: string; onSuccess?: () => void };
  BoucherPreview: { venta: any };
  NumeroDetalle: { numero: any };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Ventas: { turnoId?: number };
  Restricciones: undefined;
  Cierres: undefined;
  Historial: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border.light,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: Colors.background.secondary,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Ventas"
        component={VentasScreen}
        options={{
          tabBarLabel: 'Ventas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Restricciones"
        component={RestriccionesScreen}
        options={{
          tabBarLabel: 'Restricciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ban" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cierres"
        component={TurnosScreen}
        options={{
          tabBarLabel: 'Turnos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Historial"
        component={HistorialScreen}
        options={{
          tabBarLabel: 'Reporte',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="Perfil" 
              component={PerfilScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="UserManagement" 
              component={UserManagementScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="VentaDetalle" 
              component={VentaDetalleScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="AnalisisNumeros" 
              component={AnalisisNumerosScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="NuevaVenta" 
              component={NuevaVentaScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SeleccionarTurno" 
              component={SeleccionarTurnoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CreateUser" 
              component={CreateUserScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="EditUser" 
              component={EditUserScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CreateTurno" 
              component={CreateTurnoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="EditTurno" 
              component={EditTurnoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CerrarTurno" 
              component={CerrarTurnoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CreateRestriccion" 
              component={CreateRestriccionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="BoucherPreview" 
              component={BoucherPreviewScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="NumeroDetalle" 
              component={NumeroDetalleScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
});
