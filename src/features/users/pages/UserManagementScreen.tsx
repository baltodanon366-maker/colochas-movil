import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Loading } from '../../../components/Loading';
import { EmptyState } from '../../../components/EmptyState';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { Colors } from '../../../constants/colors';
import { usersService } from '../../../services/users.service';
import {
  UserCard,
  UserFilters,
  CreateUserModal,
  EditUserModal,
} from '../components';
import { useUsers } from '../hooks/useUsers';

export const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const { users, roles, loading, reloadData } = useUsers(searchQuery);

  const handleToggleUserStatus = (user: any) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    const action = selectedUser.estado === 'activo' ? 'desactivar' : 'activar';
    setIsTogglingStatus(true);

    try {
      if (selectedUser.estado === 'activo') {
        await usersService.deactivate(selectedUser.id);
      } else {
        await usersService.activate(selectedUser.id);
      }
      
      // Cerrar modal y recargar datos
      setShowConfirmModal(false);
      setSelectedUser(null);
      reloadData();
    } catch (error: any) {
      console.error('Error al cambiar estado del usuario:', error);
      let errorMessage = `No se pudo ${action} el usuario`;
      
      if (error.succeeded === false && error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Filtrar usuarios por estado (activos/inactivos)
  // La búsqueda por nombre ya se hace en el backend a través de useUsers
  const filteredUsers = users.filter((user) => {
    // Si showInactive está activo, solo mostrar inactivos
    if (showInactive && user.estado === 'activo') return false;
    // Si showInactive está desactivado, solo mostrar activos
    if (!showInactive && user.estado === 'inactivo') return false;
    return true;
  });

  const availableRoles = roles.filter((r) => r.estado === 'activo');

  if (loading) {
    return <Loading message="Cargando usuarios..." />;
  }

  return (
    <View style={styles.container}>
      <AppHeader />

      <SubHeaderBar
        title="Gestión de Usuarios"
        onBack={() => navigation.goBack()}
        showAddButton={true}
        onAddPress={() => setShowCreateModal(true)}
      />

      <ScrollView style={styles.content}>
        <UserFilters
          searchQuery={searchQuery}
          showInactive={showInactive}
          onSearchChange={setSearchQuery}
          onToggleInactive={() => setShowInactive(!showInactive)}
        />

        {filteredUsers.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="No hay usuarios"
            message={showInactive ? 'No hay usuarios inactivos' : 'Crea tu primer usuario'}
          />
        ) : (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => {
                setSelectedUser(user);
                setShowEditModal(true);
              }}
              onToggleStatus={() => handleToggleUserStatus(user)}
            />
          ))
        )}
      </ScrollView>

      <CreateUserModal
        visible={showCreateModal}
        availableRoles={availableRoles}
        onClose={() => setShowCreateModal(false)}
        onSuccess={reloadData}
      />

      <EditUserModal
        visible={showEditModal}
        user={selectedUser}
        availableRoles={availableRoles}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onReload={reloadData}
      />

      <ConfirmModal
        visible={showConfirmModal}
        title={selectedUser?.estado === 'activo' ? 'Desactivar Usuario' : 'Activar Usuario'}
        message={`¿Estás seguro de que deseas ${selectedUser?.estado === 'activo' ? 'desactivar' : 'activar'} a ${selectedUser?.name}?`}
        confirmText={selectedUser?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        onConfirm={confirmToggleStatus}
        onCancel={() => {
          setShowConfirmModal(false);
          setSelectedUser(null);
        }}
        loading={isTogglingStatus}
      />
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
    padding: 16,
  },
});
