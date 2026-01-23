// Tipos globales de la aplicación

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  roles?: string[];
  estado?: 'activo' | 'inactivo';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Turnos
export type CategoriaTurno = 'diaria' | 'tica';

export interface Turno {
  id: number;
  nombre: string;
  categoria: CategoriaTurno;
  hora?: string; // Hora de inicio (ej: "18:00")
  horaCierre?: string; // Hora de cierre (ej: "20:00")
  descripcion?: string;
  mensaje?: string; // Mensaje para mostrar en boucher
  estado: 'activo' | 'inactivo';
  tiempoAlerta?: number; // minutos antes del cierre
  tiempoBloqueo?: number; // minutos antes del cierre para bloquear ventas
  createdAt: string;
  updatedAt: string;
}

export interface CreateTurnoDto {
  nombre: string;
  categoria?: CategoriaTurno;
  hora?: string;
  horaCierre?: string;
  descripcion?: string;
  mensaje?: string;
  tiempoAlerta?: number;
  tiempoBloqueo?: number;
}

export interface UpdateTurnoDto {
  nombre?: string;
  categoria?: CategoriaTurno;
  hora?: string;
  horaCierre?: string;
  descripcion?: string;
  mensaje?: string;
  estado?: 'activo' | 'inactivo';
  tiempoAlerta?: number;
  tiempoBloqueo?: number;
}

// Ventas
export interface DetalleVenta {
  numero: number;
  monto: number;
}

export interface Venta {
  id: number;
  numeroBoucher: string;
  turnoId: number;
  turno?: Turno;
  fecha: string;
  fechaHora?: string; // Fecha y hora exacta de la venta
  usuarioId: number;
  usuario?: User;
  total: number;
  observaciones?: string;
  detalles?: DetalleVenta[]; // Para compatibilidad con el frontend
  detallesVenta?: DetalleVenta[]; // Nombre usado por el backend
  createdAt: string;
  updatedAt: string;
}

export interface CreateVentaDto {
  turnoId: number;
  fecha: string;
  detalles: DetalleVenta[];
  observaciones?: string;
}

// Restricciones
export type TipoRestriccion = 'completo' | 'monto' | 'cantidad';

export interface RestriccionNumero {
  id: number;
  turnoId: number;
  turno?: Turno;
  numero: number;
  fecha: string;
  estaRestringido: boolean;
  tipoRestriccion?: TipoRestriccion;
  limiteMonto?: number;
  limiteCantidad?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestriccionDto {
  turnoId: number;
  numero: number;
  fecha: string;
  tipoRestriccion?: TipoRestriccion;
  limiteMonto?: number;
  limiteCantidad?: number;
}

export interface NumeroRestringidoDto {
  numero: number;
}

export interface NumeroRestriccionDto {
  numero: number;
  tipoRestriccion?: TipoRestriccion;
  limiteMonto?: number;
  limiteCantidad?: number;
}

export interface CreateMultipleRestriccionesDto {
  turnoId: number;
  fecha: string;
  numeros?: number[]; // Array de números simples (modo simple)
  numerosConRestricciones?: NumeroRestriccionDto[]; // Array de objetos con restricciones (modo avanzado)
  tipoRestriccion?: TipoRestriccion; // Tipo global para modo simple
  limiteMonto?: number; // Límite global para modo simple
  limiteCantidad?: number; // Límite global para modo simple
}

export interface VerificarRestriccionResponse {
  estaRestringido: boolean;
  numero: number;
  turnoId: number;
  turnoNombre?: string;
  fecha: string;
  mensaje: string;
}

export interface VerificarMultiplesResponse {
  resultados: Array<{
    numero: number;
    estaRestringido: boolean;
  }>;
  total: number;
  restringidos: number;
  disponibles: number;
  numerosRestringidos: number[];
  numerosDisponibles: number[];
}

// Cierres de Turno
export interface CierreTurno {
  id: number;
  turnoId: number;
  turno?: Turno;
  fecha: string;
  cerradoPor: number;
  cerradoPorUsuario?: User;
  totalVentas?: number;
  totalMonto?: number;
  observaciones?: string;
  createdAt: string;
}

export interface CreateCierreTurnoDto {
  turnoId: number;
  fecha: string;
  observaciones?: string;
}

export interface ResumenCierre {
  turnoId: number;
  turnoNombre: string;
  fecha: string;
  totalVentas: number;
  totalMonto: number;
  restriccionesReiniciadas?: number;
}

// Alertas
export interface Alerta {
  id: number;
  turnoId: number;
  turno?: Turno;
  tipo: 'cierre_turno' | 'restriccion' | 'venta_limite';
  estado: 'pendiente' | 'activa' | 'resuelta';
  mensaje: string;
  fecha: string;
  createdAt: string;
}

// KPIs
export interface KPIVentasHoy {
  totalVentas: number;
  totalMonto: number;
  ventasPorTurno: Array<{
    turnoId: number;
    turnoNombre: string;
    cantidad: number;
    monto: number;
  }>;
}

export interface KPIVentasMes {
  totalVentas: number;
  totalMonto: number;
  promedioDiario: number;
  diaConMasVentas: {
    fecha: string;
    cantidad: number;
    monto: number;
  };
}

export interface TopNumero {
  numero: number;
  cantidadVentas: number;
  totalMonto: number;
}

// Historial
export interface HistorialVenta extends Venta {
  detalles: Array<{
    id: number;
    numero: number;
    monto: number;
  }>;
}

export interface HistorialCierre extends CierreTurno {
  ventas: Venta[];
}
