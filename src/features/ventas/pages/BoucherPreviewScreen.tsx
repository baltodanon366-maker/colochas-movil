import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../../components/AppHeader';
import { SubHeaderBar } from '../../../components/SubHeaderBar';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { Venta } from '../../../types';
import { printerService } from '../../../services/printer.service';
import { formatDateString, formatTimeString } from '../../../utils/dateUtils';

export const BoucherPreviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { venta } = route.params as { venta: Venta } || {};

  const [printing, setPrinting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const navigateToNuevaVenta = () => {
    // Regresar al formulario de nueva venta con los mismos parámetros del turno
    if (venta?.turnoId) {
      navigation.navigate('NuevaVenta', {
        turnoId: venta.turnoId,
        categoria: venta.turno?.categoria || undefined,
      });
    } else {
      // Si no hay turno, ir a la lista de ventas
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Ventas' },
                ],
                index: 0,
              },
            },
          ],
        })
      );
    }
  };

  if (!venta) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SubHeaderBar title="Boucher de Venta" onBack={navigateToNuevaVenta} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró la venta</Text>
        </View>
      </View>
    );
  }

  const handlePrint = async () => {
    setPrinting(true);
    try {
      await printerService.printBoucher(venta, {
        nombreEmpresa: 'La Colocha',
      });
      navigateToNuevaVenta();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo procesar la impresión');
    } finally {
      setPrinting(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      await printerService.shareBoucher(venta, {
        nombreEmpresa: 'La Colocha',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo compartir');
    } finally {
      setSharing(false);
    }
  };

  const handleBack = () => {
    navigateToNuevaVenta();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <SubHeaderBar
        title="Venta Creada Exitosamente"
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* Boucher: $ La Colocha $, fecha, hora, usuario, turno, detalles, total, pie */}
        <View style={styles.boucherPaper}>
          <Text style={styles.empresa}>$ La Colocha $</Text>
          <View style={styles.filaCodigo}>
            <Text style={styles.fecha}>
              {formatDateString(venta.fecha || (venta.fechaHora ? venta.fechaHora.split('T')[0] : null) || new Date().toISOString().split('T')[0])}
            </Text>
            <Text style={styles.codigo}>{venta.numeroBoucher}</Text>
          </View>
          <View style={styles.filaCodigo}>
            <Text style={styles.fecha}>{formatTimeString(venta.fechaHora || venta.createdAt)}</Text>
            <Text style={styles.codigo}>{(venta.usuario as any)?.nombre || venta.usuario?.name || venta.usuario?.username || '—'}</Text>
          </View>
          <Text style={styles.turnoLine}>{venta.turno?.nombre ?? `Turno ${venta.turnoId}`}</Text>
          <View style={styles.separator} />

          {(venta.detallesVenta || venta.detalles) && (venta.detallesVenta || venta.detalles)!.length > 0 ? (
            <>
              {(venta.detallesVenta || venta.detalles)!.map((detalle, index) => (
                <View key={index} style={styles.filaNumero}>
                  <Text style={styles.detalleNumero}>[{detalle.numero.toString().padStart(2, '0')}]</Text>
                  <Text style={styles.detalleMonto}>C${Number(detalle.monto).toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.separator} />
              <View style={styles.filaTotal}>
                <Text style={styles.totalLabel}>TOTAL = C${Number(venta.total).toFixed(2)}</Text>
              </View>
              <View style={styles.separator} />
              <Text style={styles.pie}>Revise su boleto</Text>
              <Text style={styles.pie}>Sin boleto no hay premio</Text>
              <Text style={styles.pie}>No se aceptan reclamos después del sorteo</Text>
            </>
          ) : (
            <Text style={styles.noDetalles}>No hay detalles</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title={printing ? 'Imprimiendo...' : 'Imprimir'}
            onPress={handlePrint}
            loading={printing}
            disabled={printing || sharing}
            icon={
              printing ? (
                <ActivityIndicator size="small" color={Colors.text.inverse} />
              ) : (
                <Ionicons name="print-outline" size={20} color={Colors.text.inverse} />
              )
            }
            style={styles.printButton}
          />
          <Button
            title={sharing ? 'Compartiendo...' : 'Compartir'}
            onPress={handleShare}
            loading={sharing}
            disabled={printing || sharing}
            icon={<Ionicons name="share-outline" size={20} color={Colors.text.inverse} />}
            style={styles.shareButton}
          />
        </View>
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
  boucherPaper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: 20,
    maxWidth: 320,
    alignSelf: 'center',
  },
  empresa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.medium,
    marginVertical: 8,
  },
  filaCodigo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fecha: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  codigo: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  filaNumero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detalleNumero: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  detalleMonto: {
    fontSize: 15,
    color: Colors.text.primary,
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.success,
  },
  turnoLine: {
    fontSize: 13,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  pie: {
    fontSize: 11,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  shareButton: {
    width: '100%',
    marginTop: 10,
  },
  noDetalles: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
    padding: 12,
  },
  actions: {
    marginTop: 20,
    marginBottom: 10,
  },
  printButton: {
    width: '100%',
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
