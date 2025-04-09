import express from 'express';
import { check } from 'express-validator';
import {
  authUsuario,
  registerUsuario,
  getUsuarioPerfil,
} from '../controllers/usuarioController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Validações para registro de usuário
const registroValidations = [
  check('nome', 'Nome é obrigatório').not().isEmpty(),
  check('email', 'Inclua um email válido').isEmail(),
  check('senha', 'Senha deve ter pelo menos 6 caracteres').isLength({ min: 6 }),
];

// Validações para login
const loginValidations = [
  check('email', 'Inclua um email válido').isEmail(),
  check('senha', 'Senha é obrigatória').exists(),
];

// Rota de autenticação (login)
router.post('/login', loginValidations, authUsuario);

// Rota de registro
router.post('/', registroValidations, registerUsuario);

// Rota de perfil (protegida)
router.route('/perfil').get(protect, getUsuarioPerfil);

export default router;