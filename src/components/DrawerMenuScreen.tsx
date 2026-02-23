import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { AppHeader } from './AppHeader';

type DrawerMenuRoute = 'Ventas' | 'Restricciones' | 'Turnos' | 'Historial' | 'CierreDeTurno';

const MENU_ITEMS: { name: string; route: DrawerMenuRoute; icon: string }[] = [
  { name: 'Ventas', route: 'Ventas', icon: 'receipt-outline' },
  { name: 'Restricciones', route: 'Restricciones', icon: 'ban-outline' },
  { name: 'Turnos', route: 'Turnos', icon: 'time-outline' },
  { name: 'Historial', route: 'Historial', icon: 'document-text-outline' },
  { name: 'Cierre de turno', route: 'CierreDeTurno', icon: 'close-circle-outline' },
];

export const DrawerMenuScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleSelect = (route: DrawerMenuRoute) => {
    if (route === 'Ventas') {
      navigation.replace('Ventas', { categoria: 'diaria' });
    } else if (route === 'Restricciones') {
      navigation.replace('Restricciones', { categoria: 'diaria' });
    } else if (route === 'Turnos') {
      navigation.replace('Turnos', { categoria: 'diaria' });
    } else if (route === 'Historial') {
      navigation.replace('Historial', { initialView: 'reporte' });
    } else if (route === 'CierreDeTurno') {
      navigation.replace('CierreDeTurno', { initialView: 'reporteCierre' });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Menú</Text>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.item}
            onPress={() => handleSelect(item.route)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={24} color={Colors.secondary} />
            <Text style={styles.itemText}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          </TouchableOpacity>
        ))}
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
  },
  contentContainer: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 16,
  },
});
