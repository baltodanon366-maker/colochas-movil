import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { hexToRgba } from '../utils/colorUtils';

// Importar condicionalmente para evitar errores en web
let RNPieChart: any = null;
if (Platform.OS !== 'web') {
  try {
    const ChartKit = require('react-native-chart-kit');
    RNPieChart = ChartKit.PieChart;
  } catch (e) {
    console.warn('react-native-chart-kit no disponible');
  }
}

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }>;
  title?: string;
  height?: number;
  accessor?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 220,
  accessor = 'value',
}) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => hexToRgba(Colors.text.primary, opacity),
  };

  // Fallback para web o si la librería no está disponible
  if (Platform.OS === 'web' || !RNPieChart) {
    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            Gráfico disponible en versión móvil
          </Text>
          <View style={styles.webDataContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.webDataRow}>
                <View style={[styles.webColorDot, { backgroundColor: item.color }]} />
                <Text style={styles.webDataLabel}>{item.name}</Text>
                <Text style={styles.webDataValue}>{item.value}</Text>
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
      <RNPieChart
        data={data}
        width={screenWidth - 64}
        height={height}
        chartConfig={chartConfig}
        accessor={accessor}
        backgroundColor="transparent"
        paddingLeft="15"
        style={styles.chart}
        absolute
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
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background.primary,
    borderRadius: 8,
  },
  webColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  webDataLabel: {
    flex: 1,
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

