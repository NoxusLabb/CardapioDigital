import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Middleware para verificar o token JWT e proteger rotas
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obter token do header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cardapio_jwt_secret');

      // Obter usuário pelo ID no token, excluindo a senha
      req.user = await Usuario.findById(decoded.id).select('-senha');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, token não encontrado' });
  }
};

// Middleware para verificar permissões de administrador
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Não autorizado como administrador' });
  }
};

export { protect, admin };