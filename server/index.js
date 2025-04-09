import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import produtoRoutes from './routes/produtoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

// Obter o diretório atual quando usado com ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar ao banco de dados
connectDB();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rotas API
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Middleware para lidar com erros
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API está funcionando...');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});