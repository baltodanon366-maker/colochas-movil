import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { RestriccionNumero } from '../../../types';

interface RestriccionesListProps {
  restricciones: RestriccionNumero[];
  fecha: string;
}

export const RestriccionesList: React.FC<RestriccionesListProps> = ({
  restricciones,
  fecha,
}) => {
  const restriccionesActivas = restricciones.filter((r) => r.estaRestringido);

  if (restriccionesActivas.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Text style={styles.emptyText}>No hay restricciones para esta fecha</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Restricciones para {fecha}</Text>
        <Text style={styles.count}>{restriccionesActivas.length} números</Text>
      </View>
      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        <View style={styles.grid}>
          {restriccionesActivas.map((restriccion) => (
            <View key={restriccion.numero} style={styles.numeroBadge}>
              <Text style={styles.numeroText}>
                {restriccion.numero.toString().padStart(2, '0')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    maxHeight: 300,
  },
  emptyCard: {
    marginBottom: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollView: {
    maxHeight: 200,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numeroBadge: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  numeroText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
  },
});

