import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button';
import { Colors } from '../constants/colors';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal visible={visible} onClose={onCancel} title={title}>
      <View style={styles.container}>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.buttons}>
          <Button
            title={cancelText}
            onPress={onCancel}
            variant="secondary"
            style={styles.cancelButton}
            disabled={loading}
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            loading={loading}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
