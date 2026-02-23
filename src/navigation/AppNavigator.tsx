import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { DrawerMenuScreen } from '../components/DrawerMenuScreen';

// Auth Pages
import { LoginScreen } from '../features/auth/pages/LoginScreen';

// Main Pages (Drawer)
import { VentasScreen } from '../features/ventas/pages/VentasScreen';
import { RestriccionesScreen } from '../features/restricciones/pages/RestriccionesScreen';
import { TurnosScreen } from '../features/cierres/pages/TurnosScreen';
import { HistorialScreen } from '../features/historial/pages/HistorialScreen';
import { PerfilScreen } from '../features/perfil/pages/PerfilScreen';
import { AnalisisNumerosScreen } from '../features/historial/pages/AnalisisNumerosScreen';
import { UserManagementScreen } from '../features/users/pages/UserManagementScreen';
import { VentaDetalleScreen } from '../features/ventas/pages/VentaDetalleScreen';

// Form Screens
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
  MainDrawer: undefined;
  Login: undefined;
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

export type MainDrawerParamList = {
  Ventas: { categoria?: 'diaria' | 'tica' };
  Restricciones: { categoria?: 'diaria' | 'tica' };
  Turnos: { categoria?: 'diaria' | 'tica' };
  Historial: { initialView?: 'reporte' };
  CierreDeTurno: { initialView?: 'reporteCierre' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Ventas"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: Colors.primaryDark,
          width: 280,
        },
        drawerActiveTintColor: Colors.secondary,
        drawerInactiveTintColor: Colors.text.inverse,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        drawerItemStyle: {
          marginVertical: 4,
          marginHorizontal: 12,
          borderRadius: 8,
        },
        drawerActiveBackgroundColor: Colors.primary,
      }}
    >
      <Drawer.Screen
        name="Ventas"
        component={VentasScreen}
        initialParams={{ categoria: 'diaria' }}
        options={{
          drawerLabel: 'Ventas',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Restricciones"
        component={RestriccionesScreen}
        initialParams={{ categoria: 'diaria' }}
        options={{
          drawerLabel: 'Restricciones',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ban-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Turnos"
        component={TurnosScreen}
        initialParams={{ categoria: 'diaria' }}
        options={{
          drawerLabel: 'Turnos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Historial"
        component={HistorialScreen}
        initialParams={{ initialView: 'reporte' }}
        options={{
          drawerLabel: 'Historial',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CierreDeTurno"
        component={HistorialScreen}
        initialParams={{ initialView: 'reporteCierre' }}
        options={{
          drawerLabel: 'Cierre de turno',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="close-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

/** En web el Drawer usa Reanimated que falla; usamos un Stack con pantalla de menú. */
const WebStack = createNativeStackNavigator<MainDrawerParamList & { DrawerMenu: undefined }>();

const MainWeb = () => {
  return (
    <WebStack.Navigator
      initialRouteName="Ventas"
      screenOptions={{ headerShown: false }}
    >
      <WebStack.Screen
        name="Ventas"
        component={VentasScreen}
        initialParams={{ categoria: 'diaria' }}
      />
      <WebStack.Screen
        name="Restricciones"
        component={RestriccionesScreen}
        initialParams={{ categoria: 'diaria' }}
      />
      <WebStack.Screen
        name="Turnos"
        component={TurnosScreen}
        initialParams={{ categoria: 'diaria' }}
      />
      <WebStack.Screen
        name="Historial"
        component={HistorialScreen}
        initialParams={{ initialView: 'reporte' }}
      />
      <WebStack.Screen
        name="CierreDeTurno"
        component={HistorialScreen}
        initialParams={{ initialView: 'reporteCierre' }}
      />
      <WebStack.Screen name="DrawerMenu" component={DrawerMenuScreen} />
    </WebStack.Navigator>
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
            <Stack.Screen
              name="MainDrawer"
              component={Platform.OS === 'web' ? MainWeb : MainDrawer}
            />
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
