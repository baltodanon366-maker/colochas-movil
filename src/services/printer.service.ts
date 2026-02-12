import { Venta } from '../types';
import { Alert, Platform, Share } from 'react-native';
import { formatDateString } from '../utils/dateUtils';
import * as IntentLauncher from 'expo-intent-launcher';

/** Package de la app "Thermal Printer" en Android. Si usas otra app, cámbialo aquí. */
const THERMAL_PRINTER_PACKAGE = 'com.imrot.thermal.printer';

/**
 * Configuración para la impresión del boucher
 */
export interface BoucherConfig {
  nombreEmpresa?: string;
  direccion?: string;
  telefono?: string;
  mensajePersonalizado?: string;
}

/**
 * Opciones de impresión disponibles
 */
export interface PrintOptions {
  share: boolean;    // Compartir como texto
  copy: boolean;     // Copiar al portapapeles  
  print: boolean;    // Imprimir (web/nativo)
}

/**
 * Servicio para manejar la impresión usando APIs nativas
 * 
 * Implementación simplificada sin dependencias externas de Bluetooth
 */
class PrinterService {
  private isInitialized: boolean = false;

  /**
   * Inicializar el servicio de impresión
   * Verifica las capacidades del dispositivo
   */
  async initialize(): Promise<void> {
    try {
      this.isInitialized = true;
      console.log('Servicio de impresión nativo inicializado correctamente');
    } catch (error) {
      this.isInitialized = false;
      console.warn('Error al inicializar servicio de impresión:', error);
      throw error;
    }
  }

  /**
   * Verificar si el servicio está disponible
   */
  isAvailable(): boolean {
    return this.isInitialized;
  }

  /**
   * Generar texto del boucher para impresión (resumido para ahorrar material)
   * Solo: nombre, fecha, código, números con monto individual, total.
   */
  private generateBoucherText(venta: Venta, config?: BoucherConfig): string {
    const empresa = config?.nombreEmpresa || 'La Chelita';
    const fecha = formatDateString(venta.fecha || (venta.fechaHora ? venta.fechaHora.split('T')[0] : null) || new Date().toISOString().split('T')[0]);
    const detalles = venta.detallesVenta || venta.detalles || [];
    const total = Number(venta.total).toFixed(2);

    const WIDTH = 48;
    const SEPARATOR = '-'.repeat(WIDTH);

    let boucherText = '';
    boucherText += `${empresa}\n`;
    boucherText += `${SEPARATOR}\n`;
    boucherText += `${fecha}   ${venta.numeroBoucher}\n`;
    boucherText += `${SEPARATOR}\n`;

    for (const detalle of detalles) {
      const numero = detalle.numero.toString().padStart(2, '0');
      const monto = `C$${Number(detalle.monto).toFixed(2)}`;
      boucherText += `${numero}   ${monto}\n`;
    }

    boucherText += `${SEPARATOR}\n`;
    boucherText += `TOTAL   C$${total}\n`;
    boucherText += '\n\n';

    return boucherText;
  }

  /**
   * Compartir boucher usando Share API nativa (mejorado para impresoras térmicas)
   */
  async shareBoucher(venta: Venta, config?: BoucherConfig): Promise<void> {
    try {
      const boucherText = this.generateBoucherText(venta, config);
      
      // En Android, usar Share con opciones mejoradas
      if (Platform.OS === 'android') {
        const result = await Share.share({
          message: boucherText,
          title: `Boucher ${venta.numeroBoucher} - Listo para imprimir`,
        }, {
          dialogTitle: 'Imprimir Boucher',
          subject: `Boucher ${venta.numeroBoucher}`,
        });
        
        // Si el usuario canceló, no hacer nada
        if (result.action === 'dismissedAction' || result.action === 'dismissed') {
          return;
        }
      } else {
        // iOS o Web
        await Share.share({
          message: boucherText,
          title: `Boucher ${venta.numeroBoucher} - Listo para imprimir`,
        });
      }
    } catch (error: any) {
      // Si el usuario canceló el share, no mostrar error
      if (error.message?.includes('cancel') || error.message?.includes('dismiss')) {
        return;
      }
      console.error('Error compartiendo boucher:', error);
      throw new Error('No se pudo compartir el boucher');
    }
  }

