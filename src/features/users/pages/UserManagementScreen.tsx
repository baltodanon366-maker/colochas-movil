import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Loading } from '../../../components/Loading';
import { EmptyState } from '../../../components/EmptyState';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { Colors } from '../../../constants/colors';
import { useAuth } from '../../../hooks/useAuth';
import { usersService } from '../../../services/users.service';
import {
  UserCard,
  UserFilters,
} from '../components';
import { useUsers } from '../hooks/useUsers';

export const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ? parseInt(currentUser.id, 10) : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { users, roles, loading, reloadData } = useUsers(searchQuery);

  const handleRequestDelete = (user: any) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await usersService.delete(userToDelete.id);
      if (res.succeeded) {
        setShowDeleteModal(false);
        setUserToDelete(null);
        reloadData();
        const msg = (res as any).data?.message || (res as any).message || 'Usuario eliminado correctamente.';
        Alert.alert('Listo', msg);
      } else {
        Alert.alert('Error', (res as any).message || 'No se pudo eliminar el usuario.');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'No se pudo eliminar el usuario.';
      Alert.alert('Error', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const availableRoles = roles.filter(
    (r) => r.estado === 'activo' && r.nombre.toLowerCase() !== 'supervisor'
  );

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
        onAddPress={() => {
          const parent = navigation.getParent();
          const nav = parent || navigation;
          nav.navigate('CreateUser', {
            availableRoles,
            onSuccess: reloadData,
          });
        }}
      />

      <ScrollView style={styles.content}>
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {users.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="No hay usuarios"
            message="Crea tu primer usuario"
          />
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => {
                const parent = navigation.getParent();
                const nav = parent || navigation;
                nav.navigate('EditUser', {
                  userId: user.id,
                  availableRoles,
                  onReload: reloadData,
                });
              }}
              onDelete={() => handleRequestDelete(user)}
              canDelete={currentUserId !== null && user.id !== currentUserId}
            />
          ))
        )}
      </ScrollView>

      <ConfirmModal
        visible={showDeleteModal}
        title="Eliminar usuario"
        message={`¿Eliminar definitivamente a ${userToDelete?.name}? Sus ventas ya no aparecerán en el historial. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        loading={isDeleting}
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
