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
import { format } from 'date-fns';
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
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaTurno | null>(null);
  const [filtroTurnoId, setFiltroTurnoId] = useState<number | null>(null);
  const [totalMonto, setTotalMonto] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadTurnos();
  }, []);

  useEffect(() => {
    if (filtroTurnoId) {
      loadReporte();
    } else {
      // Si no hay turno seleccionado, limpiar datos
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
    setFiltroTurnoId(null);
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

  // Generar array de números 00-99 si no vienen del backend
  const numerosCompletos = numeros.length > 0 
    ? numeros 
    : Array.from({ length: 100 }, (_, i) => ({
        numero: i,
        totalMonto: 0,
        vendido: false,
      }));

  // Organizar números en 5 columnas (20 filas)
  const numerosPorColumna: ReporteCierreNumero[][] = [];
  for (let i = 0; i < 5; i++) {
    numerosPorColumna[i] = numerosCompletos.filter((_, index) => index % 5 === i);
  }

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

        {/* Información del Turno y Total */}
        {turno && (
          <View style={styles.infoContainer}>
            <View style={styles.turnoInfo}>
              <Text style={styles.turnoLabel}>Turno:</Text>
              <Text style={styles.turnoName}>{turno.nombre}</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                {totalMonto.toFixed(1)}
              </Text>
            </View>
          </View>
        )}

        {loading ? (
          <Loading message="Cargando reporte..." />
        ) : (
          <>
            {filtroTurnoId ? (
              <>
                {/* Grid de Números */}
                <View style={styles.gridContainer}>
                  {numerosPorColumna.map((columna, colIndex) => (
                    <View key={colIndex} style={styles.column}>
                      {columna.map((item) => (
                        <View
                          key={item.numero}
                          style={[
                            styles.numeroCell,
                            item.vendido ? styles.numeroVendido : styles.numeroNoVendido,
                          ]}
                        >
                          <Text
                            style={[
                              styles.numeroText,
                              item.vendido ? styles.numeroTextVendido : styles.numeroTextNoVendido,
                            ]}
                          >
                            {item.numero.toString().padStart(2, '0')}
                          </Text>
                          {item.vendido && (
                            <Text
                              style={styles.montoText}
                            >
                              {item.totalMonto.toFixed(1)}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  ))}
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
  infoContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  turnoInfo: {
    flex: 1,
  },
  turnoLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  turnoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalContainer: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
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
  gridContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  column: {
    flex: 1,
    gap: 6,
  },
  numeroCell: {
    aspectRatio: 1,
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 50,
  },
  numeroVendido: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.danger,
  },
  numeroNoVendido: {
    backgroundColor: Colors.background.card,
    borderColor: Colors.border.medium,
  },
  numeroText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  numeroTextVendido: {
    color: Colors.danger,
  },
  numeroTextNoVendido: {
    color: Colors.text.primary,
  },
  montoText: {
    fontSize: 10,
    color: Colors.text.primary,
    fontWeight: '600',
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
