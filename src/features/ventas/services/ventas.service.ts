import { apiService } from '../../../services/api.service';
import { API_ENDPOINTS } from '../../../config/api.config';
import { Venta, CreateVentaDto } from '../../../types';

class VentasService {
  // Métodos eliminados: getAll() y getMisVentas()
  // Usar historialService.getVentas() en su lugar para todas las consultas de ventas

  async getById(id: number): Promise<Venta> {
    const response = await apiService.get<Venta>(API_ENDPOINTS.VENTAS.BY_ID(id));
    if (!response.data) {
      throw new Error('Venta no encontrada');
    }
    return response.data;
  }

  async getByBoucher(boucher: string): Promise<Venta> {
    const response = await apiService.get<Venta>(API_ENDPOINTS.VENTAS.BY_BOUCHER(boucher));
    if (!response.data) {
      throw new Error('Venta no encontrada');
    }
    return response.data;
  }

  async create(data: CreateVentaDto): Promise<Venta> {
    const response = await apiService.post<Venta>(API_ENDPOINTS.VENTAS.CREATE, data);
    if (!response.data) {
      throw new Error(response.message || 'Error al crear venta');
    }
    return response.data;
  }
}

export const ventasService = new VentasService();


