import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Platform } from 'react-native';
import { Colors } from '../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text.inverse} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 50,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' as any }
      : {
          shadowColor: Colors.shadow.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: Colors.shadow.opacity,
          shadowRadius: 4,
          elevation: 3,
        }),
  },
  primary: {
    backgroundColor: Colors.secondary, // Dorado estándar
  },
  secondary: {
    backgroundColor: Colors.secondary, // Dorado estándar
  },
  danger: {
    backgroundColor: Colors.secondary, // Dorado estándar (todos los botones son dorados)
  },
  success: {
    backgroundColor: Colors.secondary, // Dorado estándar (todos los botones son dorados)
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: Colors.secondary, // Mantener color dorado incluso cuando está deshabilitado
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse, // Blanco por defecto
  },
  primaryText: {
    color: Colors.text.inverse, // Blanco
  },
  secondaryText: {
    color: Colors.text.inverse, // Blanco
  },
  dangerText: {
    color: Colors.text.inverse,
  },
  successText: {
    color: Colors.text.inverse,
  },
});


