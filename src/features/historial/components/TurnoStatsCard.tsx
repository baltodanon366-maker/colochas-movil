import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/Card';
import { Colors } from '../../../constants/colors';
import { EstadisticasTurno } from '../../../services/historial.service';

interface TurnoStatsCardProps {
  estadisticas: EstadisticasTurno;
}

export const TurnoStatsCard: React.FC<TurnoStatsCardProps> = ({ estadisticas }) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Estadísticas del Turno: {estadisticas.turno.nombre}</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estadisticas.totalVentas}</Text>
          <Text style={styles.statLabel}>Total Ventas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>C${estadisticas.totalMonto.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Monto</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {estadisticas.numerosVendidos}
          </Text>
          <Text style={styles.statLabel}>Números Vendidos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.text.secondary }]}>
            {estadisticas.numerosNoVendidos}
          </Text>
          <Text style={styles.statLabel}>Números No Vendidos</Text>
        </View>
      </View>

      {estadisticas.numerosVendidosLista.length > 0 && (
        <View style={styles.numerosSection}>
          <Text style={styles.numerosSectionTitle}>Números Vendidos:</Text>
          <View style={styles.numerosGrid}>
            {estadisticas.numerosVendidosLista.map((num) => (
              <View key={num} style={styles.numeroVendido}>
                <Text style={styles.numeroVendidoText}>{num.toString().padStart(2, '0')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {estadisticas.numerosNoVendidosLista.length > 0 && (
        <View style={styles.numerosSection}>
          <Text style={styles.numerosSectionTitle}>Números No Vendidos:</Text>
          <View style={styles.numerosGrid}>
            {estadisticas.numerosNoVendidosLista.map((num) => (
              <View key={num} style={styles.numeroNoVendido}>
                <Text style={styles.numeroNoVendidoText}>{num.toString().padStart(2, '0')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  numerosSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  numerosSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  numerosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numeroVendido: {
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  numeroVendidoText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  numeroNoVendido: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border.medium,
  },
  numeroNoVendidoText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
});

