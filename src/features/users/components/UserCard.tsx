import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { User } from '../../../services/users.service';
import { format } from 'date-fns';

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onToggleStatus }) => {
  const rolesText = user.roles && user.roles.length > 0 
    ? user.roles.map(r => r.nombre).join(', ')
    : 'Sin roles asignados';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <View
              style={[
                styles.statusBadge,
                user.estado === 'activo' ? styles.statusActive : styles.statusInactive,
              ]}
            >
              <Text style={styles.statusText}>{user.estado}</Text>
            </View>
          </View>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.roles}>Roles: {rolesText}</Text>
          {user.lastLogin && (
            <Text style={styles.lastLogin}>
              Último acceso: {format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm')}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleStatus} style={styles.actionButton}>
            <Ionicons
              name={user.estado === 'activo' ? 'ban-outline' : 'checkmark-circle-outline'}
              size={20}
              color={user.estado === 'activo' ? Colors.danger : Colors.success}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: Colors.successLight,
  },
  statusInactive: {
    backgroundColor: Colors.dangerLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  roles: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  lastLogin: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});

