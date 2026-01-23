import { apiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Venta } from '../types';

export interface HistorialVentasParams {
  fechaInicio?: string;
  fechaFin?: string;
  turnoId?: number;
  usuarioId?: number;
  page?: number;
  limit?: number;
}

export interface HistorialVentasResponse {
  data: Venta[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface AnalisisNumerosParams {
  fechaInicio?: string;
  fechaFin?: string;
  turnoId?: number;
  categoria?: 'diaria' | 'tica';
  usuarioId?: number;
}

export interface EstadisticaNumero {
  numero: number;
  vecesVendido: number;
  totalMonto: number;
  turnosDiferentes: number;
  usuariosDiferentes: number;
  turnos: Array<{ id: number; nombre: string; categoria: string }>;
  usuarios: Array<{ id: number; name: string; email: string }>;
  categorias: string[];
  vendido: boolean;
}

export interface EstadisticasTurno {
  turno: {
    id: number;
    nombre: string;
    categoria: string;
  };
  totalVentas: number;
  totalMonto: number;
  numerosVendidos: number;
  numerosNoVendidos: number;
  numerosVendidosLista: number[];
  numerosNoVendidosLista: number[];
}

export interface AnalisisNumerosResponse {
  numeros: EstadisticaNumero[];
  estadisticasTurno: EstadisticasTurno | null;
  totalNumeros: number;
  numerosVendidos: number;
  numerosNoVendidos: number;
}

export interface ReporteCierreParams {
  fechaInicio?: string;
  fechaFin?: string;
  turnoId?: number;
  usuarioId?: number;
}

export interface ReporteCierreNumero {
  numero: number;
  totalMonto: number;
  vendido: boolean;
}

export interface ReporteCierreResponse {
  data: ReporteCierreNumero[];
  turno: {
    id: number;
    nombre: string;
    categoria: string;
    hora?: string;
    horaCierre?: string;
  } | null;
  fecha: string | null;
  totalMonto: number;
}

class HistorialService {
  async getVentas(params?: HistorialVentasParams): Promise<ApiResponse<HistorialVentasResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (params.turnoId) queryParams.append('turnoId', params.turnoId.toString());
      if (params.usuarioId) queryParams.append('usuarioId', params.usuarioId.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
    }

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.HISTORIAL.VENTAS}?${queryParams.toString()}`
      : API_ENDPOINTS.HISTORIAL.VENTAS;

    return apiService.get<HistorialVentasResponse>(url);
  }

  async getAnalisisNumeros(params?: AnalisisNumerosParams): Promise<ApiResponse<AnalisisNumerosResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (params.turnoId) queryParams.append('turnoId', params.turnoId.toString());
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.usuarioId) queryParams.append('usuarioId', params.usuarioId.toString());
    }

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.HISTORIAL.ANALISIS_NUMEROS}?${queryParams.toString()}`
      : API_ENDPOINTS.HISTORIAL.ANALISIS_NUMEROS;

    return apiService.get<AnalisisNumerosResponse>(url);
  }

  async getReporteCierre(params?: ReporteCierreParams): Promise<ApiResponse<ReporteCierreResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (params.turnoId) queryParams.append('turnoId', params.turnoId.toString());
      if (params.usuarioId) queryParams.append('usuarioId', params.usuarioId.toString());
    }

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.HISTORIAL.REPORTE_CIERRE}?${queryParams.toString()}`
      : API_ENDPOINTS.HISTORIAL.REPORTE_CIERRE;

    return apiService.get<ReporteCierreResponse>(url);
  }
}

export const historialService = new HistorialService();
