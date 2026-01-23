import React, { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { authService, User } from '../features/auth/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, username?: string) => Promise<void>;
  // confirmUser eliminado - El endpoint fue eliminado del backend
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
    checkAuthStatus();
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

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
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

  const signUp = async (email: string, password: string, name: string, username?: string) => {
    try {
      const response = await authService.signUp({ email, password, name, username });
      if (!response.succeeded) {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Error al registrar usuario');
    }
  };

  // Método eliminado: confirmUser
  // El endpoint de confirmación fue eliminado del backend

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await authService.resetPassword({ email });
      if (!response.succeeded) {
        throw new Error(response.message || 'Error al solicitar restablecimiento');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Error al solicitar restablecimiento');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signUp,
    logout,
    resetPassword,
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
