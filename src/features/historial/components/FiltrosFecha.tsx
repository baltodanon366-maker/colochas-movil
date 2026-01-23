import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../../constants/colors';
import { format } from 'date-fns';
import { formatDateString } from '../../../utils/dateUtils';

export type FiltroFecha = 'todos' | 'ultimo-dia' | 'ultima-semana' | 'ultimos-15-dias' | 'ultimo-mes' | 'personalizado';

interface FiltrosFechaProps {
  filtroFecha: FiltroFecha;
  fechaInicio: string | null;
  fechaFin: string | null;
  onSelectFiltro: (filtro: FiltroFecha) => void;
}

export const FiltrosFecha: React.FC<FiltrosFechaProps> = ({
  filtroFecha,
  fechaInicio,
  fechaFin,
  onSelectFiltro,
}) => {
  const filtros: Array<{ value: FiltroFecha; label: string }> = [
    { value: 'todos', label: 'Todos' },
    { value: 'ultimo-dia', label: 'Último Día' },
    { value: 'ultima-semana', label: 'Última Semana' },
    { value: 'ultimos-15-dias', label: 'Últimos 15 Días' },
    { value: 'ultimo-mes', label: 'Último Mes' },
    { value: 'personalizado', label: 'Personalizado' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Filtrar por Fecha</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersScrollContent}
      >
        {filtros.map((filtro) => (
          <TouchableOpacity
            key={filtro.value}
            style={[
              styles.filterChip,
              filtroFecha === filtro.value && styles.filterChipActive,
            ]}
            onPress={() => onSelectFiltro(filtro.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                filtroFecha === filtro.value && styles.filterChipTextActive,
              ]}
            >
              {filtro.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {filtroFecha === 'personalizado' && (fechaInicio || fechaFin) && (
        <View style={styles.fechasPersonalizadas}>
          <Text style={styles.fechasText}>
            {fechaInicio && `Desde: ${formatDateString(fechaInicio)}`}
            {fechaInicio && fechaFin && ' - '}
            {fechaFin && `Hasta: ${formatDateString(fechaFin)}`}
          </Text>
        </View>
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
  fechasPersonalizadas: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  fechasText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

