import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/Usuario.js';
import Produto from './models/Produto.js';
import connectDB from './config/db.js';

dotenv.config();

// Conectar ao MongoDB
connectDB();

// Dados iniciais para usuários
const usuarios = [
  {
    nome: 'Admin User',
    email: 'admin@exemplo.com',
    senha: '123456',
    isAdmin: true,
  },
  {
    nome: 'João Silva',
    email: 'joao@exemplo.com',
    senha: '123456',
  },
  {
    nome: 'Maria Souza',
    email: 'maria@exemplo.com',
    senha: '123456',
  },
];

// Dados iniciais para produtos
const produtos = [
  {
    nome: 'X-Burger',
    descricao: 'Hambúrguer com queijo, alface, tomate e molho especial',
    preco: 18.90,
    categoria: 'Sanduíches',
    imagemUrl: 'https://via.placeholder.com/300',
    disponivel: true,
    ingredientes: ['Pão', 'Hambúrguer', 'Queijo', 'Alface', 'Tomate', 'Molho especial'],
  },
  {
    nome: 'Batata Frita',
    descricao: 'Porção de batatas fritas crocantes',
    preco: 12.90,
    categoria: 'Acompanhamentos',
    imagemUrl: 'https://via.placeholder.com/300',
    disponivel: true,
    ingredientes: ['Batata', 'Sal'],
  },
  {
    nome: 'Refrigerante',
    descricao: 'Lata 350ml',
    preco: 6.00,
    categoria: 'Bebidas',
    imagemUrl: 'https://via.placeholder.com/300',
    disponivel: true,
    ingredientes: [],
  },
  {
    nome: 'Sorvete',
    descricao: 'Sundae de chocolate com cobertura e amendoim',
    preco: 8.90,
    categoria: 'Sobremesas',
    imagemUrl: 'https://via.placeholder.com/300',
    disponivel: true,
    ingredientes: ['Sorvete de baunilha', 'Calda de chocolate', 'Amendoim'],
  },
  {
    nome: 'Salada Caesar',
    descricao: 'Alface, croutons, queijo parmesão e molho Caesar',
    preco: 19.90,
    categoria: 'Saladas',
    imagemUrl: 'https://via.placeholder.com/300',
    disponivel: true,
    ingredientes: ['Alface', 'Croutons', 'Queijo parmesão', 'Molho Caesar'],
  },
];

// Importar dados
const importData = async () => {
  try {
    // Limpar o banco de dados
    await Usuario.deleteMany();
    await Produto.deleteMany();

    // Inserir usuários
    const createdUsers = await Usuario.insertMany(usuarios);
    const adminUser = createdUsers[0]._id;

    // Inserir produtos
    await Produto.insertMany(produtos);

    console.log('Dados importados com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// Destruir dados
const destroyData = async () => {
  try {
    // Limpar o banco de dados
    await Usuario.deleteMany();
    await Produto.deleteMany();

    console.log('Dados destruídos com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// Decidir qual função executar com base nos argumentos
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}