import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/Input';
import { Colors } from '../../../constants/colors';

interface UserFiltersProps {
  searchQuery: string;
  showInactive: boolean;
  onSearchChange: (query: string) => void;
  onToggleInactive: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  showInactive,
  onSearchChange,
  onToggleInactive,
}) => {
  return (
    <View style={styles.container}>
      <Input
        label="Buscar usuario"
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Buscar por nombre..."
        autoCapitalize="none"
        containerStyle={styles.searchInput}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.toggleButton, showInactive && styles.toggleButtonActive]}
        onPress={onToggleInactive}
      >
        <Ionicons
          name={showInactive ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color={showInactive ? Colors.text.inverse : Colors.text.primary}
        />
        <Text style={[styles.toggleText, showInactive && styles.toggleTextActive]}>
          {showInactive ? 'Ocultar Inactivos' : 'Mostrar Inactivos'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.background.secondary,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: Colors.text.onPrimary,
  },
});

