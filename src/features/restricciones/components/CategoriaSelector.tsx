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
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Selecciona una Categoría</Text>
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => onSelectCategoria('diaria')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.success }]}>
              <Ionicons name="ban" size={40} color={Colors.text.inverse} />
            </View>
            <Text style={styles.categoryTitle}>La Diaria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => onSelectCategoria('tica')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
              <Ionicons name="ban-outline" size={40} color={Colors.text.inverse} />
            </View>
            <Text style={styles.categoryTitle}>La Tica</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
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
    gap: 20,
    width: '100%',
    justifyContent: 'center',
  },
  categoryCard: {
    flex: 1,
    maxWidth: 200,
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
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
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

