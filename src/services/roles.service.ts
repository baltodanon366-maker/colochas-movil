import { apiService, ApiResponse } from './api.service';
import { API_CONEXION } from '../config/api.config';

export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo';
  createdAt?: string;
  updatedAt?: string;
}

import { API_ENDPOINTS } from '../config/api.config';

class RolesService {
  /**
   * Obtener todos los roles activos
   */
  async getAll(): Promise<ApiResponse<Role[]>> {
    return apiService.get<Role[]>(API_ENDPOINTS.ROLES.BASE);
  }

  /**
   * Obtener un rol por ID
   */
  async getById(id: number): Promise<ApiResponse<Role>> {
    return apiService.get<Role>(API_ENDPOINTS.ROLES.BY_ID(id));
  }

  /**
   * Obtener permisos de un rol
   */
  async getPermisos(roleId: number): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(API_ENDPOINTS.ROLES.PERMISOS(roleId));
  }
}

export const rolesService = new RolesService();

