import React from 'react';
import { Product } from '@shared/schema';
import { formatCurrency } from '../utils/formatCurrency';
import { ShoppingCart, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  
  const toggleDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDetails(!showDetails);
  };
  
  const { addToCart: addToCartContext } = useCart();
  
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartContext(product);
  };
  
  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
          }}
        />
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={toggleDetails}
              className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
              aria-label="Ver detalhes"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={addToCart}
              className="p-2 bg-primary rounded-full text-white hover:bg-primary/90"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 flex-grow line-clamp-2">{product.description}</p>
        
        <div className="mt-auto">
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="text-xs text-gray-500 mb-2">
              <span className="font-medium">Ingredientes:</span>{' '}
              {product.ingredients.join(', ')}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
            <button
              onClick={addToCart}
              className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
      
      {/* Details modal */}
      {showDetails && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 z-50"
            onClick={toggleDetails}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-full z-50 max-h-[90vh] overflow-y-auto">
            <button
              onClick={toggleDetails}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 text-gray-500"
              aria-label="Fechar detalhes"
            >
              ×
            </button>
            
            <div className="h-48 -mx-6 -mt-6 mb-4 bg-gray-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
                }}
              />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-500 mb-4">{product.description}</p>
            
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 mb-1">Ingredientes</h3>
                <ul className="list-disc pl-5 text-gray-600 text-sm">
                  {product.ingredients.map((ingrediente: string, index: number) => (
                    <li key={index}>{ingrediente}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
              <button
                onClick={(e) => {
                  addToCart(e);
                  toggleDetails(e);
                }}
                className="bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}