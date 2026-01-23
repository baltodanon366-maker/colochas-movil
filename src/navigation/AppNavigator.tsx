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
import { ResetPasswordScreen } from '../features/auth/pages/ResetPasswordScreen';

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

export type RootStackParamList = {
  Login: undefined;
  ResetPassword: undefined;
  MainTabs: undefined;
  Perfil: undefined;
  UserManagement: undefined;
  VentaDetalle: { ventaId: number };
  AnalisisNumeros: undefined;
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
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
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
