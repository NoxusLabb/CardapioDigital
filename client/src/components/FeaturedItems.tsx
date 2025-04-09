import { Product } from "@shared/schema";
import ProductCard from "./ProductCard";

interface FeaturedItemsProps {
  items: Product[];
}

export default function FeaturedItems({ items }: FeaturedItemsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Destaques</h2>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-2 w-max">
          {items.map((item) => (
            <div key={item.id} className="w-64 flex-shrink-0">
              <ProductCard product={item} size="large" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
