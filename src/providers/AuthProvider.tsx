import React, { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { authService, User } from '../features/auth/services/auth.service';
import { apiService } from '../services/api.service';
import { API_ROOT_URL } from '../config/api.config';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (telefono: string) => Promise<void>;
  signUp: (name: string, telefono: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Ping a la raíz de la API para despertarla si está dormida (Render)
    fetch(API_ROOT_URL, { method: 'GET' }).catch(() => {});
    checkAuthStatus();
  }, []);

  useEffect(() => {
    apiService.setOnUnauthorized(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
    apiService.setRefreshTokenProvider(() => authService.refreshToken());
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await authService.isAuthenticated();
      const currentUser = await authService.getCurrentUser();

      if (token && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        if (token || currentUser) {
          await authService.logout();
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.warn('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (telefono: string) => {
    try {
      const response = await authService.login({ telefono });
      if (response.succeeded && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Error al iniciar sesión');
    }
  };

  const signUp = async (name: string, telefono: string, username?: string) => {
    try {
      const response = await authService.signUp({ name, telefono, username });
      if (!response.succeeded) {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Error al registrar usuario');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
