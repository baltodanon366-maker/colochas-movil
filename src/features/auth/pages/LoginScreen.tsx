import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Images } from '../../../constants/images';

export const LoginScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleTelefonoChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    setTelefono(digits);
  };

  const handleLogin = async () => {
    if (!name.trim() || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (telefono.length !== 8) {
      Alert.alert('Error', 'El número de teléfono debe tener 8 dígitos');
      return;
    }

    setLoading(true);
    try {
      await login(name.trim(), telefono);
    } catch (error: any) {
      const errorMessage = error.message || '';
      const isInvalidCredentials =
        errorMessage.toLowerCase().includes('credenciales') ||
        errorMessage.toLowerCase().includes('inválidas') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('unauthorized') ||
        error.response?.status === 401;

      if (isInvalidCredentials) {
        Alert.alert(
          'Usuario no encontrado',
          'El nombre o el número de teléfono no son correctos. Por favor verifica e intenta nuevamente.'
        );
      } else {
        Alert.alert('Error de inicio de sesión', errorMessage || 'Ocurrió un error al intentar iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={Colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={Images.logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.form}>
              <Input
                label="Nombre de usuario"
                placeholder="Ingresa tu nombre completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                containerStyle={styles.inputContainer}
              />

              <Input
                label="Número de teléfono"
                placeholder="8 dígitos"
                value={telefono}
                onChangeText={handleTelefonoChange}
                keyboardType="number-pad"
                maxLength={8}
                containerStyle={styles.inputContainer}
              />

              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 240,
    height: 140,
    maxWidth: '100%',
  },
  form: {
    width: '100%',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.shadow.color,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
});
