import { apiService } from '../../../services/api.service';
import { API_ENDPOINTS } from '../../../config/api.config';
import { CierreTurno, CreateCierreTurnoDto, ResumenCierre } from '../../../types';

class CierresService {
  /**
   * Obtener cierre de un turno específico
   * @param turnoId ID del turno
   * @param fecha Fecha del cierre (YYYY-MM-DD)
   */
  async getByTurnoFecha(turnoId: number, fecha: string): Promise<CierreTurno> {
    const response = await apiService.get<CierreTurno>(
      API_ENDPOINTS.CIERRES.BY_TURNO_FECHA(turnoId, fecha)
    );
    if (!response.data) {
      throw new Error('Cierre no encontrado');
    }
    return response.data;
  }

  // Método eliminado: getVentasByTurnoFecha()
  // Usar historialService.getVentas() con filtros turnoId, fechaInicio y fechaFin en su lugar

  async create(data: CreateCierreTurnoDto): Promise<CierreTurno> {
    const response = await apiService.post<CierreTurno>(API_ENDPOINTS.CIERRES.BASE, data);
    if (!response.data) {
      throw new Error(response.message || 'Error al cerrar turno');
    }
    return response.data;
  }
}

export const cierresService = new CierresService();


