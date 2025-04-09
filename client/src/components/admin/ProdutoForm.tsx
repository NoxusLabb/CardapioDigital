import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Ingrediente {
  id: number;
  nome: string;
}

interface Produto {
  _id?: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  ingredientes: string[];
}

interface ProdutoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (produto: Produto) => void;
  produto?: Produto | null;
  categorias: string[];
}

const defaultProduto: Produto = {
  nome: '',
  descricao: '',
  preco: 0,
  categoria: '',
  imagemUrl: '',
  disponivel: true,
  ingredientes: [],
};

export default function ProdutoForm({
  open,
  onClose,
  onSubmit,
  produto,
  categorias,
}: ProdutoFormProps) {
  const [formData, setFormData] = useState<Produto>(defaultProduto);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [novoIngrediente, setNovoIngrediente] = useState('');

  useEffect(() => {
    if (produto) {
      setFormData(produto);
    } else {
      setFormData(defaultProduto);
    }
  }, [produto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpar erro do campo alterado
    if (erros[name]) {
      setErros({
        ...erros,
        [name]: '',
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      disponivel: e.target.checked,
    });
  };

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      categoria: e.target.value,
    });
    
    // Limpar erro do campo categoria
    if (erros.categoria) {
      setErros({
        ...erros,
        categoria: '',
      });
    }
  };

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({
      ...formData,
      preco: isNaN(value) ? 0 : value,
    });
    
    // Limpar erro do campo preco
    if (erros.preco) {
      setErros({
        ...erros,
        preco: '',
      });
    }
  };

  const handleIngredienteChange = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && novoIngrediente.trim() !== '') {
      e.preventDefault();
      
      if (!formData.ingredientes.includes(novoIngrediente.trim())) {
        setFormData({
          ...formData,
          ingredientes: [...formData.ingredientes, novoIngrediente.trim()],
        });
      }
      
      setNovoIngrediente('');
    }
  };

  const handleIngredienteDelete = (ingredienteToDelete: string) => {
    setFormData({
      ...formData,
      ingredientes: formData.ingredientes.filter(
        (ingrediente) => ingrediente !== ingredienteToDelete
      ),
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      errors.descricao = 'Descrição é obrigatória';
    }
    
    if (formData.preco <= 0) {
      errors.preco = 'Preço deve ser maior que zero';
    }
    
    if (!formData.categoria) {
      errors.categoria = 'Categoria é obrigatória';
    }
    
    if (!formData.imagemUrl.trim()) {
      errors.imagemUrl = 'URL da imagem é obrigatória';
    } else {
      try {
        new URL(formData.imagemUrl);
      } catch (e) {
        errors.imagemUrl = 'URL da imagem é inválida';
      }
    }
    
    setErros(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {produto && produto._id ? 'Editar Produto' : 'Novo Produto'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={!!erros.nome}
                helperText={erros.nome}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!erros.categoria}>
                <InputLabel id="categoria-label">Categoria</InputLabel>
                <Select
                  labelId="categoria-label"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleSelectChange}
                  label="Categoria"
                  required
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {erros.categoria && (
                  <Typography variant="caption" color="error">
                    {erros.categoria}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                error={!!erros.descricao}
                helperText={erros.descricao}
                required
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço"
                name="preco"
                type="number"
                value={formData.preco}
                onChange={handlePrecoChange}
                error={!!erros.preco}
                helperText={erros.preco}
                required
                inputProps={{ min: "0", step: "0.01" }}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL da Imagem"
                name="imagemUrl"
                value={formData.imagemUrl}
                onChange={handleChange}
                error={!!erros.imagemUrl}
                helperText={erros.imagemUrl}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box mb={1}>
                <Typography variant="subtitle1">Ingredientes:</Typography>
              </Box>
              <TextField
                fullWidth
                label="Adicionar ingrediente (pressione Enter)"
                value={novoIngrediente}
                onChange={(e) => setNovoIngrediente(e.target.value)}
                onKeyDown={handleIngredienteChange}
                margin="normal"
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {formData.ingredientes.map((ingrediente) => (
                  <Chip
                    key={ingrediente}
                    label={ingrediente}
                    onDelete={() => handleIngredienteDelete(ingrediente)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.disponivel}
                    onChange={handleSwitchChange}
                    name="disponivel"
                    color="primary"
                  />
                }
                label="Disponível"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          sx={{ 
            backgroundColor: '#FF5A5F',
            '&:hover': {
              backgroundColor: '#E04B50',
            },
          }}
        >
          {produto && produto._id ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}