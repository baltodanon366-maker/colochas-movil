import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { Role } from '../../../services/roles.service';
import { User } from '../../../services/users.service';

interface UserRolesSectionProps {
  user: User;
  availableRoles: Role[];
  onToggleRole: (userId: number, roleId: number, hasRole: boolean) => void;
}

export const UserRolesSection: React.FC<UserRolesSectionProps> = ({
  user,
  availableRoles,
  onToggleRole,
}) => {
  if (!user.roles || user.roles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Roles:</Text>
      <View style={styles.rolesList}>
        {availableRoles.map((role) => {
          const hasRole = user.roles?.some((r) => r.id === role.id);
          return (
            <TouchableOpacity
              key={role.id}
              style={[styles.roleChip, hasRole && styles.roleChipActive]}
              onPress={() => onToggleRole(user.id, role.id, hasRole || false)}
            >
              <Text style={[styles.roleChipText, hasRole && styles.roleChipTextActive]}>
                {role.nombre}
              </Text>
              {hasRole && <Ionicons name="checkmark" size={16} color={Colors.text.inverse} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  rolesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    gap: 6,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  roleChipTextActive: {
    color: Colors.text.onPrimary,
  },
});

