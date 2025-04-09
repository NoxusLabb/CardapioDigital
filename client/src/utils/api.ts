import axios, { AxiosRequestConfig } from 'axios';

// Criar uma instância do axios
const api = axios.create({
  baseURL: '/api',
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Interface para login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface para registro
export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
}

// Funções de autenticação
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/usuarios/login', credentials);
    return response.data;
  },
  register: async (userData: RegisterCredentials) => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },
  getUserProfile: async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },
};

// Funções de produtos
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },
  create: async (productData: any) => {
    const response = await api.post('/produtos', productData);
    return response.data;
  },
  update: async (id: string, productData: any) => {
    const response = await api.put(`/produtos/${id}`, productData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  },
};

export default api;