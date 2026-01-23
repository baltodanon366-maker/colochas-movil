import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';

interface RestriccionesCardProps {
  numerosRestringidos: number[];
  loading?: boolean;
}

export const RestriccionesCard: React.FC<RestriccionesCardProps> = ({
  numerosRestringidos,
  loading = false,
}) => {
  // Si está cargando y no hay datos previos, mostrar loading
  if (loading && numerosRestringidos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando restricciones...</Text>
      </View>
    );
  }

  // Si no hay restricciones y no está cargando, no mostrar nada
  if (numerosRestringidos.length === 0 && !loading) {
    return null;
  }

  return (
    <Card style={styles.restriccionesCard}>
      <View style={styles.restriccionesHeader}>
        <Ionicons name="ban" size={20} color={Colors.danger} />
        <Text style={styles.restriccionesTitle}>
          Números Restringidos ({numerosRestringidos.length})
        </Text>
      </View>
      <Text style={styles.restriccionesSubtitle}>
        Estos números no pueden ser vendidos en este turno
      </Text>
      <View style={styles.restriccionesGrid}>
        {numerosRestringidos.map((numero) => (
          <View key={numero} style={styles.restriccionBadge}>
            <Text style={styles.restriccionBadgeText}>
              {numero.toString().padStart(2, '0')}
            </Text>
            <Ionicons name="ban" size={12} color={Colors.danger} style={styles.restriccionIcon} />
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  restriccionesCard: {
    marginBottom: 20,
    backgroundColor: Colors.errorLight,
    borderWidth: 2,
    borderColor: Colors.danger,
    borderRadius: 12,
    padding: 16,
  },
  restriccionesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  restriccionesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.danger,
  },
  restriccionesSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  restriccionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  restriccionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  restriccionBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
  },
  restriccionIcon: {
    marginLeft: 2,
  },
  loadingContainer: {
    padding: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
});

