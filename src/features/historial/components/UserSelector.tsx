import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { User } from '../../../services/users.service';

interface UserSelectorProps {
  users: User[];
  selectedUserId: number | null;
  onSelectUser: (userId: number | null, userName: string) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  onSelectUser,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Seleccionar Usuario</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.usersScroll}
        contentContainerStyle={styles.usersScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.userChip,
            selectedUserId === null && styles.userChipActive,
          ]}
          onPress={() => onSelectUser(null, 'Mi Historial')}
        >
          <Ionicons
            name="person"
            size={16}
            color={selectedUserId === null ? Colors.secondary : Colors.text.primary}
          />
          <Text
            style={[
              styles.userChipText,
              selectedUserId === null && styles.userChipTextActive,
            ]}
          >
            Mi Historial
          </Text>
        </TouchableOpacity>

        {users.map((u, index) => (
          <TouchableOpacity
            key={`user-${u.id}-${index}`}
            style={[
              styles.userChip,
              selectedUserId === u.id && styles.userChipActive,
            ]}
            onPress={() => onSelectUser(u.id, u.name)}
          >
            <Ionicons
              name="person-outline"
              size={16}
              color={selectedUserId === u.id ? Colors.secondary : Colors.text.primary}
            />
            <Text
              style={[
                styles.userChipText,
                selectedUserId === u.id && styles.userChipTextActive,
              ]}
            >
              {u.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  usersScroll: {
    maxHeight: 60,
  },
  usersScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    marginRight: 8,
  },
  userChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  userChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  userChipTextActive: {
    color: Colors.secondary,
    fontWeight: '600',
  },
});

