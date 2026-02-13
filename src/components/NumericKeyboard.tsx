import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface NumericKeyboardProps {
  onNumberPress: (value: string) => void;
  onDelete: () => void;
  onClear?: () => void;
  onNext?: () => void;
  showNext?: boolean;
}

export const NumericKeyboard: React.FC<NumericKeyboardProps> = ({
  onNumberPress,
  onDelete,
  onClear,
  onNext,
  showNext = false,
}) => {
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['-', '0', '.'],
  ];

  const specialButtons = [
    { label: 'BORRAR', onPress: onDelete, color: Colors.danger },
  ];

  if (showNext && onNext) {
    specialButtons.push({
      label: 'NEXT',
      onPress: onNext,
      color: Colors.secondary,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.numbersContainer}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.numberButton,
                  num === '-' || num === '.' ? styles.specialButton : null,
                ]}
                onPress={() => onNumberPress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.specialContainer}>
        {specialButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.specialButton, { backgroundColor: button.color }]}
            onPress={button.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.specialText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  numbersContainer: {
    flex: 3,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    maxHeight: 36,
    paddingVertical: 2,
  },
  numberButton: {
    flex: 1,
    backgroundColor: Colors.success,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    minHeight: 0,
    shadowColor: Colors.shadow.color,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 3,
    elevation: 2,
  },
  specialButton: {
    flex: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    minHeight: 0,
    shadowColor: Colors.shadow.color,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 3,
    elevation: 2,
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  specialText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  specialContainer: {
    flex: 1,
    gap: 4,
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
});

