import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { productsAPI } from '../../utils/api';
import { useAuth } from '@/hooks/use-auth';
import ProdutosTable from '../../components/admin/ProdutosTable';
import ProdutoForm from '../../components/admin/ProdutoForm';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatCurrency } from '@/utils/formatCurrency';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from '@shared/schema';

interface Produto {
  _id?: string;
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  ingredientes: string[];
  // Novos campos
  estoqueQuantidade?: number;
  estoqueMinimo?: number;
  precoCusto?: number;
  peso?: number;
  destaque?: boolean;
  descontoPercentual?: number;
  tags?: string[];

  // Campos da API
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  imageUrl?: string;
  available?: boolean;
  ingredients?: string[];
}

// Função auxiliar para mapear produtos da API para formato UI
function mapApiToUiProduct(produto: any): Produto {
  // Se já estiver no formato UI, retornar diretamente
  if ('nome' in produto) {
    return produto;
  }
  
  return {
    _id: produto._id,
    id: produto.id,
    nome: produto.name,
    descricao: produto.description,
    preco: produto.price,
    categoria: produto.category || `Categoria ${produto.categoryId || 1}`,
    imagemUrl: produto.imageUrl,
    disponivel: produto.available,
    ingredientes: produto.ingredients || [],
    destaque: produto.featured || false,
    descontoPercentual: produto.discountPercentage || 0,
    estoqueQuantidade: produto.stockQuantity || 0,
    estoqueMinimo: produto.minStockQuantity || 0,
    precoCusto: produto.costPrice || 0,
    peso: produto.weight || 0,
    tags: produto.tags || [],
  };
}

// Função para mapear produto UI para formato API
function mapUiToApiProduct(produto: Produto): any {
  return {
    id: produto.id,
    name: produto.nome,
    description: produto.descricao,
    price: produto.preco,
    categoryId: typeof produto.categoria === 'string' ? 
      parseInt(produto.categoria.replace(/\D/g, '')) || 1 : 
      1,
    imageUrl: produto.imagemUrl,
    available: produto.disponivel,
    ingredients: produto.ingredientes || [],
    featured: produto.destaque || false,
    discountPercentage: produto.descontoPercentual || 0,
    stockQuantity: produto.estoqueQuantidade || 0,
    minStockQuantity: produto.estoqueMinimo || 0,
    costPrice: produto.precoCusto || 0,
    weight: produto.peso || 0,
    tags: produto.tags || [],
  };
}

