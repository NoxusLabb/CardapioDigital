import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, foreignKey, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  imageUrl: text("image_url").notNull(),
  available: boolean("available").default(true).notNull(),
  ingredients: text("ingredients").array(),
  // Campos para gestão de estoque
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  minimumStock: integer("minimum_stock").default(5),
  costPrice: doublePrecision("cost_price"), // Preço de custo (optional)
  weight: doublePrecision("weight"), // Peso em gramas (optional)
  featured: boolean("featured").default(false).notNull(), // Produto em destaque
  discountPercent: integer("discount_percent").default(0), // % de desconto
  tags: text("tags").array(), // Tags/etiquetas para filtragem
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  categoryId: true,
  imageUrl: true,
  available: true,
  ingredients: true,
  stockQuantity: true,
  minimumStock: true,
  costPrice: true,
  weight: true,
  featured: true,
  discountPercent: true,
  tags: true,
});

// Status do pedido (Enum para pedidos)
export const orderStatusEnum = pgEnum('order_status', [
  'recebido',   // Pedido recebido pelo sistema
  'em_preparo', // Pedido em preparo na cozinha
  'a_caminho',  // Pedido saiu para entrega
  'entregue'    // Pedido entregue ao cliente
]);

// Order schema - para armazenar os pedidos
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // Código do pedido (ex: PED-1234)
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address"),
  status: orderStatusEnum('status').default('recebido').notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerPhone: true,
  customerAddress: true,
  totalPrice: true,
  notes: true
});

// OrderItem schema - para armazenar os itens de cada pedido
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(), // Armazenamos o nome para caso o produto seja deletado/alterado
  quantity: integer("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  notes: text("notes")
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  productName: true,
  quantity: true,
  unitPrice: true,
  notes: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  orderItems: many(orderItems)
}));

// Definindo relações para os orders
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

// Validation schemas
export const productSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
  price: z.number().positive({ message: "Preço deve ser positivo" }),
  categoryId: z.number().int().positive({ message: "Categoria é obrigatória" }),
  imageUrl: z.string().url({ message: "URL da imagem inválida" }),
  available: z.boolean(),
  ingredients: z.array(z.string()).optional(),
  stockQuantity: z.number().int().min(0, { message: "Quantidade em estoque não pode ser negativa" }).optional(),
  minimumStock: z.number().int().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  featured: z.boolean().optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

// Schemas para validação e criação de pedidos
export const createOrderSchema = z.object({
  customerName: z.string().min(3, { message: "Nome completo é obrigatório" }),
  customerPhone: z.string().min(10, { message: "Telefone é obrigatório" }),
  customerAddress: z.string().optional(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    notes: z.string().optional()
  })),
  notes: z.string().optional()
});

// Schema para rastreamento de pedidos
export const trackOrderSchema = z.object({
  orderNumber: z.string().regex(/^PED-\d+$/, "Formato inválido. Use o formato PED-XXXX")
});
