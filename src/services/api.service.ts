import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONEXION, API_TIMEOUT } from '../config/api.config';

// Método helper para construir query strings
export const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  return queryParams.toString();
};

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  succeeded: boolean;
  title: string;
  message: string;
  data?: T;
  meta?: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface ApiError {
  succeeded: false;
  title: string;
  message: string;
}

const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 2;

function isRetryableNetworkError(error: any): boolean {
  return (
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    error.message === 'Network Error'
  );
}

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;
  private onUnauthorized: (() => void) | null = null;
  private refreshTokenProvider: (() => Promise<{ access_token: string } | null>) | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONEXION,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    this.client.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await AsyncStorage.getItem('auth_token');
        }
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const config = error.config as any;

        // Reintento por timeout o red (útil cuando Render se despierta)
        const retryCount = (config?.__retryCount ?? 0);
        if (isRetryableNetworkError(error) && config && retryCount < MAX_RETRIES) {
          config.__retryCount = retryCount + 1;
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          return this.client.request(config);
        }

        if (error.response?.status === 401) {
          const refreshed = await this.refreshTokenProvider?.().catch(() => null);
          if (refreshed?.access_token) {
            this.token = refreshed.access_token;
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${refreshed.access_token}`;
            return this.client.request(config);
          }
          await this.clearAuth();
          this.onUnauthorized?.();
        }

        return Promise.reject(error);
      }
    );
  }

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorized = callback;
  }

  setRefreshTokenProvider(provider: () => Promise<{ access_token: string } | null>) {
    this.refreshTokenProvider = provider;
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async clearAuth() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
    await AsyncStorage.removeItem('auth_refresh_token');
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.succeeded !== undefined) {
          return errorData as ApiResponse<T>;
        }
        if (errorData.message || errorData.error) {
          return {
            succeeded: false,
            title: 'Error',
            message: errorData.message || errorData.error || 'Error al procesar la solicitud',
          } as ApiResponse<T>;
        }
        if (Array.isArray(errorData.message)) {
          return {
            succeeded: false,
            title: 'Error de validación',
            message: errorData.message.join(', '),
          } as ApiResponse<T>;
        }
      }
      return Promise.reject(error);
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      // Si es un error HTTP con respuesta, convertir a formato ApiResponse
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Si el backend devuelve un formato ApiResponse
        if (errorData.succeeded !== undefined) {
          return errorData as ApiResponse<T>;
        }
        
        // Si el backend devuelve un error en formato NestJS (message o error)
        if (errorData.message || errorData.error) {
          return {
            succeeded: false,
            title: 'Error',
            message: errorData.message || errorData.error || 'Error al procesar la solicitud',
          } as ApiResponse<T>;
        }
        
        // Si es un array de mensajes (validación)
        if (Array.isArray(errorData.message)) {
          return {
            succeeded: false,
            title: 'Error de validación',
            message: errorData.message.join(', '),
          } as ApiResponse<T>;
        }
      }
      
      // Si es un error de red u otro tipo, rechazar la promesa
      return Promise.reject(error);
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.succeeded !== undefined) {
          return errorData as ApiResponse<T>;
        }
        if (errorData.message || errorData.error) {
          return {
            succeeded: false,
            title: 'Error',
            message: errorData.message || errorData.error || 'Error al procesar la solicitud',
          } as ApiResponse<T>;
        }
        if (Array.isArray(errorData.message)) {
          return {
            succeeded: false,
            title: 'Error de validación',
            message: errorData.message.join(', '),
          } as ApiResponse<T>;
        }
      }
      return Promise.reject(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.succeeded !== undefined) {
          return errorData as ApiResponse<T>;
        }
        if (errorData.message || errorData.error) {
          return {
            succeeded: false,
            title: 'Error',
            message: errorData.message || errorData.error || 'Error al procesar la solicitud',
          } as ApiResponse<T>;
        }
        if (Array.isArray(errorData.message)) {
          return {
            succeeded: false,
            title: 'Error de validación',
            message: errorData.message.join(', '),
          } as ApiResponse<T>;
        }
      }
      return Promise.reject(error);
    }
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.succeeded !== undefined) {
          return errorData as ApiResponse<T>;
        }
        if (errorData.message || errorData.error) {
          return {
            succeeded: false,
            title: 'Error',
            message: errorData.message || errorData.error || 'Error al procesar la solicitud',
          } as ApiResponse<T>;
        }
        if (Array.isArray(errorData.message)) {
          return {
            succeeded: false,
            title: 'Error de validación',
            message: errorData.message.join(', '),
          } as ApiResponse<T>;
        }
      }
      return Promise.reject(error);
    }
  }
}

export const apiService = new ApiService();

