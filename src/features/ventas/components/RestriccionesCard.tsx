import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { RestriccionNumero } from '../../../types';

interface RestriccionesCardProps {
  restricciones: RestriccionNumero[];
  loading?: boolean;
}

export const RestriccionesCard: React.FC<RestriccionesCardProps> = ({
  restricciones,
  loading = false,
}) => {
  const list = restricciones.filter((r) => r.estaRestringido);

  if (loading && list.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando restricciones...</Text>
      </View>
    );
  }

  if (list.length === 0 && !loading) {
    return null;
  }

  return (
    <Card style={styles.restriccionesCard}>
      <View style={styles.restriccionesHeader}>
        <Ionicons name="ban" size={18} color={Colors.danger} />
        <Text style={styles.restriccionesTitle}>
          Números Restringidos ({list.length})
        </Text>
      </View>
      <View style={styles.restriccionesGrid}>
        {list.map((r) => (
          <View key={`${r.numero}-${r.id}`} style={styles.restriccionItem}>
            <Text style={styles.restriccionNumero}>
              {r.numero.toString().padStart(2, '0')}
            </Text>
            {r.tipoRestriccion === 'monto' && r.limiteMonto != null && (
              <Text style={styles.restriccionMonto}>
                ({Number(r.limiteMonto)})
              </Text>
            )}
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  restriccionesCard: {
    marginBottom: 12,
    backgroundColor: Colors.errorLight,
    borderWidth: 2,
    borderColor: Colors.danger,
    borderRadius: 10,
    padding: 10,
  },
  restriccionesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  restriccionesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.danger,
  },
  restriccionesSubtitle: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  restriccionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  restriccionItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  restriccionNumero: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  restriccionMonto: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
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

