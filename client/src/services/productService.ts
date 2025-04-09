import axios from 'axios';
import { Product } from '@shared/schema';

// Criar uma instância axios para API
const api = axios.create({
  baseURL: '/api',
});

// Buscar todos os produtos
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    // Filtra apenas produtos disponíveis
    return response.data.filter((product: Product) => product.available);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

// Organizar produtos por categoria
export const organizeProductsByCategory = (products: Product[]): Record<number, Product[]> => {
  const categorized: Record<number, Product[]> = {};

  products.forEach(product => {
    if (!categorized[product.categoryId]) {
      categorized[product.categoryId] = [];
    }
    categorized[product.categoryId].push(product);
  });

  return categorized;
};

// Função para formatar preço em reais
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};