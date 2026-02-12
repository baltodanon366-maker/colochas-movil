import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { Role } from '../../../services/roles.service';
import { User, UpdateUserDto } from '../../../services/users.service';
import { usersService } from '../../../services/users.service';

export const EditUserScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userId, availableRoles = [], onReload } = route.params as any || {};

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se proporcionó un ID de usuario');
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      const response = await usersService.getById(userId);
      const userData = (response as any).data ?? response;
      const u = userData as User;
      setUser(u);
      setName(u.name || '');
      setTelefono(u.telefono || '');
      setSelectedRoleIds(u.roles?.map((r) => r.id) || []);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar el usuario');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!name.trim() || telefono.length !== 8) {
      Alert.alert('Error', 'Nombre y teléfono (8 dígitos) son requeridos');
      return;
    }

    setSaving(true);
    try {
      const updateData: UpdateUserDto = {};
      if (name !== user.name) {
        updateData.name = name;
      }
      if (telefono !== user.telefono) {
        updateData.telefono = telefono;
      }

      if (Object.keys(updateData).length > 0) {
        await usersService.update(user.id, updateData);
      }

      const currentRoleIds = user.roles?.map((r) => r.id) || [];
      const rolesToAdd = selectedRoleIds.filter((id) => !currentRoleIds.includes(id));
      const rolesToRemove = currentRoleIds.filter((id) => !selectedRoleIds.includes(id));

      const roleOperations = [
        ...rolesToAdd.map((roleId) => usersService.assignRole(user.id, roleId)),
        ...rolesToRemove.map((roleId) => usersService.removeRole(user.id, roleId)),
      ];

      if (roleOperations.length > 0) {
        await Promise.all(roleOperations);
      }

      Alert.alert('Éxito', 'Usuario actualizado exitosamente');
      onReload?.();
      navigation.goBack();
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      let errorMessage = 'No se pudo actualizar el usuario';
      
      if (error.succeeded === false && error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Editar Usuario" onBack={handleBack} />
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
        title={`Editar Usuario: ${user.name}`}
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Input
          label="Nombre"
          value={name}
          onChangeText={setName}
          placeholder="Nombre completo"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Número de teléfono"
          value={telefono}
          onChangeText={(text) => setTelefono(text.replace(/\D/g, '').slice(0, 8))}
          placeholder="8 dígitos"
          keyboardType="number-pad"
          maxLength={8}
          containerStyle={styles.inputContainer}
        />

        <Select
          label="Roles Disponibles"
          placeholder="Seleccionar roles..."
          options={availableRoles.map((role: Role) => ({
            label: role.nombre,
            value: role.id,
          }))}
          selectedValues={selectedRoleIds}
          onSelectionChange={(values) => setSelectedRoleIds(values as number[])}
          multiple={true}
          containerStyle={styles.selectContainer}
        />

        <Button
          title="Guardar Cambios"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  selectContainer: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
