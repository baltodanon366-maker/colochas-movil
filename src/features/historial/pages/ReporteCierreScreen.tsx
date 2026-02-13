import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Loading } from '../../../components/Loading';
import { Colors } from '../../../constants/colors';
import { historialService } from '../../../services/historial.service';
import { turnosService } from '../../../services/turnos.service';
import { Turno, CategoriaTurno } from '../../../types';
import { FiltrosTurno } from '../components/FiltrosTurno';
import { DatePickerModal } from '../components/DatePickerModal';
import { Ionicons } from '@expo/vector-icons';
import { getNicaraguaDate, formatDateString } from '../../../utils/dateUtils';

interface ReporteCierreNumero {
  numero: number;
  totalMonto: number;
  vendido: boolean;
}

interface ReporteCierreScreenProps {
  onBack: () => void;
}

export const ReporteCierreScreen: React.FC<ReporteCierreScreenProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [numeros, setNumeros] = useState<ReporteCierreNumero[]>([]);
  const [turno, setTurno] = useState<{
    id: number;
    nombre: string;
    categoria: string;
    hora?: string;
    horaCierre?: string;
  } | null>(null);
  const [fecha, setFecha] = useState<string>(getNicaraguaDate());
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaTurno | null>('diaria');
  const [filtroTurnoId, setFiltroTurnoId] = useState<number | null>(null);
  const [totalMonto, setTotalMonto] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadTurnos();
  }, []);

  // Al cargar turnos: si hay categoría pero no turno seleccionado, elegir el primero
  useEffect(() => {
    if (turnos.length === 0 || !filtroCategoria || filtroTurnoId !== null) return;
    const turnosDeCategoria = turnos
      .filter((t) => t.categoria === filtroCategoria)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    const primerTurno = turnosDeCategoria[0];
    if (primerTurno) setFiltroTurnoId(primerTurno.id);
  }, [turnos, filtroCategoria, filtroTurnoId]);

  useEffect(() => {
    if (filtroTurnoId) {
      loadReporte();
    } else {
      setNumeros([]);
      setTurno(null);
      setTotalMonto(0);
    }
  }, [filtroTurnoId, fecha]);

  const loadTurnos = async () => {
    try {
      const turnosData = await turnosService.getActivos();
      setTurnos(turnosData);
    } catch (error) {
      console.error('Error loading turnos:', error);
    }
  };

  const loadReporte = async () => {
    if (!filtroTurnoId) return;
    
    setLoading(true);
    try {
      const response = await historialService.getReporteCierre({
        turnoId: filtroTurnoId,
        fechaInicio: fecha,
        fechaFin: fecha,
      });
      
      if (response.succeeded && response.data) {
        setNumeros(response.data.data || []);
        setTurno(response.data.turno);
        setTotalMonto(response.data.totalMonto || 0);
      }
    } catch (error) {
      console.error('Error loading reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroCategoria = (categoria: CategoriaTurno | null) => {
    setFiltroCategoria(categoria);
    if (!categoria) {
      setFiltroTurnoId(null);
      return;
    }
    const turnosDeCategoria = turnos
      .filter((t) => t.categoria === categoria)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    const primerTurno = turnosDeCategoria[0];
    setFiltroTurnoId(primerTurno ? primerTurno.id : null);
  };

  const handleFechaSeleccionada = (fechaSeleccionada: Date) => {
    // Formatear la fecha seleccionada a YYYY-MM-DD en hora local
    const year = fechaSeleccionada.getFullYear();
    const month = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0');
    const day = String(fechaSeleccionada.getDate()).padStart(2, '0');
    const fechaStr = `${year}-${month}-${day}`;
    setFecha(fechaStr);
    setShowDatePicker(false);
  };

  // Array 00-99 para lista compacta
  const numerosCompletos = numeros.length > 0
    ? numeros
    : Array.from({ length: 100 }, (_, i) => ({
        numero: i,
        totalMonto: 0,
        vendido: false,
      }));

  return (
    <View style={styles.container}>
      <SubHeaderBar
        title="Reporte de Cierre"
        onBack={onBack}
        showAddButton={false}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {/* Selector de Turno */}
        <View style={styles.filtersContainer}>
          <FiltrosTurno
            turnos={turnos}
            filtroCategoria={filtroCategoria}
            filtroTurnoId={filtroTurnoId}
            onSelectCategoria={handleFiltroCategoria}
            onSelectTurno={setFiltroTurnoId}
            hideTodosCategoria
            hideTodosTurnos
          />

          {/* Selector de Fecha */}
          <View style={styles.dateSelectorContainer}>
            <Text style={styles.dateLabel}>Fecha:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <Text style={styles.dateText}>
                {formatDateString(fecha)}
              </Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Solo Total (estilo anterior) */}
        {turno && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>C${totalMonto.toFixed(2)}</Text>
          </View>
        )}

        {loading ? (
          <Loading message="Cargando reporte..." />
        ) : (
          <>
            {filtroTurnoId ? (
              <>
                {/* Lista de números: 7 por fila; monto vendido debajo del número */}
                <View style={styles.numerosCompactContainer}>
                  {Array.from({ length: Math.ceil(numerosCompletos.length / 7) }, (_, rowIndex) => {
                    const rowItems = numerosCompletos.slice(rowIndex * 7, rowIndex * 7 + 7);
                    return (
                    <View key={rowIndex} style={styles.numerosRow}>
                      {rowItems.map((item, cellIndex) => {
                        const isLastInRow = cellIndex === rowItems.length - 1;
                        return (
                          <View
                            key={item.numero}
                            style={[
                              styles.numeroCell,
                              item.vendido && styles.numeroCellVendido,
                              isLastInRow && styles.numeroCellLastInRow,
                            ]}
                          >
                            <Text
                              style={[
                                styles.numeroCompactText,
                                item.vendido ? styles.numeroCompactVendido : styles.numeroCompactNoVendido,
                              ]}
                            >
                              {item.numero.toString().padStart(2, '0')}
                            </Text>
                            {item.vendido && (
                              <Text style={styles.numeroMontoText}>
                                {item.totalMonto.toFixed(0)}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                    </View>
                    );
                  })}
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={64} color={Colors.text.tertiary} />
                <Text style={styles.emptyTitle}>Selecciona un turno</Text>
                <Text style={styles.emptyText}>
                  Elige un turno y una fecha para ver el reporte de cierre
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        mode="inicio"
        fechaInicio={fecha}
        fechaFin={fecha}
        onDateSelected={handleFechaSeleccionada}
        onClose={() => setShowDatePicker(false)}
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
  filtersContainer: {
    marginBottom: 16,
  },
  dateSelectorContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    gap: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  totalContainer: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 120,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  numerosCompactContainer: {
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.light,
    borderRadius: 4,
  },
  numerosRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.light,
  },
  numeroCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: Colors.border.light,
  },
  numeroCellVendido: {
    backgroundColor: Colors.dangerLight,
  },
  numeroCellLastInRow: {
    borderRightWidth: 0,
  },
  numeroCompactText: {
    fontSize: 14,
    fontWeight: '600',
  },
  numeroCompactVendido: {
    color: Colors.danger,
  },
  numeroCompactNoVendido: {
    color: Colors.text.primary,
  },
  numeroMontoText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.danger,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
