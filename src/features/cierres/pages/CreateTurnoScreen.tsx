import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { CategoriaTurno, CreateTurnoDto } from '../../../types';
import { turnosService } from '../../../services/turnos.service';

export const CreateTurnoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { onSuccess } = route.params as any || {};

  const [turnoNombre, setTurnoNombre] = useState('');
  const [turnoCategoria, setTurnoCategoria] = useState<CategoriaTurno>('diaria');
  const [turnoHora, setTurnoHora] = useState('');
  const [turnoHoraCierre, setTurnoHoraCierre] = useState('');
  const [turnoDescripcion, setTurnoDescripcion] = useState('');
  const [turnoMensaje, setTurnoMensaje] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!turnoNombre) {
      Alert.alert('Error', 'El nombre del turno es requerido');
      return;
    }

    setSaving(true);
    try {
      const data: CreateTurnoDto = {
        nombre: turnoNombre,
        categoria: turnoCategoria,
        hora: turnoHora || undefined,
        horaCierre: turnoHoraCierre || undefined,
        descripcion: turnoDescripcion || undefined,
        mensaje: turnoMensaje || undefined,
      };

      await turnosService.create(data);
      Alert.alert('Éxito', 'Turno creado exitosamente');
      onSuccess?.();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el turno');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Crear Turno"
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
          title="Crear Turno"
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
});
