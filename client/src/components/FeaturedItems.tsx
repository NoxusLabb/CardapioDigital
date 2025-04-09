import React from 'react';
import { Product } from '@shared/schema';
import { formatCurrency } from '../utils/formatCurrency';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface FeaturedItemsProps {
  items: Product[];
}

export default function FeaturedItems({ items }: FeaturedItemsProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;
      const scrollPosition = direction === 'left' 
        ? current.scrollLeft - scrollAmount 
        : current.scrollLeft + scrollAmount;
      
      current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // If we don't have at least 3 items, don't render the component
  if (items.length < 3) return null;

  return (
    <section className="relative py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Destaques</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
              aria-label="Deslizar para a esquerda"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
              aria-label="Deslizar para a direita"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
            >
              <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                Destaque
              </div>
              <div className="h-40 bg-gray-200 relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center mb-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className="h-4 w-4"
                        fill={i < 5 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">5.0</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2 h-10">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-gray-900">{formatCurrency(item.price)}</span>
                  <button className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}