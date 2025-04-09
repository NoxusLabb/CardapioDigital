import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  createOrderSchema, 
  trackOrderSchema 
} from "@shared/schema";
import { z } from "zod";
import { authenticateJWT, requireAdmin, generateToken } from "./jwt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes and middleware (session-based auth)
  setupAuth(app);
  
  // JWT Authentication endpoints para o dashboard admin
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      
      // Verificação de senha
      const valid = await (await import('./auth')).comparePasswords(password, user.password);
      
      if (!valid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      
      // Gerar token JWT
      const token = generateToken(user);
      
      // Retornar usuário e token
      res.json({
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin
        },
        token
      });
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/auth/me", authenticateJWT, (req, res) => {
    // TypeScript não detecta que o middleware authenticateJWT já garante que req.user está definido
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    
    res.json({
      id: req.user.id,
      username: req.user.username,
      isAdmin: req.user.isAdmin
    });
  });
  
  // Public API routes

  // Get all categories
  app.get("/api/categories", async (req, res, next) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  // Get all products
  app.get("/api/products", async (req, res, next) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  // Get products by category
  app.get("/api/products/category/:categoryId", async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "ID de categoria inválido" });
      }
      
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de produto inválido" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  // Search products
  app.get("/api/products/search/:term", async (req, res, next) => {
    try {
      const term = req.params.term;
      const products = await storage.searchProducts(term);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  // Admin API routes (protected)
  // Middleware para proteger todas as rotas administrativas
  app.use('/api/admin', authenticateJWT, requireAdmin);

  // Create a new product
  app.post("/api/admin/products", async (req, res, next) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados de produto inválidos", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  // Update a product
  app.put("/api/admin/products/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de produto inválido" });
      }
      
      const productData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados de produto inválidos", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  // Delete a product
  app.delete("/api/admin/products/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de produto inválido" });
      }
      
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // Category management

  // Create a new category
  app.post("/api/admin/categories", async (req, res, next) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados de categoria inválidos", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  // Update a category
  app.put("/api/admin/categories/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de categoria inválido" });
      }
      
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, categoryData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados de categoria inválidos", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });

  // Delete a category
  app.delete("/api/admin/categories/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de categoria inválido" });
      }
      
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // API de pedidos (Order)
  
  // Criar pedido
  app.post("/api/orders", async (req, res, next) => {
    try {
      const orderData = createOrderSchema.parse(req.body);
      
      // Verificar se todos os produtos existem
      for (const item of orderData.items) {
        const product = await storage.getProductById(item.productId);
        if (!product) {
          return res.status(400).json({ 
            message: "Produto não encontrado", 
            productId: item.productId 
          });
        }
        
        // Verificar se o produto está disponível
        if (!product.available) {
          return res.status(400).json({ 
            message: "Produto não disponível", 
            productId: item.productId,
            productName: product.name
          });
        }
      }
      
      // Preparar dados para criação do pedido
      const orderItems = await Promise.all(orderData.items.map(async (item) => {
        const product = await storage.getProductById(item.productId);
        return {
          productId: item.productId,
          productName: product!.name,
          quantity: item.quantity,
          unitPrice: product!.price,
          notes: item.notes
        };
      }));
      
      // Calcular valor total do pedido
      const totalPrice = orderItems.reduce(
        (total, item) => total + (item.unitPrice * item.quantity), 0
      );
      
      // Criar o pedido
      const order = await storage.createOrder({
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        totalPrice,
        notes: orderData.notes,
        items: orderItems
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados do pedido inválidos", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });
  
  // Buscar pedido pelo número
  app.get("/api/orders/track", async (req, res, next) => {
    try {
      const { orderNumber } = trackOrderSchema.parse(req.query);
      
      const order = await storage.getOrderByNumber(orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      
      const orderWithItems = await storage.getOrderWithItems(order.id);
      res.json(orderWithItems);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Número de pedido inválido", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });
  
  // Rotas de administração de pedidos (protegidas)
  
  // Listar todos os pedidos (admin)
  app.get("/api/admin/orders", async (req, res, next) => {
    try {
      // Esta funcionalidade seria implementada no storage
      // Retornando erro 501 por enquanto
      res.status(501).json({ message: "Funcionalidade ainda não implementada" });
    } catch (error) {
      next(error);
    }
  });
  
  // Atualizar status do pedido (admin)
  app.patch("/api/admin/orders/:id/status", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de pedido inválido" });
      }
      
      const { status } = req.body;
      if (!status || !['recebido', 'em_preparo', 'a_caminho', 'entregue'].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
