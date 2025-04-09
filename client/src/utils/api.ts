import axios from 'axios';

// Criar uma instância do axios
const api = axios.create({
  baseURL: '/api',
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  // Verifica se estamos no browser antes de tentar acessar localStorage
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const token = JSON.parse(userInfo).token;
        // Garantir que headers existe
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.error('Erro ao processar token:', e);
      }
    }
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
    const response = await api.get('/products');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  update: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default api;