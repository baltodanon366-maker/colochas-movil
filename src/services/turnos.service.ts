import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Turno, CreateTurnoDto, UpdateTurnoDto } from '../types';

class TurnosService {
  async getAll(): Promise<Turno[]> {
    const response = await apiService.get<Turno[]>(API_ENDPOINTS.TURNOS.BASE);
    return response.data || [];
  }

  async getById(id: number): Promise<Turno> {
    const response = await apiService.get<Turno>(API_ENDPOINTS.TURNOS.BY_ID(id));
    if (!response.data) {
      throw new Error('Turno no encontrado');
    }
    return response.data;
  }

  async getActivos(categoria?: 'diaria' | 'tica'): Promise<Turno[]> {
    // El backend devuelve todos los turnos activos en GET /turnos
    // Puede filtrar por categoría si se proporciona
    const url = categoria 
      ? `${API_ENDPOINTS.TURNOS.BASE}?categoria=${categoria}`
      : API_ENDPOINTS.TURNOS.BASE;
    const response = await apiService.get<Turno[]>(url);
    const turnos = response.data || [];
    // Filtrar solo activos si el backend no lo hace automáticamente
    return turnos.filter(t => t.estado === 'activo');
  }

  async create(data: CreateTurnoDto): Promise<Turno> {
    const response = await apiService.post<Turno>(API_ENDPOINTS.TURNOS.BASE, data);
    if (!response.data) {
      throw new Error(response.message || 'Error al crear turno');
    }
    return response.data;
  }

  async update(id: number, data: UpdateTurnoDto): Promise<Turno> {
    const response = await apiService.patch<Turno>(API_ENDPOINTS.TURNOS.BY_ID(id), data);
    if (!response.data) {
      throw new Error(response.message || 'Error al actualizar turno');
    }
    return response.data;
  }

  async delete(id: number): Promise<void> {
    const response = await apiService.delete(API_ENDPOINTS.TURNOS.BY_ID(id));
    if (!response.succeeded) {
      throw new Error(response.message || 'Error al eliminar turno');
    }
  }
}

export const turnosService = new TurnosService();


