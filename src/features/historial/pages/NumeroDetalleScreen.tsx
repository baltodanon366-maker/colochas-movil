import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Colors } from '../../../constants/colors';
import { EstadisticaNumero } from '../../../services/historial.service';
import { Ionicons } from '@expo/vector-icons';

export const NumeroDetalleScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { numero } = route.params as { numero: EstadisticaNumero } || {};

  const handleBack = () => {
    navigation.goBack();
  };

  if (!numero || !numero.vendido) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Detalle del Número" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró información del número</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title={`Detalle del Número ${numero.numero.toString().padStart(2, '0')}`}
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.header}>
          <View style={[styles.badge, styles.badgeVendido]}>
            <Text style={styles.badgeText}>{numero.numero.toString().padStart(2, '0')}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="repeat" size={20} color={Colors.primary} />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{numero.vecesVendido}</Text>
              <Text style={styles.statLabel}>Veces Vendido</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="cash" size={20} color={Colors.success} />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>C${numero.totalMonto.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Acumulado</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="calendar" size={20} color={Colors.secondary} />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{numero.turnosDiferentes}</Text>
              <Text style={styles.statLabel}>Turnos Diferentes</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="people" size={20} color={Colors.primary} />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{numero.usuariosDiferentes}</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </View>
          </View>
        </View>

        {numero.categorias.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorías:</Text>
            <View style={styles.chips}>
              {numero.categorias.map((cat, idx) => (
                <View key={idx} style={styles.chip}>
                  <Text style={styles.chipText}>
                    {cat === 'diaria' ? 'La Diaria' : 'La Tica'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {numero.turnos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Turnos:</Text>
            <View style={styles.list}>
              {numero.turnos.map((turno, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.listItemText}>{turno.nombre}</Text>
                  <Text style={styles.listItemSubtext}>
                    {turno.categoria === 'diaria' ? 'La Diaria' : 'La Tica'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {numero.usuarios.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Usuarios que vendieron:</Text>
            <View style={styles.list}>
              {numero.usuarios.map((usuario, idx) => (
                <View key={idx} style={styles.usuarioItem}>
                  <Ionicons name="person" size={16} color={Colors.primary} />
                  <Text style={styles.usuarioItemText}>{usuario.name}</Text>
                </View>
              ))}
            </View>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeVendido: {
    backgroundColor: Colors.success,
  },
  badgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  stats: {
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
  },
  listItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  listItemSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  usuarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
  },
  usuarioItemText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
