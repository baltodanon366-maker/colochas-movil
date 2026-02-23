import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Colors } from '../../../constants/colors';

export const PerfilScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  
  // Mejorar la detección de admin (igual que en HistorialScreen)
  const isAdmin = user?.roles?.some((role: any) => {
    if (typeof role === 'string') {
      return role.toLowerCase() === 'admin';
    }
    if (typeof role === 'object' && role.nombre) {
      return role.nombre.toLowerCase() === 'admin';
    }
    return false;
  });
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // La navegación se manejará automáticamente por el AuthProvider
      // que actualiza isAuthenticated y el AppNavigator redirige a Login
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Perfil"
        onBack={() => navigation.goBack()}
        showAddButton={false}
      />

      <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#007AFF" />
        </View>
        <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.telefono}>{user?.telefono}</Text>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{user?.telefono}</Text>
        </View>
        {user?.roles && user.roles.length > 0 && (
          <View style={styles.rolesContainer}>
            <Text style={styles.rolesLabel}>Roles:</Text>
            <View style={styles.rolesList}>
              {user.roles.map((role, index) => (
                <View key={index} style={styles.roleBadge}>
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card>

      {isAdmin && (
        <Card style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Ionicons name="people-outline" size={24} color={Colors.primary} />
            <Text style={styles.menuText}>Gestión de Usuarios</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </Card>
      )}

      <Button
        title="Cerrar Sesión"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
      </ScrollView>

      {/* Modal de Confirmación de Cerrar Sesión */}
      <Modal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Cerrar Sesión"
        showCloseButton={false}
      >
        <View style={styles.modalContent}>
          <Ionicons name="log-out-outline" size={48} color={Colors.danger} style={styles.modalIcon} />
          <Text style={styles.modalMessage}>
            ¿Estás seguro de que deseas cerrar sesión?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              title="Cancelar"
              onPress={() => setShowLogoutModal(false)}
              variant="secondary"
              style={styles.modalButton}
            />
            <Button
              title="Sí, Cerrar Sesión"
              onPress={confirmLogout}
              variant="danger"
              loading={loggingOut}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  telefono: {
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    margin: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  rolesContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  rolesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  rolesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  menuCard: {
    margin: 16,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
  cancelButton: {
    // El botón cancelar ya tiene el estilo secondary
  } as const,
  confirmButton: {
    // El botón confirmar ya tiene el estilo danger
  } as const,
});


