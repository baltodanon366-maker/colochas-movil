import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { CategoriaTurno, UpdateTurnoDto, Turno } from '../../../types';
import { turnosService } from '../../../services/turnos.service';

export const EditTurnoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { turnoId, onSuccess } = route.params as any || {};

  const [turno, setTurno] = useState<Turno | null>(null);
  const [turnoNombre, setTurnoNombre] = useState('');
  const [turnoCategoria, setTurnoCategoria] = useState<CategoriaTurno>('diaria');
  const [turnoHora, setTurnoHora] = useState('');
  const [turnoHoraCierre, setTurnoHoraCierre] = useState('');
  const [turnoDescripcion, setTurnoDescripcion] = useState('');
  const [turnoMensaje, setTurnoMensaje] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTurno();
  }, [turnoId]);

  const loadTurno = async () => {
    if (!turnoId) {
      Alert.alert('Error', 'No se proporcionó un ID de turno');
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      const turnoData = await turnosService.getById(turnoId);
      setTurno(turnoData);
      setTurnoNombre(turnoData.nombre);
      setTurnoCategoria(turnoData.categoria);
      setTurnoHora(turnoData.hora || '');
      setTurnoHoraCierre(turnoData.horaCierre || '');
      setTurnoDescripcion(turnoData.descripcion || '');
      setTurnoMensaje(turnoData.mensaje || '');
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar el turno');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!turno) return;

    if (!turnoNombre) {
      Alert.alert('Error', 'El nombre del turno es requerido');
      return;
    }

    setSaving(true);
    try {
      const data: UpdateTurnoDto = {
        nombre: turnoNombre,
        categoria: turnoCategoria,
        hora: turnoHora || undefined,
        horaCierre: turnoHoraCierre || undefined,
        descripcion: turnoDescripcion || undefined,
        mensaje: turnoMensaje || undefined,
      };

      await turnosService.update(turno.id, data);
      Alert.alert('Éxito', 'Turno actualizado exitosamente');
      onSuccess?.();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el turno');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading || !turno) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Editar Turno" onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title={`Editar Turno: ${turno.nombre}`}
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
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
          title="Actualizar Turno"
          onPress={handleSubmit}
          loading={saving}
          style={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
