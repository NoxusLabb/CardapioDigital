import React from 'react';
import { Product } from '@shared/schema';
import CategorySection from './CategorySection';
import { Category } from '@shared/schema';

interface MenuItemsGridProps {
  productsByCategory: Record<number, Product[]>;
  categories: Category[];
}

export default function MenuItemsGrid({ productsByCategory, categories }: MenuItemsGridProps) {
  return (
    <div id="cardapio" className="pt-8 pb-16">
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          title={category.name}
          products={productsByCategory[category.id] || []}
        />
      ))}
    </div>
  );
}