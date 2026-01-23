import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { Turno, CategoriaTurno, CreateTurnoDto, UpdateTurnoDto } from '../../../types';
import { turnosService } from '../../../services/turnos.service';

interface TurnoFormModalProps {
  visible: boolean;
  editingTurno: Turno | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const TurnoFormModal: React.FC<TurnoFormModalProps> = ({
  visible,
  editingTurno,
  onClose,
  onSuccess,
}) => {
  const [turnoNombre, setTurnoNombre] = useState('');
  const [turnoCategoria, setTurnoCategoria] = useState<CategoriaTurno>('diaria');
  const [turnoHora, setTurnoHora] = useState('');
  const [turnoHoraCierre, setTurnoHoraCierre] = useState('');
  const [turnoDescripcion, setTurnoDescripcion] = useState('');
  const [turnoMensaje, setTurnoMensaje] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTurno) {
      setTurnoNombre(editingTurno.nombre);
      setTurnoCategoria(editingTurno.categoria);
      setTurnoHora(editingTurno.hora || '');
      setTurnoHoraCierre(editingTurno.horaCierre || '');
      setTurnoDescripcion(editingTurno.descripcion || '');
      setTurnoMensaje(editingTurno.mensaje || '');
    } else {
      resetForm();
    }
  }, [editingTurno, visible]);

  const resetForm = () => {
    setTurnoNombre('');
    setTurnoCategoria('diaria');
    setTurnoHora('');
    setTurnoHoraCierre('');
    setTurnoDescripcion('');
    setTurnoMensaje('');
  };

  const handleSubmit = async () => {
    if (!turnoNombre) {
      Alert.alert('Error', 'El nombre del turno es requerido');
      return;
    }

    setSaving(true);
    try {
      const data: CreateTurnoDto | UpdateTurnoDto = {
        nombre: turnoNombre,
        categoria: turnoCategoria,
        hora: turnoHora || undefined,
        horaCierre: turnoHoraCierre || undefined,
        descripcion: turnoDescripcion || undefined,
        mensaje: turnoMensaje || undefined,
      };

      if (editingTurno) {
        await turnosService.update(editingTurno.id, data as UpdateTurnoDto);
        Alert.alert('Éxito', 'Turno actualizado exitosamente');
      } else {
        await turnosService.create(data as CreateTurnoDto);
        Alert.alert('Éxito', 'Turno creado exitosamente');
      }

      resetForm();
      onClose();
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || `No se pudo ${editingTurno ? 'actualizar' : 'crear'} el turno`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={editingTurno ? 'Editar Turno' : 'Crear Turno'}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <Input
          label="Nombre del Turno"
          value={turnoNombre}
          onChangeText={setTurnoNombre}
          placeholder="Ej: 12 MD"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label="Hora Inicio"
              value={turnoHora}
              onChangeText={setTurnoHora}
              placeholder="Ej: 12:00"
            />
          </View>
          <View style={styles.half}>
            <Input
              label="Hora Cierre"
              value={turnoHoraCierre}
              onChangeText={setTurnoHoraCierre}
              placeholder="Ej: 15:00"
            />
          </View>
        </View>

        <Input
          label="Categoría"
          value={turnoCategoria}
          onChangeText={(value) => setTurnoCategoria(value as CategoriaTurno)}
          placeholder="diaria o tica"
        />

        <Input
          label="Descripción"
          value={turnoDescripcion}
          onChangeText={setTurnoDescripcion}
          multiline
          numberOfLines={3}
          placeholder="Descripción opcional del turno"
        />

        <Input
          label="Mensaje"
          value={turnoMensaje}
          onChangeText={setTurnoMensaje}
          multiline
          numberOfLines={2}
          placeholder="Mensaje opcional"
        />

        <Button
          title={editingTurno ? 'Actualizar Turno' : 'Crear Turno'}
          onPress={handleSubmit}
          loading={saving}
          style={styles.submitButton}
        />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  submitButton: {
    marginTop: 16,
  },
});

