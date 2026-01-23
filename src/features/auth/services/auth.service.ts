import { apiService, ApiResponse } from '../../../services/api.service';
import { API_ENDPOINTS } from '../../../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos de datos
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ConfirmUserData {
  email: string;
  confirmationCode: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles?: string[];
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface SignUpResponse {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
}

class AuthService {
  async signUp(data: SignUpData): Promise<ApiResponse<SignUpResponse>> {
    return apiService.post<SignUpResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
  }

  // Método eliminado: confirmUser()
  // El endpoint de confirmación fue eliminado del backend

  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Guardar token y datos del usuario
    if (response.succeeded && response.data) {
      await apiService.setToken(response.data.access_token);
      // Guardar datos del usuario en AsyncStorage
      const userData = JSON.stringify(response.data.user);
      await AsyncStorage.setItem('user_data', userData);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    await apiService.clearAuth();
    // Asegurar que también se limpia el usuario
    await AsyncStorage.removeItem('user_data');
  }

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  /**
   * Obtener roles de un usuario
   * @deprecated Usar usersService.getRoles() en su lugar
   */
  async getUserRole(userId: string): Promise<ApiResponse<{ roles: Array<{ id: number; nombre: string; descripcion: string }> }>> {
    // Convertir string a number y usar el endpoint de users
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      throw new Error('ID de usuario inválido');
    }
    // Importar usersService dinámicamente para evitar dependencia circular
    const { usersService } = await import('../../../services/users.service');
    const response = await usersService.getRoles(userIdNum);
    // Adaptar la respuesta al formato esperado
    return {
      ...response,
      data: response.data ? { roles: response.data } : undefined,
    } as ApiResponse<{ roles: Array<{ id: number; nombre: string; descripcion: string }> }>;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await apiService.getToken();
    return !!token;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();

