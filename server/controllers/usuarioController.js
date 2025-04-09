import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'cardapio_jwt_secret', {
    expiresIn: '30d',
  });
};

// @desc    Autenticar usuário e obter token
// @route   POST /api/usuarios/login
// @access  Público
const authUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email });

    if (usuario && (await usuario.matchPassword(senha))) {
      res.json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin,
        token: generateToken(usuario._id),
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Registrar um novo usuário
// @route   POST /api/usuarios
// @access  Público
const registerUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nome, email, senha } = req.body;

    // Verificar se o usuário já existe
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      res.status(400).json({ message: 'Usuário já existe' });
      return;
    }

    // Criar o usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
    });

    if (usuario) {
      res.status(201).json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin,
        token: generateToken(usuario._id),
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Obter perfil do usuário
// @route   GET /api/usuarios/perfil
// @access  Privado
const getUsuarioPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user._id);

    if (usuario) {
      res.json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export { authUsuario, registerUsuario, getUsuarioPerfil };