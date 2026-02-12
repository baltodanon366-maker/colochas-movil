import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../../../components/Input';
import { Colors } from '../../../constants/colors';

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  onSearchChange,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  input: {
    backgroundColor: Colors.background.secondary,
  },
});

