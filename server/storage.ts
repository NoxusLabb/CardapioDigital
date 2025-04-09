import { db, pool } from "./db";
import { eq, like, or } from "drizzle-orm";
import * as ExpressSession from "express-session";
import connectPg from "connect-pg-simple";
import { 
  users, 
  categories, 
  products, 
  orders, 
  orderItems, 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order, 
  type InsertOrder,
  type OrderItem, 
  type InsertOrderItem 
} from "@shared/schema";

// Interface with CRUD methods for our app
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  searchProducts(term: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    totalPrice: number;
    notes?: string;
    items: Array<{
      productId: number;
      productName: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }>;
  }): Promise<Order>;
  
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getOrderWithItems(orderId: number): Promise<{ order: Order; items: OrderItem[] } | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  updateOrderStatus(orderId: number, status: 'recebido' | 'em_preparo' | 'a_caminho' | 'entregue'): Promise<Order | undefined>;
  
  // Session store
  sessionStore: ExpressSession.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: ExpressSession.Store;

  constructor() {
    const PostgresSessionStore = connectPg(ExpressSession);
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return result.length > 0;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async searchProducts(term: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        or(
          like(products.name, `%${term}%`),
          like(products.description, `%${term}%`)
        )
      );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return result.length > 0;
  }

  // Order operations
  async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    totalPrice: number;
    notes?: string;
    items: Array<{
      productId: number;
      productName: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }>;
  }): Promise<Order> {
    // Gerar número de pedido único no formato PED-XXXX
    const orderNumber = `PED-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Iniciar uma transação
    return await db.transaction(async (tx) => {
      // Criar o pedido
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerAddress: orderData.customerAddress,
          totalPrice: orderData.totalPrice,
          notes: orderData.notes,
          status: 'recebido',
        })
        .returning();
      
      // Adicionar os itens do pedido
      for (const item of orderData.items) {
        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
        });
      }
      
      return order;
    });
  }
  
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));
    return order;
  }
  
  async getOrderWithItems(orderId: number): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));
    
    if (!order) return undefined;
    
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
    
    return { order, items };
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }
  
  async updateOrderStatus(orderId: number, status: 'recebido' | 'em_preparo' | 'a_caminho' | 'entregue'): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return updatedOrder;
  }
}

export const storage = new DatabaseStorage();