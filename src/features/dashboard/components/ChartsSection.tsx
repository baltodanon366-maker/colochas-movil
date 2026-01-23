import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../../components/Card';
import { BarChart, PieChart } from '../../../components';
import { Colors } from '../../../constants/colors';

interface ChartsSectionProps {
  ventasPorTurno: Array<{
    turnoId: number;
    turnoNombre: string;
    cantidad: number;
    monto: number;
  }>;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ ventasPorTurno }) => {
  if (ventasPorTurno.length === 0) {
    return null;
  }

  const barChartData = {
    labels: ventasPorTurno.map((v) => v.turnoNombre.substring(0, 10)),
    datasets: [
      {
        data: ventasPorTurno.map((v) => v.cantidad),
      },
    ],
  };

  const pieChartData = ventasPorTurno.map((v, index) => {
    const colors = [Colors.primary, Colors.secondary, Colors.success, Colors.info, Colors.warning];
    return {
      name: v.turnoNombre,
      value: v.cantidad,
      color: colors[index % colors.length],
      legendFontColor: Colors.text.primary,
      legendFontSize: 12,
    };
  });

  return (
    <>
      <View style={styles.section}>
        <Card style={styles.chartCard}>
          <BarChart data={barChartData} title="Ventas por Turno" yAxisLabel="" yAxisSuffix="" />
        </Card>
      </View>

      <View style={styles.section}>
        <Card style={styles.chartCard}>
          <PieChart data={pieChartData} title="Distribución de Ventas" height={250} />
        </Card>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 16,
    paddingTop: 0,
  },
  chartCard: {
    padding: 16,
    marginBottom: 0,
  },
});

