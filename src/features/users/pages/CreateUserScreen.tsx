import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Role } from '../../../services/roles.service';
import { usersService, CreateUserDto } from '../../../services/users.service';

export const CreateUserScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { availableRoles = [], onSuccess } = route.params as any || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    return () => {
      // Limpiar al desmontar
      setName('');
      setEmail('');
      setPassword('');
      setSelectedRoleIds([]);
      setShowSuccess(false);
    };
  }, []);

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

      const response = await usersService.create(createData);
      
      if (response.succeeded) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onSuccess?.();
          navigation.goBack();
        }, 1500);
      } else {
        Alert.alert(
          response.title || 'Error',
          response.message || 'Error al crear usuario'
        );
      }
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      
      let errorMessage = 'No se pudo crear el usuario';
      let errorTitle = 'Error';
      
      if (error.succeeded === false && error.message) {
        errorTitle = error.title || 'Error';
        errorMessage = error.message;
      } else if (error.response?.data) {
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
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Crear Nuevo Usuario"
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
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
              title="Crear Usuario"
              onPress={handleCreate}
              loading={creating}
              disabled={!name || !email || !password}
              style={styles.createButton}
            />
          </>
        )}
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
