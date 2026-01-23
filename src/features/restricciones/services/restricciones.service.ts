import { apiService } from '../../../services/api.service';
import { API_ENDPOINTS } from '../../../config/api.config';
import {
  RestriccionNumero,
  CreateRestriccionDto,
  CreateMultipleRestriccionesDto,
  VerificarRestriccionResponse,
  VerificarMultiplesResponse,
} from '../../../types';

class RestriccionesService {
  async getAll(turnoId?: number, fecha?: string): Promise<RestriccionNumero[]> {
    const params = new URLSearchParams();
    if (turnoId) params.append('turnoId', turnoId.toString());
    if (fecha) params.append('fecha', fecha);
    
    const url = params.toString() 
      ? `${API_ENDPOINTS.RESTRICCIONES.BASE}?${params.toString()}`
      : API_ENDPOINTS.RESTRICCIONES.BASE;
    
    const response = await apiService.get<RestriccionNumero[]>(url);
    return response.data || [];
  }

  async getById(id: number): Promise<RestriccionNumero> {
    const response = await apiService.get<RestriccionNumero>(API_ENDPOINTS.RESTRICCIONES.BY_ID(id));
    if (!response.data) {
      throw new Error('Restricción no encontrada');
    }
    return response.data;
  }

  async create(data: CreateRestriccionDto): Promise<RestriccionNumero> {
    const response = await apiService.post<RestriccionNumero>(
      API_ENDPOINTS.RESTRICCIONES.BASE,
      data
    );
    if (!response.data) {
      throw new Error(response.message || 'Error al crear restricción');
    }
    return response.data;
  }

  async createMultiple(data: CreateMultipleRestriccionesDto): Promise<any> {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.RESTRICCIONES.MULTIPLE,
        data
      );
      
      if (!response.succeeded) {
        throw new Error(response.message || 'Error al crear restricciones');
      }
      
      // El interceptor envuelve la respuesta, así que los datos están en response.data
      // response.data contiene el objeto con message, restricciones, etc.
      return response.data || response;
    } catch (error: any) {
      console.error('Error en createMultiple:', error);
      throw error;
    }
  }

  async verificar(turnoId: number, numero: number, fecha: string): Promise<VerificarRestriccionResponse> {
    const params = new URLSearchParams({
      turnoId: turnoId.toString(),
      numero: numero.toString(),
      fecha,
    });
    
    const response = await apiService.get<VerificarRestriccionResponse>(
      `${API_ENDPOINTS.RESTRICCIONES.VERIFICAR}?${params.toString()}`
    );
    return response.data || {
      estaRestringido: false,
      numero,
      turnoId,
      fecha,
      mensaje: '',
    };
  }

  async verificarMultiples(
    turnoId: number,
    numeros: number[],
    fecha: string
  ): Promise<VerificarMultiplesResponse> {
    const params = new URLSearchParams({
      turnoId: turnoId.toString(),
      numeros: numeros.join(','),
      fecha,
    });
    
    const response = await apiService.get<VerificarMultiplesResponse>(
      `${API_ENDPOINTS.RESTRICCIONES.VERIFICAR_MULTIPLE}?${params.toString()}`
    );
    return response.data || {
      resultados: [],
      total: 0,
      restringidos: 0,
      disponibles: 0,
      numerosRestringidos: [],
      numerosDisponibles: [],
    };
  }

  async delete(id: number): Promise<void> {
    const response = await apiService.delete(API_ENDPOINTS.RESTRICCIONES.BY_ID(id));
    if (!response.succeeded) {
      throw new Error(response.message || 'Error al eliminar restricción');
    }
  }

  async deleteByNumero(turnoId: number, numero: number, fecha: string): Promise<void> {
    const params = new URLSearchParams({ fecha });
    const response = await apiService.delete(
      `${API_ENDPOINTS.RESTRICCIONES.BY_NUMERO(turnoId, numero)}?${params.toString()}`
    );
    if (!response.succeeded) {
      throw new Error(response.message || 'Error al eliminar restricción');
    }
  }

  async deleteMultiple(turnoId: number, numeros: number[], fecha: string): Promise<any> {
    const params = new URLSearchParams({
      turnoId: turnoId.toString(),
      numeros: numeros.join(','),
      fecha,
    });
    
    const response = await apiService.delete(
      `${API_ENDPOINTS.RESTRICCIONES.DELETE_MULTIPLE}?${params.toString()}`
    );
    if (!response.succeeded) {
      throw new Error(response.message || 'Error al eliminar restricciones');
    }
    return response.data;
  }
}

export const restriccionesService = new RestriccionesService();


