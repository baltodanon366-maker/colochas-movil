import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';

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
  formatYLabel?: (value: string) => string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  yAxisLabel,
  yAxisSuffix,
  formatYLabel,
}) => {
  const dataset = data.datasets[0];
  const maxValue = Math.max(...dataset.data);
  const minValue = Math.min(...dataset.data);
  
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          {/* Puntos de datos */}
          <View style={styles.dataPointsContainer}>
            {dataset.data.map((value, index) => {
              const normalizedHeight = maxValue > minValue 
                ? ((value - minValue) / (maxValue - minValue)) * 120 
                : 60;
              const bottomPosition = 20; // Base de la gráfica
              
              return (
                <View key={index} style={styles.pointContainer}>
                  {/* Línea vertical desde el punto hasta la base */}
                  <View 
                    style={[
                      styles.verticalLine,
                      { 
                        height: normalizedHeight,
                        bottom: bottomPosition,
                      }
                    ]} 
                  />
                  {/* Punto de datos */}
                  <View 
                    style={[
                      styles.dataPoint,
                      { bottom: bottomPosition + normalizedHeight - 4 }
                    ]} 
                  />
                  {/* Valor sobre el punto */}
                  <Text 
                    style={[
                      styles.valueText,
                      { bottom: bottomPosition + normalizedHeight + 8 }
                    ]}
                  >
                    {formatYLabel ? formatYLabel(value.toString()) : `${yAxisLabel || ''}${value}${yAxisSuffix || ''}`}
                  </Text>
                  {/* Etiqueta del eje X */}
                  <Text style={styles.labelText}>
                    {data.labels[index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    height: 200,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  dataPointsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  pointContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
    minWidth: 40,
    height: '100%',
    position: 'relative',
  },
  verticalLine: {
    width: 2,
    backgroundColor: Colors.primary + '40', // 40% opacity
    position: 'absolute',
  },
  dataPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    elevation: 2,
  },
  valueText: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontWeight: '500',
    position: 'absolute',
    textAlign: 'center',
  },
  labelText: {
    fontSize: 10,
    color: Colors.text.tertiary,
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    transform: [{ rotate: '-45deg' }],
  },
});