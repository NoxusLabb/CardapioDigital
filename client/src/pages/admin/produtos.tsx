import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { productsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ProdutosTable from '../../components/admin/ProdutosTable';
import ProdutoForm from '../../components/admin/ProdutoForm';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatCurrency } from '@/utils/formatCurrency';
import { useLocation } from 'wouter';

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

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    fetchProdutos();
  }, [user, navigate]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsAPI.getAll();
      setProdutos(data);
      
      // Extrair categorias únicas
      const uniqueCategories = [...new Set(data.map((produto: Produto) => produto.categoria))];
      setCategorias(uniqueCategories);
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
      if (produto._id) {
        // Atualizar existente
        await productsAPI.update(produto._id, produto);
        toast({
          title: 'Produto atualizado',
          description: `O produto ${produto.nome} foi atualizado com sucesso!`,
        });
      } else {
        // Criar novo
        await productsAPI.create(produto);
        toast({
          title: 'Produto criado',
          description: `O produto ${produto.nome} foi criado com sucesso!`,
        });
      }
      
      // Recarregar produtos
      fetchProdutos();
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
      // Recarregar produtos
      fetchProdutos();
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
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Produtos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNew}
            sx={{ 
              backgroundColor: '#FF5A5F',
              '&:hover': {
                backgroundColor: '#E04B50',
              },
            }}
          >
            Novo Produto
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && produtos.length === 0 ? (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        ) : (
          <ProdutosTable
            produtos={produtos}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </Box>

      {/* Formulário de criação/edição */}
      <ProdutoForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
        produto={editingProduto}
        categorias={categorias}
      />

      {/* Dialog de visualização de produto */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="view-dialog-title"
      >
        {viewingProduto && (
          <>
            <DialogTitle id="view-dialog-title">
              Detalhes do Produto
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Card elevation={0}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={viewingProduto.imagemUrl}
                      alt={viewingProduto.nome}
                      sx={{ objectFit: 'cover', borderRadius: 1 }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Imagem+não+encontrada';
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {viewingProduto.nome}
                  </Typography>
                  
                  <Box mb={2}>
                    <Chip 
                      label={viewingProduto.categoria} 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={viewingProduto.disponivel ? "Disponível" : "Indisponível"} 
                      color={viewingProduto.disponivel ? "success" : "error"} 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                    {formatCurrency(viewingProduto.preco)}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {viewingProduto.descricao}
                  </Typography>
                  
                  {viewingProduto.ingredientes.length > 0 && (
                    <>
                      <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                        Ingredientes:
                      </Typography>
                      <List dense>
                        {viewingProduto.ingredientes.map((ingrediente, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText primary={ingrediente} />
                            </ListItem>
                            {index < viewingProduto.ingredientes.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleViewClose} color="primary">
                Fechar
              </Button>
              <Button 
                onClick={() => {
                  handleViewClose();
                  handleEdit(viewingProduto);
                }} 
                color="primary"
                variant="contained"
                sx={{ 
                  backgroundColor: '#FF5A5F',
                  '&:hover': {
                    backgroundColor: '#E04B50',
                  },
                }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </AdminLayout>
  );
}