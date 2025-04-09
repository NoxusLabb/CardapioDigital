import React from 'react';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductPreviewProps {
  product: Product;
  onSelect?: () => void;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product, onSelect }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div className="flex space-x-4" onClick={handleSelect}>
      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/80?text=Produto'} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = 'https://via.placeholder.com/80?text=Erro';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{product.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
          >
            <Info size={18} className="text-muted-foreground hover:text-primary transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  );
};