import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';

interface HistorialSelectorProps {
  onSelectReporte: () => void;
  onSelectReporteCierre: () => void;
}

export const HistorialSelector: React.FC<HistorialSelectorProps> = ({
  onSelectReporte,
  onSelectReporteCierre,
}) => {
  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Selecciona una Opción</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={onSelectReporte}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
            <Ionicons name="receipt" size={50} color={Colors.secondary} />
          </View>
          <Text style={styles.optionTitle}>Reporte</Text>
          <Text style={styles.optionDescription}>
            Ver el historial completo de todas las ventas realizadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={onSelectReporteCierre}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
            <Ionicons name="document-text" size={50} color={Colors.text.primary} />
          </View>
          <Text style={styles.optionTitle}>Reporte de Cierre</Text>
          <Text style={styles.optionDescription}>
            Ver reporte de los 100 números por turno con totales vendidos
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  selectorContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  selectorTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 24,
  },
  optionCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 200,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

