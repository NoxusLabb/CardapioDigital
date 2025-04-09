import { Product } from "@shared/schema";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  size: "small" | "large";
}

export default function ProductCard({ product, size }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product);
  };

  if (size === "large") {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
          <p className="text-accent text-sm mb-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
            <button 
              className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center focus:outline-none hover:bg-opacity-90 transition-colors"
              onClick={handleAddToCart}
              aria-label="Adicionar ao carrinho"
              disabled={!product.available}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="h-24 w-24 object-cover"
      />
      <div className="p-3 flex-1">
        <h3 className="font-bold text-base mb-1">{product.name}</h3>
        <p className="text-accent text-xs mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
          <button 
            className={`rounded-full w-7 h-7 flex items-center justify-center focus:outline-none transition-colors
              ${product.available ? 'bg-primary text-white hover:bg-opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
            disabled={!product.available}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
