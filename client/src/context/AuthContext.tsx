import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, LoginCredentials, RegisterCredentials } from '../utils/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  _id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.login(credentials);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${data.nome}!`,
      });
      
      // Após login bem-sucedido, redirecionar para o dashboard se for admin
      if (data.isAdmin) {
        window.location.href = '/admin/dashboard';
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      toast({
        title: 'Erro de autenticação',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.register(userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast({
        title: 'Registro realizado com sucesso',
        description: `Bem-vindo, ${data.nome}!`,
      });
      
      // Após registro bem-sucedido, redirecionar para o dashboard se for admin
      if (data.isAdmin) {
        window.location.href = '/admin/dashboard';
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao registrar';
      setError(errorMessage);
      toast({
        title: 'Erro de registro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da sua conta',
    });
    
    // Após logout, redirecionar para a página de login
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};