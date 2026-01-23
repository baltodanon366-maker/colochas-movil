import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { Turno } from '../../../types';

interface TurnoCardProps {
  turno: Turno;
  isSelected: boolean;
  isAdmin: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCerrar?: () => void;
}

export const TurnoCard: React.FC<TurnoCardProps> = ({
  turno,
  isSelected,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
  onCerrar,
}) => {
  const turnosEstandar = ['12 MD', '3 PM', '6 PM', '9 PM', '1 PM', '4:30 PM', '7:30 PM'];
  const esEstandar = turnosEstandar.includes(turno.nombre);

  const cardStyle = isSelected ? [styles.card, styles.cardSelected] : styles.card;

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <Card style={cardStyle}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.nombre}>{turno.nombre}</Text>
              {esEstandar && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Estándar</Text>
                </View>
              )}
            </View>
            <Text style={styles.categoria}>
              {turno.categoria === 'diaria' ? 'La Diaria' : 'La Tica'}
            </Text>
            {turno.hora && (
              <Text style={styles.hora}>
                {turno.hora} {turno.horaCierre && `- ${turno.horaCierre}`}
              </Text>
            )}
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
          )}
        </View>

        {isAdmin && (
          <View style={styles.actions}>
            {onCerrar && (
              <TouchableOpacity style={styles.actionButton} onPress={onCerrar}>
                <Ionicons name="lock-closed" size={18} color={Colors.secondary} />
                <Text style={styles.actionText}>Cerrar</Text>
              </TouchableOpacity>
            )}
            {onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Ionicons name="create" size={18} color={Colors.primary} />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Ionicons name="trash" size={18} color={Colors.danger} />
                <Text style={[styles.actionText, styles.deleteText]}>
                  {esEstandar ? 'Desactivar' : 'Eliminar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  badge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary,
  },
  categoria: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  hora: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.background.tertiary,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  deleteText: {
    color: Colors.danger,
  },
});

