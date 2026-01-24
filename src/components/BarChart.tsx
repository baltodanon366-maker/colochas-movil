import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';

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
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  yAxisLabel,
  yAxisSuffix,
}) => {
  const maxValue = Math.max(...data.datasets[0].data);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const height = maxValue > 0 ? (value / maxValue) * 150 : 0;
            
            return (
              <View key={index} style={styles.barContainer}>
                <Text style={styles.valueText}>
                  {yAxisLabel}{value}{yAxisSuffix}
                </Text>
                <View 
                  style={[
                    styles.bar, 
                    { height: Math.max(height, 5) } // Mínimo 5px de altura
                  ]} 
                />
                <Text style={styles.labelText}>{label}</Text>
              </View>
            );
          })}
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 40,
  },
  bar: {
    width: 30,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginVertical: 4,
  },
  valueText: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  labelText: {
    fontSize: 10,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: 4,
    transform: [{ rotate: '-45deg' }],
  },
});