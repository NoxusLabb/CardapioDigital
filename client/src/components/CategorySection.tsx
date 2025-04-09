import React from 'react';
import { Product } from '@shared/schema';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  title: string;
  products: Product[];
}

export default function CategorySection({ title, products }: CategorySectionProps) {
  if (products.length === 0) return null;
  
  return (
    <section id={`category-${title.toLowerCase().replace(/\s+/g, '-')}`} className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{title}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}