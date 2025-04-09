import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid as MuiGrid,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '@/hooks/use-auth';
import { Lock, Email, Person } from '@mui/icons-material';

export default function AdminLogin() {
  const [formState, setFormState] = useState('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [, setLocation] = useLocation();
  const { user, isLoading, error, loginMutation, registerMutation } = useAuth();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user && user.isAdmin) {
      setLocation('/admin/dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState === 'login') {
      loginMutation.mutate({ 
        username: email, 
        password: senha 
      });
    } else {
      registerMutation.mutate({ 
        username: email, 
        password: senha,
        isAdmin: true 
      });
    }
  };

  const toggleForm = () => {
    setFormState(formState === 'login' ? 'register' : 'login');
    // Limpar campos ao alternar formulários
    setEmail('');
    setSenha('');
    setNome('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 2,
            backgroundColor: 'white'
          }}
        >
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#FF5A5F' }}>
            {formState === 'login' ? 'Login Administrativo' : 'Criar Conta Admin'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || "Erro ao realizar operação"}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            {formState === 'register' && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="nome"
                  label="Nome"
                  name="nome"
                  autoComplete="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
            )}
            
            <Box sx={{ mb: 2 }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                required
                fullWidth
                name="senha"
                label="Senha"
                type="password"
                id="senha"
                autoComplete={formState === 'login' ? 'current-password' : 'new-password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.5,
                backgroundColor: '#FF5A5F',
                '&:hover': {
                  backgroundColor: '#E04B50',
                },
                fontWeight: 'bold'
              }}
              disabled={isLoading || loginMutation.isPending || registerMutation.isPending}
            >
              {isLoading || loginMutation.isPending || registerMutation.isPending ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                formState === 'login' ? 'Entrar' : 'Cadastrar'
              )}
            </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link 
                component="button" 
                type="button"
                variant="body2" 
                onClick={toggleForm}
                sx={{ color: '#00A699', textDecoration: 'none' }}
              >
                {formState === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}