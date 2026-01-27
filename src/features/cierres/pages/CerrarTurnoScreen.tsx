import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { cierresService } from '../services/cierres.service';
import { format } from 'date-fns';

export const CerrarTurnoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { turnoId, fecha, onSuccess } = route.params as any || {};

  const [observaciones, setObservaciones] = useState('');
  const [cerrando, setCerrando] = useState(false);

  const handleCerrar = async () => {
    if (!turnoId) {
      Alert.alert('Error', 'No hay turno seleccionado');
      return;
    }

    Alert.alert(
      'Cerrar Turno',
      '¿Estás seguro de que deseas cerrar este turno?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar',
          style: 'destructive',
          onPress: async () => {
            setCerrando(true);
            try {
              await cierresService.create({
                turnoId,
                fecha,
                observaciones: observaciones || undefined,
              });
              Alert.alert('Éxito', 'Turno cerrado correctamente');
              setObservaciones('');
              onSuccess?.();
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo cerrar el turno');
            } finally {
              setCerrando(false);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Cerrar Turno"
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>{format(new Date(fecha), 'dd/MM/yyyy')}</Text>
          </View>
        </View>

        <Input
          label="Observaciones (opcional)"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={4}
          placeholder="Agrega observaciones sobre el cierre del turno"
        />

        <Button
          title="Cerrar Turno"
          onPress={handleCerrar}
          loading={cerrando}
          variant="danger"
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
  infoContainer: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  submitButton: {
    marginTop: 16,
  },
});
