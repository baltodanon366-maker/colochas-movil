import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { hexToRgba } from '../utils/colorUtils';

// Importar condicionalmente para evitar errores en web
let RNLineChart: any = null;
if (Platform.OS !== 'web') {
  try {
    const ChartKit = require('react-native-chart-kit');
    RNLineChart = ChartKit.LineChart;
  } catch (e) {
    console.warn('react-native-chart-kit no disponible');
  }
}

interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }>;
  };
  title?: string;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
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
  };

  // Fallback para web o si la librería no está disponible
  if (Platform.OS === 'web' || !RNLineChart) {
    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            Gráfico disponible en versión móvil
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNLineChart
        data={data}
        width={screenWidth - 64}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier
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
    textAlign: 'center',
  },
});

