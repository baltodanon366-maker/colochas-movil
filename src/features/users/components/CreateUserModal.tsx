import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Role } from '../../../services/roles.service';
import { usersService, CreateUserDto } from '../../../services/users.service';
import { Alert } from 'react-native';

interface CreateUserModalProps {
  visible: boolean;
  availableRoles: Role[];
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  visible,
  availableRoles,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!visible) {
      setName('');
      setEmail('');
      setPassword('');
      setSelectedRoleIds([]);
      setShowSuccess(false);
    }
  }, [visible]);


  const handleCreate = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCreating(true);
    try {
      const createData: CreateUserDto = {
        name,
        email,
        password,
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      };

      console.log('Datos a enviar:', createData); // Log temporal para depurar
      const response = await usersService.create(createData);
      console.log('Respuesta recibida:', response); // Log temporal para depurar
      
      if (response.succeeded) {
        // Mostrar mensaje de éxito
        setShowSuccess(true);
        
        // Esperar 1.5 segundos para que el usuario vea el mensaje
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          onSuccess();
        }, 1500);
      } else {
        // Si la respuesta tiene succeeded: false, mostrar el error directamente
        Alert.alert(
          response.title || 'Error',
          response.message || 'Error al crear usuario'
        );
      }
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      
      // Extraer mensaje de error
      let errorMessage = 'No se pudo crear el usuario';
      let errorTitle = 'Error';
      
      // Si el error ya es un ApiResponse (del apiService mejorado)
      if (error.succeeded === false && error.message) {
        errorTitle = error.title || 'Error';
        errorMessage = error.message;
      } 
      // Si es un error HTTP directo
      else if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.succeeded === false && errorData.message) {
          errorTitle = errorData.title || 'Error';
          errorMessage = errorData.message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } 
      // Si tiene un mensaje directo
      else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Crear Nuevo Usuario">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {showSuccess ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
            <Text style={styles.successTitle}>¡Usuario creado exitosamente!</Text>
            <Text style={styles.successMessage}>
              El usuario {name} ha sido creado correctamente.
            </Text>
          </View>
        ) : (
          <>
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

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              containerStyle={styles.inputContainer}
            />

            <Select
              label="Asignar Roles"
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
              title="Crear Usuario"
              onPress={handleCreate}
              loading={creating}
              disabled={!name || !email || !password}
              style={styles.createButton}
            />
          </>
        )}
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
  createButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

