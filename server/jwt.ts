import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import { User } from '@shared/schema';

// Adicionar tipagem para o objeto Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Chave secreta utilizada para assinar os tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'cardapio-digital-jwt-secret';
const JWT_EXPIRES_IN = '7d'; // 7 dias de validade para o token

// Interface para payload do token JWT
interface JwtPayload {
  id: number;
  username: string;
  isAdmin: boolean;
}

// Função para gerar um token JWT para um usuário
export function generateToken(user: User): string {
  const payload: JwtPayload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Função para verificar o token JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

// Middleware para autenticar requisições usando JWT
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  // Obter o token do cabeçalho Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  // O formato esperado é "Bearer TOKEN"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const token = parts[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  // Verificar se o usuário ainda existe no banco de dados
  try {
    const user = await storage.getUser(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar informações do usuário ao objeto de requisição
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

// Middleware que verifica se o usuário autenticado é um administrador
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado. Privilégios de administrador necessários.' });
  }

  next();
}