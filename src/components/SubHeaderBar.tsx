import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface SubHeaderBarProps {
  title: string;
  onBack: () => void;
  showBackButton?: boolean;
  showAddButton?: boolean;
  onAddPress?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
}

export const SubHeaderBar: React.FC<SubHeaderBarProps> = ({
  title,
  onBack,
  showBackButton = true,
  showAddButton = false,
  onAddPress,
  rightLabel,
  onRightPress,
}) => {
  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightRow}>
        {rightLabel && onRightPress && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightLabelButton} activeOpacity={0.7}>
            <Text style={styles.rightLabelText}>{rightLabel}</Text>
          </TouchableOpacity>
        )}
        {showAddButton && onAddPress && (
          <TouchableOpacity onPress={onAddPress} style={styles.addButton} activeOpacity={0.7}>
            <View style={styles.addButtonCircle}>
              <Ionicons name="add" size={24} color={Colors.text.primary} />
            </View>
          </TouchableOpacity>
        )}
        {!showAddButton && !rightLabel && <View style={styles.addButtonPlaceholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: 4,
  },
  backButtonPlaceholder: {
    width: 32,
    height: 32,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightLabelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  rightLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  addButton: {
    padding: 4,
  },
  addButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1.5,
    borderColor: Colors.text.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonPlaceholder: {
    width: 40, // Mismo ancho que el botón para mantener el balance
  },
});
