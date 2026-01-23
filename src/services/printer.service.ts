import { Venta } from '../types';
import { Alert, Platform } from 'react-native';
import { formatDateString, formatTimeString } from '../utils/dateUtils';

// Importación condicional para evitar errores en web
let BluetoothEscposPrinter: any = null;
if (Platform.OS !== 'web') {
  try {
    BluetoothEscposPrinter = require('react-native-bluetooth-escpos-printer').default;
  } catch (error) {
    console.warn('Bluetooth printer library not available:', error);
  }
}

/**
 * Interfaz para dispositivos Bluetooth
 */
export interface BluetoothDevice {
  address: string;
  name: string;
  id?: string;
}

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
 * Servicio para manejar la impresión térmica Bluetooth
 * 
 * Implementado con react-native-bluetooth-escpos-printer
 */
class PrinterService {
  private connectedDevice: BluetoothDevice | null = null;
  private isBluetoothAvailable: boolean = false;

  /**
   * Inicializar el servicio de impresión
   * Verifica si Bluetooth está disponible
   */
  async initialize(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        this.isBluetoothAvailable = false;
        return;
      }
      
      if (!BluetoothEscposPrinter) {
        this.isBluetoothAvailable = false;
        return;
      }

      if (Platform.OS === 'android') {
        this.isBluetoothAvailable = await BluetoothEscposPrinter.isBluetoothEnabled();
      } else {
        // iOS maneja Bluetooth automáticamente
        this.isBluetoothAvailable = true;
      }
    } catch (error) {
      console.error('Error inicializando servicio de impresión:', error);
      this.isBluetoothAvailable = false;
    }
  }

  /**
   * Buscar dispositivos Bluetooth disponibles
   * 
   * NOTA: Requiere implementación con la librería de Bluetooth elegida
   */
  async findDevices(): Promise<BluetoothDevice[]> {
    try {
      if (Platform.OS === 'web' || !BluetoothEscposPrinter) {
        throw new Error('Bluetooth no disponible en esta plataforma');
      }

      const devices = await BluetoothEscposPrinter.list();
      return devices.map((device: { address: string; name?: string }) => ({
        address: device.address,
        name: device.name || 'Dispositivo desconocido',
        id: device.address,
      }));
    } catch (error) {
      console.error('Error buscando dispositivos:', error);
      throw new Error('No se pudieron encontrar dispositivos Bluetooth');
    }
  }

  /**
   * Conectar a una impresora específica
   * 
   * NOTA: Requiere implementación con la librería de Bluetooth elegida
   */
  async connect(deviceAddress: string): Promise<boolean> {
    try {
      if (Platform.OS === 'web' || !BluetoothEscposPrinter) {
        throw new Error('Bluetooth no disponible en esta plataforma');
      }

      await BluetoothEscposPrinter.connect(deviceAddress);
      const deviceInfo = await BluetoothEscposPrinter.getDevice();
      this.connectedDevice = {
        address: deviceAddress,
        name: deviceInfo?.name || 'Impresora',
        id: deviceAddress,
      };
      return true;
    } catch (error) {
      console.error('Error conectando:', error);
      throw new Error('No se pudo conectar a la impresora');
    }
  }

  /**
   * Desconectar de la impresora
   */
  async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice && BluetoothEscposPrinter && Platform.OS !== 'web') {
        await BluetoothEscposPrinter.disconnect();
      }
      this.connectedDevice = null;
    } catch (error) {
      console.error('Error desconectando:', error);
    }
  }

  /**
   * Verificar si hay una impresora conectada
   */
  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  /**
   * Obtener información del dispositivo conectado
   */
  getConnectedDevice(): BluetoothDevice | null {
    return this.connectedDevice;
  }

  /**
   * Imprimir boucher de venta
   * Formato basado en el boucher de ejemplo: "$ LA CHELITA $"
   */
  async printBoucher(venta: Venta, config?: BoucherConfig): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('No hay impresora conectada. Por favor, conecta una impresora primero.');
    }

    if (Platform.OS === 'web' || !BluetoothEscposPrinter) {
      throw new Error('La impresión Bluetooth no está disponible en esta plataforma');
    }

    try {
      const empresa = config?.nombreEmpresa || '$ LA CHELITA $';
      const fecha = formatDateString(venta.fecha || (venta.fechaHora ? venta.fechaHora.split('T')[0] : null) || new Date().toISOString().split('T')[0]);
      const hora = formatTimeString(venta.fechaHora || venta.fecha);
      const vendedorNombre = venta.usuario?.name || 'Vendedor';
      const fechaVenta = formatDateString(venta.fecha);
      const detalles = venta.detallesVenta || venta.detalles || [];
      const total = Number(venta.total).toFixed(1);

      // ===== ENCABEZADO =====
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      
      // Nombre de la empresa (negrita, tamaño grande)
      await BluetoothEscposPrinter.printText(`${empresa}\n`, {
        encoding: 'UTF8',
        widthtimes: 2,
        heigthtimes: 2,
        fonttype: 1,
      });
      
      // Fecha y hora
      await BluetoothEscposPrinter.printText(`Fecha: ${fecha}-${hora}\n`, {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      // Mensajes informativos
      await BluetoothEscposPrinter.printText('REVISE SU BOLETO\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      await BluetoothEscposPrinter.printText('NO SE ACEPTAN RECLAMO DESPUES D\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      await BluetoothEscposPrinter.printText('EL SORTEO SIN BOLETO NO HAY PREM\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      // Vendedor
      await BluetoothEscposPrinter.printText(`VDOR ${vendedorNombre}-${fechaVenta}\n`, {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      // Número de boucher
      await BluetoothEscposPrinter.printText(`${venta.numeroBoucher}\n`, {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      // Línea separadora
      await BluetoothEscposPrinter.printText('================================\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      // ===== TABLA DE NÚMEROS =====
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
      
      // Encabezado de tabla
      await BluetoothEscposPrinter.printColumn(
        [20, 12],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['NUMERO', 'CANTIDAD'],
        { encoding: 'UTF8', widthtimes: 1, heigthtimes: 1 }
      );
      
      await BluetoothEscposPrinter.printText('================================\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      // Detalles de números
      for (const detalle of detalles) {
        const numero = detalle.numero.toString().padStart(2, '0');
        const cantidad = Number(detalle.monto).toFixed(1);
        
        await BluetoothEscposPrinter.printColumn(
          [20, 12],
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          [numero, cantidad],
          { encoding: 'UTF8', widthtimes: 1, heigthtimes: 1 }
        );
      }
      
      // ===== TOTAL =====
      await BluetoothEscposPrinter.printText('================================\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
      
      await BluetoothEscposPrinter.printText('TOTAL\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      await BluetoothEscposPrinter.printText(`${total}\n`, {
        encoding: 'UTF8',
        widthtimes: 2,
        heigthtimes: 2,
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText(`(${total})\n`, {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      // ===== PIE DE PÁGINA =====
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      
      if (config?.mensajePersonalizado) {
        await BluetoothEscposPrinter.printText(`${config.mensajePersonalizado}\n`, {
          encoding: 'UTF8',
          widthtimes: 1,
          heigthtimes: 1,
        });
      }
      
      if (venta.turno?.mensaje) {
        await BluetoothEscposPrinter.printText(`${venta.turno.mensaje}\n`, {
          encoding: 'UTF8',
          widthtimes: 1,
          heigthtimes: 1,
        });
      }
      
      // Espacios finales y corte
      await BluetoothEscposPrinter.printText('\n\n\n', {
        encoding: 'UTF8',
        widthtimes: 1,
        heigthtimes: 1,
      });
      
      await BluetoothEscposPrinter.cutPaper();

    } catch (error) {
      console.error('Error al imprimir:', error);
      throw new Error('Error al imprimir el boucher: ' + (error as Error).message);
    }
  }

}

export const printerService = new PrinterService();
