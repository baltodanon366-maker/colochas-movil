import { Venta } from '../types';
import { Alert, Platform, Share } from 'react-native';
import { formatDateString, formatTimeString } from '../utils/dateUtils';

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
   * Generar texto del boucher para impresión
   */
  private generateBoucherText(venta: Venta, config?: BoucherConfig): string {
    const empresa = config?.nombreEmpresa || '$ LA CHELITA $';
    const fecha = formatDateString(venta.fecha || (venta.fechaHora ? venta.fechaHora.split('T')[0] : null) || new Date().toISOString().split('T')[0]);
    const hora = formatTimeString(venta.fechaHora || venta.fecha);
    const vendedorNombre = venta.usuario?.name || 'Vendedor';
    const fechaVenta = formatDateString(venta.fecha);
    const detalles = venta.detallesVenta || venta.detalles || [];
    const total = Number(venta.total).toFixed(1);

    let boucherText = '';
    
    // ===== ENCABEZADO =====
    boucherText += `${empresa}\n`;
    boucherText += `Fecha: ${fecha} - ${hora}\n`;
    boucherText += 'REVISE SU BOLETO\n';
    boucherText += 'NO SE ACEPTAN RECLAMOS DESPUES DEL SORTEO\n';
    boucherText += 'SIN BOLETO NO HAY PREMIO\n';
    boucherText += `VENDEDOR: ${vendedorNombre} - ${fechaVenta}\n`;
    boucherText += `Boucher: ${venta.numeroBoucher}\n`;
    boucherText += '================================\n';
    
    // ===== TABLA DE NÚMEROS =====
    boucherText += 'NUMERO          CANTIDAD\n';
    boucherText += '================================\n';
    
    for (const detalle of detalles) {
      const numero = detalle.numero.toString().padStart(2, '0');
      const cantidad = Number(detalle.monto).toFixed(1);
      boucherText += `${numero}              ${cantidad.padStart(8)}\n`;
    }
    
    // ===== TOTAL =====
    boucherText += '================================\n';
    boucherText += `TOTAL: ${total}\n`;
    boucherText += '================================\n';
    
    // ===== PIE DE PÁGINA =====
    if (config?.mensajePersonalizado) {
      boucherText += `${config.mensajePersonalizado}\n`;
    }
    
    if (venta.turno?.mensaje) {
      boucherText += `${venta.turno.mensaje}\n`;
    }
    
    boucherText += '\n¡Gracias por su compra!\n\n';

    return boucherText;
  }

  /**
   * Compartir boucher usando Share API nativa
   */
  async shareBoucher(venta: Venta, config?: BoucherConfig): Promise<void> {
    try {
      const boucherText = this.generateBoucherText(venta, config);
      
      await Share.share({
        message: boucherText,
        title: `Boucher ${venta.numeroBoucher}`,
      });
    } catch (error) {
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
      } else {
        // En móvil, mostrar opciones disponibles
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