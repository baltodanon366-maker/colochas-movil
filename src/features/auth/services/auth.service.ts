import { apiService, ApiResponse } from '../../../services/api.service';
import { API_ENDPOINTS } from '../../../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SignUpData {
  name: string;
  telefono: string;
  username?: string;
}

export interface LoginData {
  telefono: string;
}

export interface User {
  id: string;
  name: string;
  telefono: string;
  roles?: string[];
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface SignUpResponse {
  userId: string;
  name: string;
  telefono: string;
  createdAt: string;
}

class AuthService {
  async signUp(data: SignUpData): Promise<ApiResponse<SignUpResponse>> {
    return apiService.post<SignUpResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
  }

  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);

    if (response.succeeded && response.data) {
      await apiService.setToken(response.data.access_token);
      const userData = JSON.stringify(response.data.user);
      await AsyncStorage.setItem('user_data', userData);
    }

    return response;
  }

  async logout(): Promise<void> {
    await apiService.clearAuth();
    await AsyncStorage.removeItem('user_data');
  }

  async getUserRole(userId: string): Promise<ApiResponse<{ roles: Array<{ id: number; nombre: string; descripcion: string }> }>> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      throw new Error('ID de usuario inválido');
    }
    const { usersService } = await import('../../../services/users.service');
    const response = await usersService.getRoles(userIdNum);
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
