import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface PieChartProps {
  data: Array<{
    name: string;
    population: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }>;
  title?: string;
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 200,
}) => {
  const total = data.reduce((sum, item) => sum + item.population, 0);

  return (
    <View style={[styles.container, { minHeight: height }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.chartContent}>
        {/* Círculo simplificado representativo */}
        <View style={styles.pieContainer}>
          <View style={styles.pieCircle}>
            <Text style={styles.centerText}>
              Total{'\n'}{total}
            </Text>
          </View>
        </View>
        
        {/* Leyenda con datos */}
        <View style={styles.legend}>
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.population / total) * 100).toFixed(1) : '0';
            
            return (
              <View key={index} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor, 
                    { backgroundColor: item.color }
                  ]} 
                />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendName}>{item.name}</Text>
                  <Text style={styles.legendValue}>
                    {item.population} ({percentage}%)
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
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
  chartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background.light,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  legend: {
    flex: 1.5,
    paddingLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  legendValue: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
});