  /**
   * Copiar boucher al portapapeles
   */
  async copyBoucher(venta: Venta, config?: BoucherConfig): Promise<void> {
    try {
      const boucherText = this.generateBoucherText(venta, config);
      
      // En web, usar navigator.clipboard si está disponible
      if (Platform.OS === 'web') {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(boucherText);
          Alert.alert('Éxito', 'Boucher copiado al portapapeles');
        } else {
          throw new Error('Clipboard no disponible en este navegador');
        }
      } else {
        // En móvil, usar Clipboard de React Native (requiere instalación)
        Alert.alert('Información', 'Funcionalidad de copiar estará disponible en futuras versiones');
      }
    } catch (error) {
      console.error('Error copiando boucher:', error);
      Alert.alert('Error', 'No se pudo copiar el boucher al portapapeles');
    }
  }

  /**
   * Imprimir boucher usando APIs nativas
   */
  async printBoucher(venta: Venta, config?: BoucherConfig): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // En web, crear un documento HTML e imprimir
        const boucherText = this.generateBoucherText(venta, config);
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Boucher ${venta.numeroBoucher}</title>
                <style>
                  body { 
                    font-family: 'Courier New', monospace; 
                    font-size: 12px; 
                    margin: 20px;
                    white-space: pre-line;
                  }
                </style>
              </head>
              <body>
                ${boucherText}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        } else {
          throw new Error('No se pudo abrir la ventana de impresión');
        }
      } else if (Platform.OS === 'android' && THERMAL_PRINTER_PACKAGE) {
        // Android: abrir directamente la app "Thermal Printer" con el texto del boucher
        const boucherText = this.generateBoucherText(venta, config);
        try {
          await IntentLauncher.startActivityAsync('android.intent.action.SEND', {
            type: 'text/plain',
            packageName: THERMAL_PRINTER_PACKAGE,
            extra: {
              'android.intent.extra.TEXT': boucherText,
            },
          });
          // Al volver de Thermal Printer, la promesa se resuelve (el flujo continúa en BoucherPreviewScreen)
        } catch (err: any) {
          // App no instalada o usuario canceló: usar flujo anterior
          const useFallback = !err?.message?.includes('cancel');
          if (useFallback) {
            Alert.alert(
              'Opciones de Impresión',
              'Thermal Printer no está disponible. Selecciona otra opción:',
              [
                { text: 'Compartir', onPress: () => this.shareBoucher(venta, config) },
                { text: 'Copiar', onPress: () => this.copyBoucher(venta, config) },
                { text: 'Cancelar', style: 'cancel' },
              ]
            );
          }
        }
      } else {
        // iOS u otro: mostrar opciones disponibles
        Alert.alert(
          'Opciones de Impresión',
          'Selecciona una opción para tu boucher:',
          [
            {
              text: 'Compartir',
              onPress: () => this.shareBoucher(venta, config),
            },
            {
              text: 'Copiar',
              onPress: () => this.copyBoucher(venta, config),
            },
            {
              text: 'Cancelar',
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error al imprimir:', error);
      Alert.alert('Error', 'No se pudo imprimir el boucher: ' + (error as Error).message);
    }
  }

  /**
   * Método principal para imprimir (mantiene compatibilidad)
   */
  async print(venta: Venta, config?: BoucherConfig): Promise<void> {
    await this.printBoucher(venta, config);
  }

  /**
   * Mostrar información sobre la impresión disponible
   */
  getAvailableOptions(): PrintOptions {
    return {
      share: true,
      copy: Platform.OS === 'web',
      print: true,
    };
  }

  /**
   * Verificar estado de conexión (para compatibilidad)
   */
  isConnected(): boolean {
    return this.isInitialized;
  }

  /**
   * Método de conexión (para compatibilidad - no hace nada)
   */
  async connect(): Promise<boolean> {
    return this.isInitialized;
  }

  /**
   * Método de desconexión (para compatibilidad - no hace nada)
   */
  async disconnect(): Promise<void> {
    // No hay nada que desconectar
  }

  /**
   * Buscar dispositivos (para compatibilidad - devuelve array vacío)
   */
  async findDevices(): Promise<any[]> {
    return [];
  }
}

export const printerService = new PrinterService();