import { apiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

// Tipos de datos
export interface User {
  id: number;
  name: string;
  email: string;
  estado: 'activo' | 'inactivo';
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  roles?: Array<{
    id: number;
    nombre: string;
    descripcion?: string;
  }>;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleIds?: number[];
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  estado?: 'activo' | 'inactivo';
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserWithPagination {
  data: User[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// Helper para construir query string
function buildQueryString(params: {
  page?: number;
  limit?: number;
  offset?: number;
  filterField?: 'email' | 'name';
  filterRule?: 'eq' | 'like' | 'nlike';
  filterValue?: string;
  sortField?: 'email' | 'name' | 'createdAt';
  sortBy?: 'email' | 'name' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}): string {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());
  if (params.filterField) queryParams.append('filterField', params.filterField);
  if (params.filterRule) queryParams.append('filterRule', params.filterRule);
  if (params.filterValue) queryParams.append('filterValue', params.filterValue);
  if (params.sortField) queryParams.append('sortField', params.sortField);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  return queryParams.toString();
}

class UsersService {
  /**
   * Obtener todos los usuarios (con paginación y filtros)
   * Usa el endpoint de auth que tiene más funcionalidades
   */
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    offset?: number;
    filterField?: 'email' | 'name';
    filterRule?: 'eq' | 'like' | 'nlike';
    filterValue?: string;
    sortField?: 'email' | 'name' | 'createdAt';
    sortBy?: 'email' | 'name' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<ApiResponse<UserWithPagination>> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString 
      ? `${API_ENDPOINTS.AUTH.GET_ALL_USERS}?${queryString}`
      : API_ENDPOINTS.AUTH.GET_ALL_USERS;

    return apiService.get<UserWithPagination>(url);
  }

  /**
   * Obtener un usuario por ID
   */
  async getById(id: number): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
  }

  /**
   * Crear un nuevo usuario (solo admin)
   */
  async create(data: CreateUserDto): Promise<ApiResponse<{ message: string; usuario_id: number }>> {
    return apiService.post<{ message: string; usuario_id: number }>(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
  }

  /**
   * Actualizar un usuario (solo admin)
   */
  async update(id: number, data: UpdateUserDto): Promise<ApiResponse<User>> {
    return apiService.patch<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
  }

  /**
   * Actualizar contraseña del usuario
   */
  async updatePassword(id: number, data: UpdatePasswordDto): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(
      API_ENDPOINTS.USERS.UPDATE_PASSWORD(id),
      data
    );
  }

  /**
   * Activar un usuario (solo admin)
   */
  async activate(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(API_ENDPOINTS.USERS.ACTIVATE(id));
  }

  /**
   * Desactivar un usuario (solo admin)
   */
  async deactivate(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(API_ENDPOINTS.USERS.DEACTIVATE(id));
  }

  /**
   * Obtener roles de un usuario
   */
  async getRoles(id: number): Promise<ApiResponse<Array<{ id: number; nombre: string; descripcion?: string }>>> {
    return apiService.get<Array<{ id: number; nombre: string; descripcion?: string }>>(
      API_ENDPOINTS.USERS.GET_ROLES(id)
    );
  }

  /**
   * Asignar un rol a un usuario (solo admin)
   */
  async assignRole(userId: number, roleId: number): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(
      API_ENDPOINTS.USERS.ASSIGN_ROLE(userId, roleId)
    );
  }

  /**
   * Remover un rol de un usuario (solo admin)
   */
  async removeRole(userId: number, roleId: number): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(
      API_ENDPOINTS.USERS.REMOVE_ROLE(userId, roleId)
    );
  }
}

export const usersService = new UsersService();