export default function ProdutosPage() {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingProduto, setViewingProduto] = useState<Produto | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [location, navigate] = useLocation();

  // Adicionar QueryClient para melhor gerenciamento de cache
  const queryClient = useQueryClient();

  // Usar React Query para gerenciar o estado dos produtos
  const { 
    data: produtosData, 
    isLoading: isLoadingProdutos,
    error: produtosError,
    refetch: refetchProdutos
  } = useQuery({
    queryKey: ['/api/products'],
    queryFn: productsAPI.getAll,
    staleTime: 1000 * 60, // 1 minuto
  });

  // Atualizar o estado local quando os dados do React Query mudarem
  useEffect(() => {
    if (produtosData) {
      setProdutos(produtosData);
      
      // Extrair categorias
      const categoriasSet = new Set<string>();
      produtosData.forEach((produto: any) => {
        try {
          if (produto) {
            const categoria = produto.category || `Categoria ${produto.categoryId || 1}`;
            categoriasSet.add(categoria);
          }
        } catch (e) {
          console.error('Erro ao processar categoria do produto:', produto, e);
        }
      });
      
      const categoriasArray = Array.from(categoriasSet);
      setCategorias(categoriasArray);
    }
    
    setLoading(isLoadingProdutos);
    
    if (produtosError) {
      const errorMessage = (produtosError as any)?.response?.data?.message || 'Erro ao carregar produtos';
      setError(errorMessage);
      
      toast({
        title: 'Erro ao carregar produtos',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [produtosData, isLoadingProdutos, produtosError]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando produtos...');
      const data = await productsAPI.getAll();
      console.log('Dados recebidos da API:', data);
      
      if (!data || data.length === 0) {
        console.warn('Nenhum produto recebido da API');
        setProdutos([]);
        setCategorias([]);
        return;
      }
      
      // Verificar se os dados são válidos
      if (!Array.isArray(data)) {
        console.error('Dados recebidos da API não são um array:', data);
        toast({
          title: 'Erro ao carregar produtos',
          description: 'Formato de dados inválido recebido da API',
          variant: 'destructive',
        });
        return;
      }
      
      // Mapear produtos da API diretamente (sem transformação prévia)
      setProdutos(data);
      
      // Extrair categorias únicas
      const categoriasSet = new Set<string>();
      data.forEach((produto: any) => {
        try {
          if (produto) {
            const categoria = produto.category || `Categoria ${produto.categoryId || 1}`;
            categoriasSet.add(categoria);
          }
        } catch (e) {
          console.error('Erro ao processar categoria do produto:', produto, e);
        }
      });
      
      const categoriasArray = Array.from(categoriasSet);
      console.log('Categorias extraídas:', categoriasArray);
      setCategorias(categoriasArray);
    } catch (err: any) {
      console.error('Erro ao buscar produtos:', err);
      setError(err.response?.data?.message || 'Erro ao carregar produtos');
      toast({
        title: 'Erro ao carregar produtos',
        description: err.response?.data?.message || 'Ocorreu um erro ao buscar os produtos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingProduto(null);
    setFormOpen(true);
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormOpen(true);
  };

  const handleView = (produto: Produto) => {
    setViewingProduto(produto);
    setViewDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingProduto(null);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setViewingProduto(null);
  };

  const handleSubmit = async (produto: Produto) => {
    try {
      setLoading(true);
      
      // Converter o produto para o formato da API
      const produtoApi = mapUiToApiProduct(produto);
      
      if (produto._id || produto.id) {
        // Atualizar existente
        const id = produto._id || String(produto.id);
        await productsAPI.update(id, produtoApi);
        toast({
          title: 'Produto atualizado',
          description: `O produto ${produto.nome} foi atualizado com sucesso!`,
        });
      } else {
        // Criar novo
        await productsAPI.create(produtoApi);
        toast({
          title: 'Produto criado',
          description: `O produto ${produto.nome} foi criado com sucesso!`,
        });
      }
      
      // Invalidar e recarregar dados com React Query
      queryClient.invalidateQueries({queryKey: ['/api/products']});
      setFormOpen(false);
    } catch (err: any) {
      console.error('Erro ao salvar produto:', err);
      toast({
        title: 'Erro ao salvar produto',
        description: err.response?.data?.message || 'Ocorreu um erro ao salvar o produto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await productsAPI.delete(id);
      toast({
        title: 'Produto excluído',
        description: 'O produto foi excluído com sucesso!',
      });
      // Invalidar e recarregar dados com React Query
      queryClient.invalidateQueries({queryKey: ['/api/products']});
    } catch (err: any) {
      console.error('Erro ao excluir produto:', err);
      toast({
        title: 'Erro ao excluir produto',
        description: err.response?.data?.message || 'Ocorreu um erro ao excluir o produto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Gestão de Produtos">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => refetchProdutos()} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
              </svg>
              Atualizar
            </Button>
            <Button 
              onClick={handleCreateNew}
              className="bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && produtos.length === 0 ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ProdutosTable
            produtos={produtos}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </div>

      {/* Formulário de criação/edição */}
      <ProdutoForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
        produto={editingProduto}
        categorias={categorias}
      />

      {/* Dialog de visualização de produto */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {viewingProduto && (
          <>
            <DialogHeader>
              <DialogTitle>Detalhes do Produto</DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre o produto selecionado.
              </DialogDescription>
            </DialogHeader>
            
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={viewingProduto.imagemUrl} 
                    alt={viewingProduto.nome} 
                    className="w-full rounded-lg object-cover aspect-square"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Imagem+não+encontrada';
                    }}
                  />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{viewingProduto.nome}</h2>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary">{viewingProduto.categoria}</Badge>
                    <Badge variant={viewingProduto.disponivel ? "default" : "destructive"} className={viewingProduto.disponivel ? "bg-green-500" : ""}>
                      {viewingProduto.disponivel ? 'Disponível' : 'Indisponível'}
                    </Badge>
                    {viewingProduto.destaque && <Badge variant="secondary">Destaque</Badge>}
                  </div>
                  
                  <div>
                    <span className="text-xl font-bold text-primary">{formatCurrency(viewingProduto.preco)}</span>
                    {viewingProduto.descontoPercentual && viewingProduto.descontoPercentual > 0 && (
                      <Badge variant="outline" className="ml-2">-{viewingProduto.descontoPercentual}%</Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">{viewingProduto.descricao}</p>
                  
                  {viewingProduto.ingredientes && viewingProduto.ingredientes.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Ingredientes:</h3>
                      <ul className="space-y-1">
                        {viewingProduto.ingredientes.map((ingrediente, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-xs mr-2">•</span>
                            {ingrediente}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {viewingProduto.tags && viewingProduto.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Tags:</h3>
                      <div className="flex flex-wrap gap-1">
                        {viewingProduto.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="px-2 py-0.5">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Estoque:</span>
                      <span className="ml-2 font-medium">{viewingProduto.estoqueQuantidade || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mínimo:</span>
                      <span className="ml-2 font-medium">{viewingProduto.estoqueMinimo || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Custo:</span>
                      <span className="ml-2 font-medium">{formatCurrency(viewingProduto.precoCusto || 0)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peso:</span>
                      <span className="ml-2 font-medium">{viewingProduto.peso || 0}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            
            <DialogFooter className="flex justify-between items-center">
              <div>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir o produto "${viewingProduto.nome}"?`)) {
                      const id = viewingProduto._id || String(viewingProduto.id);
                      handleDelete(id);
                      handleViewClose();
                    }
                  }}
                >
                  Excluir
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleViewClose}>
                  Fechar
                </Button>
                <Button 
                  onClick={() => {
                    handleViewClose();
                    handleEdit(viewingProduto);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Editar
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </AdminLayout>
  );
}