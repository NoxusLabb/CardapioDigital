import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Restaurant,
  Category as CategoryIcon,
  AttachMoney,
  ListAlt,
  TrendingUp,
} from '@mui/icons-material';
import { productsAPI } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { formatCurrency } from '@/utils/formatCurrency';

interface Produto {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  ingredients: string[];
  
  // Para compatibilidade com código existente
  _id?: string;
  nome?: string;
  descricao?: string;
  preco?: number;
  categoria?: string;
  imagemUrl?: string;
  disponivel?: boolean;
  ingredientes?: string[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // O ProtectedRoute já verifica se o usuário é admin, não há necessidade de revalidar aqui
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsAPI.getAll();
      setProdutos(data);
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    // Verificações de segurança para evitar erros
    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return {
        totalProdutos: 0,
        produtosAtivos: 0,
        totalCategorias: 0,
        categorias: [],
        produtosMaisCaros: [],
      };
    }
    
    try {
      const totalProdutos = produtos.length;
      
      // Usar o campo "available" ou "disponivel" conforme disponível
      const produtosAtivos = produtos.filter(p => p && (p.available || p.disponivel)).length;
      
      // Agrupar por categoria (com verificação de segurança)
      const categoriasSet = new Set();
      produtos.forEach(p => {
        // Usar "category" ou "categoria" conforme disponível
        const categoria = p.category || p.categoria;
        if (p && categoria) categoriasSet.add(categoria);
      });
      const categorias = Array.from(categoriasSet) as string[];
      const totalCategorias = categorias.length;
      
      // Produtos mais caros (com verificação de segurança)
      const produtosMaisCaros = [...produtos]
        .filter(p => {
          // Usar "price" ou "preco" conforme disponível
          const preco = p.price !== undefined ? p.price : p.preco;
          return p && typeof preco === 'number';
        })
        .sort((a, b) => {
          // Usar "price" ou "preco" conforme disponível
          const precoA = a.price !== undefined ? a.price : a.preco;
          const precoB = b.price !== undefined ? b.price : b.preco;
          return precoB - precoA;
        })
        .slice(0, 5);
      
      return {
        totalProdutos,
        produtosAtivos,
        totalCategorias,
        categorias,
        produtosMaisCaros,
      };
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
      return {
        totalProdutos: 0,
        produtosAtivos: 0,
        totalCategorias: 0,
        categorias: [],
        produtosMaisCaros: [],
      };
    }
  };

  const navegarParaProdutos = () => {
    navigate('/admin/produtos');
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  const {
    totalProdutos,
    produtosAtivos,
    totalCategorias,
    categorias,
    produtosMaisCaros,
  } = calcularEstatisticas();

  return (
    <AdminLayout title="Dashboard">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard Administrativo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Visão geral do seu cardápio digital
        </Typography>
      </Box>

      {/* Cartões de resumo */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr',
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        },
        gap: 3,
        mb: 4
      }}>
        <Box sx={{ gridColumn: { xs: '1', sm: '1', md: '1' } }}>
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              backgroundColor: '#fff',
              height: '100%'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar
                  sx={{
                    bgcolor: '#FF5A5F',
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  <Restaurant />
                </Avatar>
                <Typography variant="h6" component="div">
                  Produtos
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {totalProdutos}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Chip 
                  label={`${produtosAtivos} ativos`}
                  size="small"
                  color="success"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`${totalProdutos - produtosAtivos} inativos`}
                  size="small"
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridColumn: { xs: '1', sm: '2', md: '2' } }}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              backgroundColor: '#fff',
              height: '100%' 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar
                  sx={{
                    bgcolor: '#00A699',
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  <CategoryIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Categorias
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {totalCategorias}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Organização do cardápio
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2', md: '3 / span 2' } }}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              backgroundColor: '#fff',
              height: '100%' 
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar
                  sx={{
                    bgcolor: '#484848',
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6" component="div">
                  Visão Geral
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-around" mt={2}>
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Produtos Ativos
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {totalProdutos > 0 ? Math.round((produtosAtivos / totalProdutos) * 100) : 0}%
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Preço Médio
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(
                      totalProdutos > 0 ? (produtos.reduce((acc, curr) => {
                        // Usar price ou preco conforme disponível
                        const preco = curr.price !== undefined ? curr.price : curr.preco;
                        return acc + (preco || 0);
                      }, 0) / totalProdutos) : 0
                    )}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Média Ingredientes
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {totalProdutos > 0 ? Math.round(
                      produtos.reduce((acc, curr) => {
                        // Usar ingredients ou ingredientes conforme disponível
                        const ingredientes = curr.ingredients || curr.ingredientes || [];
                        return acc + (ingredientes ? ingredientes.length : 0);
                      }, 0) / totalProdutos
                    ) : 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr',
          md: 'repeat(2, 1fr)',
        },
        gap: 3,
      }}>
        {/* Lista de Categorias */}
        <Box>
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              p: 2,
              height: '100%' 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Categorias de Produtos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1
            }}>
              {categorias.map((categoria) => {
                // Verificar category ou categoria conforme disponível
                const produtosNaCategoria = produtos.filter(p => {
                  const cat = p.category || p.categoria;
                  return cat === categoria;
                }).length;
                return (
                  <Box key={categoria}>
                    <Card variant="outlined" sx={{ mb: 1 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body1" fontWeight="medium">
                          {categoria}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {produtosNaCategoria} {produtosNaCategoria === 1 ? 'produto' : 'produtos'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Box>

        {/* Produtos mais caros */}
        <Box>
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              p: 2,
              height: '100%' 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Produtos mais caros
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {produtosMaisCaros.map((produto) => {
                // Usar os campos na nomenclatura nova ou antiga conforme disponível
                const id = produto.id || produto._id;
                const nome = produto.name || produto.nome || "";
                const imagemUrl = produto.imageUrl || produto.imagemUrl || "";
                const preco = produto.price !== undefined ? produto.price : produto.preco || 0;
                const categoria = produto.category || produto.categoria || "";
                const disponivel = produto.available !== undefined ? produto.available : produto.disponivel || false;
                
                return (
                  <Box key={id || Math.random().toString()}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar 
                          alt={nome}
                          src={imagemUrl}
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={nome}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {formatCurrency(preco)}
                            </Typography>
                            {" — "}{categoria}
                          </>
                        }
                      />
                      <Chip 
                        label={disponivel ? "Disponível" : "Indisponível"} 
                        color={disponivel ? "success" : "error"} 
                        size="small" 
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                );
              })}
            </List>
          </Paper>
        </Box>
      </Box>

      <Box mt={4} textAlign="center">
        <Button 
          variant="contained" 
          size="large"
          onClick={navegarParaProdutos}
          sx={{ 
            backgroundColor: '#FF5A5F',
            '&:hover': {
              backgroundColor: '#E04B50',
            },
            px: 4,
            py: 1
          }}
        >
          Gerenciar Produtos
        </Button>
      </Box>
    </AdminLayout>
  );
}