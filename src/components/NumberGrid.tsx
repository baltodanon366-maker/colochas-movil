import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface NumberGridProps {
  numbers: number[]; // Array de números 0-99
  selectedNumbers?: number[];
  restrictedNumbers?: number[]; // Números restringidos
  onNumberPress?: (number: number) => void;
  showValues?: boolean; // Mostrar valores asociados a cada número
  numberValues?: { [key: number]: number }; // Valores para cada número
  columns?: number;
}

export const NumberGrid: React.FC<NumberGridProps> = ({
  numbers,
  selectedNumbers = [],
  restrictedNumbers = [],
  onNumberPress,
  showValues = false,
  numberValues = {},
  columns = 5,
}) => {
  const isSelected = (num: number) => selectedNumbers.includes(num);
  const isRestricted = (num: number) => restrictedNumbers.includes(num);
  const hasValue = (num: number) => numberValues[num] !== undefined;

  const renderNumber = (num: number) => {
    const selected = isSelected(num);
    const restricted = isRestricted(num);
    const value = numberValues[num];

    return (
      <TouchableOpacity
        key={num}
        style={[
          styles.numberCell,
          restricted && styles.numberCellRestricted,
          selected && styles.numberCellSelected,
          hasValue(num) && styles.numberCellWithValue,
        ]}
        onPress={() => onNumberPress?.(num)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.numberText,
            restricted && styles.numberTextRestricted,
            selected && styles.numberTextSelected,
            hasValue(num) && styles.numberTextWithValue,
          ]}
        >
          {num.toString().padStart(2, '0')}
        </Text>
        {restricted && (
          <Ionicons name="ban" size={10} color={Colors.danger} style={styles.restrictedIcon} />
        )}
        {showValues && value !== undefined && (
          <Text style={styles.valueText}>${value.toFixed(2)}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const rows: number[][] = [];
  for (let i = 0; i < numbers.length; i += columns) {
    rows.push(numbers.slice(i, i + columns));
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((num) => renderNumber(num))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  numberCell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  numberCellSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  numberCellRestricted: {
    backgroundColor: Colors.errorLight,
    borderColor: Colors.danger,
  },
  numberCellWithValue: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  numberTextRestricted: {
    color: Colors.danger,
  },
  numberTextSelected: {
    color: Colors.text.onPrimary,
  },
  numberTextWithValue: {
    color: Colors.success,
  },
  restrictedIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  valueText: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});

