import { Product, Category } from "@shared/schema";
import ProductCard from "./ProductCard";

interface MenuItemsGridProps {
  productsByCategory: Record<number, Product[]>;
  categories: Category[];
}

export default function MenuItemsGrid({ productsByCategory, categories }: MenuItemsGridProps) {
  if (Object.keys(productsByCategory).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-accent">Nenhum produto encontrado.</p>
      </div>
    );
  }

  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Categoria";
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cardápio</h2>
      
      {Object.entries(productsByCategory).map(([categoryId, products]) => (
        <div key={categoryId} className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-secondary">
            {getCategoryName(parseInt(categoryId))}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} size="small" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
