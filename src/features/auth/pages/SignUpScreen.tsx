import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [telefono, setTelefono] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigation = useNavigation<any>();

  const handleTelefonoChange = (text: string) => {
    setTelefono(text.replace(/\D/g, '').slice(0, 8));
  };

  const handleSignUp = async () => {
    if (!name.trim() || !telefono) {
      Alert.alert('Error', 'Por favor completa nombre y teléfono');
      return;
    }
    if (telefono.length !== 8) {
      Alert.alert('Error', 'El número de teléfono debe tener 8 dígitos');
      return;
    }

    setLoading(true);
    try {
      await signUp(name.trim(), telefono, username || undefined);
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Un administrador debe activar tu cuenta antes de que puedas iniciar sesión.',
        [
          {
            text: 'Ir a Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error de registro', error.message || 'No se pudo crear la cuenta');
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
              <Text style={styles.title}>Colochas</Text>
              <View style={styles.logoAccent} />
            </View>
            <Text style={styles.subtitle}>Crear Cuenta</Text>

            <View style={styles.form}>
              <Input
                label="Nombre completo"
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

              <Input
                label="Nombre de usuario (opcional)"
                placeholder="Ingresa un nombre de usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                containerStyle={styles.inputContainer}
              />

              <Button
                title="Registrarse"
                onPress={handleSignUp}
                loading={loading}
                disabled={!name.trim() || telefono.length !== 8}
                style={styles.signUpButton}
              />

              <Button
                title="¿Ya tienes cuenta? Inicia sesión"
                onPress={() => navigation.navigate('Login')}
                style={styles.linkButton}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  logoAccent: {
    width: 80,
    height: 4,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
    color: Colors.text.inverse,
    fontWeight: '500',
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
  signUpButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  linkButton: {
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
});
