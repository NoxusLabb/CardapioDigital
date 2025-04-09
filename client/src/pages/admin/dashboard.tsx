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
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '@/utils/formatCurrency';

interface Produto {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  ingredientes: string[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    fetchData();
  }, [user, navigate]);

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
    const totalProdutos = produtos.length;
    const produtosAtivos = produtos.filter(p => p.disponivel).length;
    
    // Agrupar por categoria
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    const totalCategorias = categorias.length;
    
    // Produtos mais caros
    const produtosMaisCaros = [...produtos]
      .sort((a, b) => b.preco - a.preco)
      .slice(0, 5);
    
    return {
      totalProdutos,
      produtosAtivos,
      totalCategorias,
      categorias,
      produtosMaisCaros,
    };
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
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
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
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
        </Grid>

        <Grid item xs={12} md={6}>
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
                    {Math.round((produtosAtivos / totalProdutos) * 100)}%
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Preço Médio
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(
                      produtos.reduce((acc, curr) => acc + curr.preco, 0) / totalProdutos
                    )}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Média Ingredientes
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {Math.round(
                      produtos.reduce((acc, curr) => acc + curr.ingredientes.length, 0) / totalProdutos
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Lista de Categorias */}
        <Grid item xs={12} md={6}>
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
            
            <Grid container spacing={1}>
              {categorias.map((categoria) => {
                const produtosNaCategoria = produtos.filter(p => p.categoria === categoria).length;
                return (
                  <Grid item xs={6} key={categoria}>
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
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        {/* Produtos mais caros */}
        <Grid item xs={12} md={6}>
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
              {produtosMaisCaros.map((produto) => (
                <React.Fragment key={produto._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar 
                        alt={produto.nome} 
                        src={produto.imagemUrl}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={produto.nome}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {formatCurrency(produto.preco)}
                          </Typography>
                          {" — "}{produto.categoria}
                        </React.Fragment>
                      }
                    />
                    <Chip 
                      label={produto.disponivel ? "Disponível" : "Indisponível"} 
                      color={produto.disponivel ? "success" : "error"} 
                      size="small" 
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

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