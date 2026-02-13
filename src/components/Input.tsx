import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  labelStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  labelStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ].filter(Boolean)}
        placeholderTextColor={Colors.secondary} // Placeholder dorado
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary, // Solo texto dorado, sin borde ni background
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background.secondary, // Background blanco
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.secondary, // Borde dorado
    color: Colors.secondary, // Texto dorado al escribir
  },
  inputFocused: {
    borderColor: Colors.secondary, // Borde dorado cuando está enfocado
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});


