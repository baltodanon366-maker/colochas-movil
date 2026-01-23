import { apiService } from '../../../services/api.service';
import { API_ENDPOINTS } from '../../../config/api.config';
import { KPIVentasHoy, KPIVentasMes, TopNumero } from '../../../types';

class KPIsService {
  async getVentasHoy(): Promise<KPIVentasHoy> {
    const response = await apiService.get<KPIVentasHoy>(API_ENDPOINTS.KPIS.VENTAS_HOY);
    return response.data || {
      totalVentas: 0,
      totalMonto: 0,
      ventasPorTurno: [],
    };
  }

  // Métodos eliminados: getVentasMes() y getTopNumeros()
  // Estos endpoints no existen en el backend actual
  // Para implementación futura cuando estén disponibles
}

export const kpisService = new KPIsService();


