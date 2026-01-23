import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { Role } from '../../../services/roles.service';
import { User, UpdateUserDto } from '../../../services/users.service';
import { usersService } from '../../../services/users.service';

interface EditUserModalProps {
  visible: boolean;
  user: User | null;
  availableRoles: Role[];
  onClose: () => void;
  onReload: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  user,
  availableRoles,
  onClose,
  onReload,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setSelectedRoleIds(user.roles?.map((r) => r.id) || []);
    }
  }, [user, visible]);


  const handleSave = async () => {
    if (!user) return;

    if (!name || !email) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      // 1. Actualizar datos del usuario (nombre y email)
      const updateData: UpdateUserDto = {};
      if (name !== user.name) {
        updateData.name = name;
      }
      if (email !== user.email) {
        updateData.email = email;
      }

      if (Object.keys(updateData).length > 0) {
        await usersService.update(user.id, updateData);
      }

      // 2. Actualizar roles - comparar roles actuales con seleccionados
      const currentRoleIds = user.roles?.map((r) => r.id) || [];
      
      // Roles a agregar (están en selectedRoleIds pero no en currentRoleIds)
      const rolesToAdd = selectedRoleIds.filter((id) => !currentRoleIds.includes(id));
      
      // Roles a remover (están en currentRoleIds pero no en selectedRoleIds)
      const rolesToRemove = currentRoleIds.filter((id) => !selectedRoleIds.includes(id));

      // Ejecutar todas las operaciones de roles en paralelo
      const roleOperations = [
        ...rolesToAdd.map((roleId) => usersService.assignRole(user.id, roleId)),
        ...rolesToRemove.map((roleId) => usersService.removeRole(user.id, roleId)),
      ];

      if (roleOperations.length > 0) {
        await Promise.all(roleOperations);
      }

      // Cerrar modal y recargar datos
      onClose();
      onReload();
      Alert.alert('Éxito', 'Usuario actualizado exitosamente');
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

  if (!user) {
    return null;
  }

  return (
    <Modal visible={visible} onClose={onClose} title={`Editar Usuario: ${user.name}`}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <Input
          label="Nombre"
          value={name}
          onChangeText={setName}
          placeholder="Nombre completo"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="email@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputContainer}
        />

        <Select
          label="Roles Disponibles"
          placeholder="Seleccionar roles..."
          options={availableRoles.map(role => ({
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

        <Button
          title="Cerrar"
          onPress={() => {
            onClose();
          }}
          variant="secondary"
          style={styles.closeButton}
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
  closeButton: {
    marginTop: 8,
    marginBottom: 8,
  },
});

