import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Modal } from '../../../components/Modal';
import { Colors } from '../../../constants/colors';
import { getNicaraguaDate } from '../../../utils/dateUtils';

interface DatePickerModalProps {
  visible: boolean;
  mode: 'inicio' | 'fin';
  fechaInicio: string | null;
  fechaFin: string | null;
  onDateSelected: (fecha: Date) => void;
  onClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  mode,
  fechaInicio,
  fechaFin,
  onDateSelected,
  onClose,
}) => {
  if (Platform.OS === 'web') {
    return (
      <View style={visible ? styles.modalOverlay : { display: 'none' }}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'inicio' ? 'Seleccionar Fecha Inicio' : 'Seleccionar Fecha Fin'}
          </Text>
          <View style={styles.dateInputContainer}>
            {/* @ts-ignore - input HTML para web */}
            <input
              type="date"
              value={mode === 'inicio' ? fechaInicio || '' : fechaFin || ''}
              onChange={(e: any) => {
                if (e.target.value) {
                  // El input HTML date devuelve YYYY-MM-DD, crear Date en hora local
                  const [year, month, day] = e.target.value.split('-').map(Number);
                  onDateSelected(new Date(year, month - 1, day));
                }
              }}
              style={styles.dateInput}
            />
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Modal visible={visible} onClose={onClose} title={mode === 'inicio' ? 'Seleccionar Fecha Inicio' : 'Seleccionar Fecha Fin'}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>
          Usa el selector de fecha nativo de tu dispositivo
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonCancel]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateInputContainer: {
    marginBottom: 20,
  },
  dateInput: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: Colors.border.light,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

