import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Turno, CategoriaTurno } from '../../../types';

interface FiltrosTurnoProps {
  turnos: Turno[];
  filtroCategoria: CategoriaTurno | null;
  filtroTurnoId: number | null;
  onSelectCategoria: (categoria: CategoriaTurno | null) => void;
  onSelectTurno: (turnoId: number | null) => void;
}

export const FiltrosTurno: React.FC<FiltrosTurnoProps> = ({
  turnos,
  filtroCategoria,
  filtroTurnoId,
  onSelectCategoria,
  onSelectTurno,
}) => {
  const turnosFiltrados = filtroCategoria
    ? turnos.filter((t) => t.categoria === filtroCategoria)
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Filtrar por Turno</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            filtroCategoria === null && styles.filterChipActive,
          ]}
          onPress={() => onSelectCategoria(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              filtroCategoria === null && styles.filterChipTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filtroCategoria === 'diaria' && styles.filterChipActive,
          ]}
          onPress={() => onSelectCategoria('diaria')}
        >
          <Text
            style={[
              styles.filterChipText,
              filtroCategoria === 'diaria' && styles.filterChipTextActive,
            ]}
          >
            La Diaria
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filtroCategoria === 'tica' && styles.filterChipActive,
          ]}
          onPress={() => onSelectCategoria('tica')}
        >
          <Text
            style={[
              styles.filterChipText,
              filtroCategoria === 'tica' && styles.filterChipTextActive,
            ]}
          >
            La Tica
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {filtroCategoria && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.turnosScroll}
          contentContainerStyle={styles.turnosScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.turnoChip,
              filtroTurnoId === null && styles.turnoChipActive,
            ]}
            onPress={() => onSelectTurno(null)}
          >
            <Text
              style={[
                styles.turnoChipText,
                filtroTurnoId === null && styles.turnoChipTextActive,
              ]}
            >
              Todos los Turnos
            </Text>
          </TouchableOpacity>
          {turnosFiltrados.map((turno) => (
            <TouchableOpacity
              key={turno.id}
              style={[
                styles.turnoChip,
                filtroTurnoId === turno.id && styles.turnoChipActive,
              ]}
              onPress={() => onSelectTurno(turno.id)}
            >
              <Text
                style={[
                  styles.turnoChipText,
                  filtroTurnoId === turno.id && styles.turnoChipTextActive,
                ]}
              >
                {turno.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  filtersScroll: {
    maxHeight: 60,
  },
  filtersScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  filterChipTextActive: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  turnosScroll: {
    maxHeight: 60,
    marginTop: 12,
  },
  turnosScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  turnoChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    marginRight: 8,
  },
  turnoChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  turnoChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  turnoChipTextActive: {
    color: Colors.secondary,
    fontWeight: '600',
  },
});

