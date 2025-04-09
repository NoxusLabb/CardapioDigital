import axios from 'axios';

// Interface para produtos
export interface Product {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  ingredientes: string[];
}

// Criar uma instância axios para API
const api = axios.create({
  baseURL: '/api',
});

// Buscar todos os produtos
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/produtos');
    // Filtra apenas produtos disponíveis
    return response.data.filter((product: Product) => product.disponivel);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

// Organizar produtos por categoria
export const organizeProductsByCategory = (products: Product[]): Record<string, Product[]> => {
  const categorized: Record<string, Product[]> = {};

  products.forEach(product => {
    if (!categorized[product.categoria]) {
      categorized[product.categoria] = [];
    }
    categorized[product.categoria].push(product);
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