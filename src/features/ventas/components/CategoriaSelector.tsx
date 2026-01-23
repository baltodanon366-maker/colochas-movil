import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { CategoriaTurno } from '../../../types';

interface CategoriaSelectorProps {
  onSelectCategoria: (categoria: CategoriaTurno) => void;
}

export const CategoriaSelector: React.FC<CategoriaSelectorProps> = ({ onSelectCategoria }) => {
  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Selecciona una Categoría</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={() => onSelectCategoria('diaria')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: Colors.success }]}>
            <Ionicons name="calendar" size={40} color={Colors.text.inverse} />
          </View>
          <Text style={styles.categoryTitle}>La Diaria</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryCard}
          onPress={() => onSelectCategoria('tica')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
            <Ionicons name="calendar-outline" size={40} color={Colors.text.inverse} />
          </View>
          <Text style={styles.categoryTitle}>La Tica</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 180,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
});

