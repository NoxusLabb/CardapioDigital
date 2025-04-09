import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Lock, Email, Person } from '@mui/icons-material';

export default function LoginPage() {
  const [formState, setFormState] = useState('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [, setLocation] = useLocation();
  const { user, loading, error, login, register } = useAuth();
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user && user.isAdmin) {
      setLocation('/admin/dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState === 'login') {
      await login({ email, password: senha });
    } else {
      await register({ nome, email, senha });
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
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            {formState === 'register' && (
              <Grid item xs={12} sx={{ mb: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="nome"
                  label="Nome Completo"
                  name="nome"
                  autoComplete="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sx={{ mb: 2 }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mb: 3 }}>
              <TextField
                required
                fullWidth
                name="senha"
                label="Senha"
                type="password"
                id="senha"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
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
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                formState === 'login' ? 'Entrar' : 'Cadastrar'
              )}
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <MuiLink 
                  component="button" 
                  variant="body2" 
                  onClick={toggleForm}
                  sx={{ 
                    color: '#00A699',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {formState === 'login'
                    ? "Não tem uma conta? Cadastre-se"
                    : "Já tem uma conta? Faça login"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}