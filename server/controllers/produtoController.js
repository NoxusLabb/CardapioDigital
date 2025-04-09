import Produto from '../models/Produto.js';
import { validationResult } from 'express-validator';

// @desc    Buscar todos os produtos
// @route   GET /api/produtos
// @access  Público
const getProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find({});
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
};

// @desc    Buscar um produto pelo ID
// @route   GET /api/produtos/:id
// @access  Público
const getProdutoById = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Produto não encontrado' });
    } else {
      res.status(500).json({ message: 'Erro ao buscar produto' });
    }
  }
};

// @desc    Criar um novo produto
// @route   POST /api/produtos
// @access  Privado/Admin
const createProduto = async (req, res) => {
  // Verificar erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nome, descricao, preco, categoria, imagemUrl, disponivel, ingredientes } = req.body;

    const produto = new Produto({
      nome,
      descricao,
      preco,
      categoria,
      imagemUrl,
      disponivel,
      ingredientes
    });

    const produtoCriado = await produto.save();
    res.status(201).json(produtoCriado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
};

// @desc    Atualizar um produto
// @route   PUT /api/produtos/:id
// @access  Privado/Admin
const updateProduto = async (req, res) => {
  // Verificar erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nome, descricao, preco, categoria, imagemUrl, disponivel, ingredientes } = req.body;

    const produto = await Produto.findById(req.params.id);

    if (produto) {
      produto.nome = nome || produto.nome;
      produto.descricao = descricao || produto.descricao;
      produto.preco = preco || produto.preco;
      produto.categoria = categoria || produto.categoria;
      produto.imagemUrl = imagemUrl || produto.imagemUrl;
      produto.disponivel = disponivel !== undefined ? disponivel : produto.disponivel;
      produto.ingredientes = ingredientes || produto.ingredientes;

      const produtoAtualizado = await produto.save();
      res.json(produtoAtualizado);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Produto não encontrado' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
  }
};

// @desc    Excluir um produto
// @route   DELETE /api/produtos/:id
// @access  Privado/Admin
const deleteProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (produto) {
      await Produto.deleteOne({ _id: req.params.id });
      res.json({ message: 'Produto removido' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Produto não encontrado' });
    } else {
      res.status(500).json({ message: 'Erro ao excluir produto' });
    }
  }
};

export { getProdutos, getProdutoById, createProduto, updateProduto, deleteProduto };