import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { hexToRgba } from '../utils/colorUtils';

// Importar condicionalmente para evitar errores en web
let RNBarChart: any = null;
if (Platform.OS !== 'web') {
  try {
    const ChartKit = require('react-native-chart-kit');
    RNBarChart = ChartKit.BarChart;
  } catch (e) {
    console.warn('react-native-chart-kit no disponible');
  }
}

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
    }>;
  };
  title?: string;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  yAxisLabel = '',
  yAxisSuffix = '',
  height = 220,
}) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: Colors.background.card,
    backgroundGradientFrom: Colors.background.card,
    backgroundGradientTo: Colors.background.card,
    decimalPlaces: 0,
    color: (opacity = 1) => hexToRgba(Colors.primary, opacity),
    labelColor: (opacity = 1) => hexToRgba(Colors.text.primary, opacity),
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: Colors.border.light,
      strokeWidth: 1,
    },
    barPercentage: 0.7,
  };

  // Fallback para web o si la librería no está disponible
  if (Platform.OS === 'web' || !RNBarChart) {
    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            Gráfico disponible en versión móvil
          </Text>
          <View style={styles.webDataContainer}>
            {data.labels.map((label, index) => (
              <View key={index} style={styles.webDataRow}>
                <Text style={styles.webDataLabel}>{label}</Text>
                <Text style={styles.webDataValue}>
                  {data.datasets[0].data[index]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNBarChart
        data={data}
        width={screenWidth - 64}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  webFallback: {
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  webFallbackText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  webDataContainer: {
    gap: 8,
  },
  webDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background.primary,
    borderRadius: 8,
  },
  webDataLabel: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  webDataValue: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

