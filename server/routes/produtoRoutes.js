import express from 'express';
import { check } from 'express-validator';
import {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
} from '../controllers/produtoController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Validações para produtos
const produtoValidations = [
  check('nome', 'Nome é obrigatório').not().isEmpty(),
  check('descricao', 'Descrição é obrigatória').not().isEmpty(),
  check('preco', 'Preço deve ser um número positivo').isFloat({ min: 0 }),
  check('categoria', 'Categoria é obrigatória').not().isEmpty(),
  check('imagemUrl', 'URL de imagem válida é obrigatória').isURL(),
];

// Rotas públicas
router.route('/').get(getProdutos);
router.route('/:id').get(getProdutoById);

// Rotas protegidas para admins
router.route('/')
  .post(protect, admin, produtoValidations, createProduto);

router.route('/:id')
  .put(protect, admin, produtoValidations, updateProduto)
  .delete(protect, admin, deleteProduto);

export default router;