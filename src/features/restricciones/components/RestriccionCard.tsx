import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { RestriccionNumero } from '../../../types';

interface RestriccionCardProps {
  restriccion: RestriccionNumero;
  onDelete: () => void;
}

export const RestriccionCard: React.FC<RestriccionCardProps> = ({ restriccion, onDelete }) => {
  const getTipoText = () => {
    switch (restriccion.tipoRestriccion) {
      case 'completo':
        return 'Completo';
      case 'monto':
        return `Monto: C$${Number(restriccion.limiteMonto || 0).toFixed(2)}`;
      case 'cantidad':
        return `Cantidad: ${restriccion.limiteCantidad || 0}`;
      default:
        return 'Completo';
    }
  };

  if (!restriccion.estaRestringido) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={styles.numeroBadge}>
            <Text style={styles.numeroText}>
              {restriccion.numero.toString().padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.tipo}>{getTipoText()}</Text>
            <Text style={styles.fecha}>
              {new Date(restriccion.fecha).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={24} color={Colors.danger} />
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  numeroBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.errorLight,
    borderWidth: 2,
    borderColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.danger,
  },
  info: {
    flex: 1,
  },
  tipo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  fecha: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  deleteButton: {
    padding: 4,
  },
});

