import React from 'react';
import { Category } from '@shared/schema';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export default function CategoryNav({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryNavProps) {
  return (
    <div className="category-nav bg-white sticky top-16 z-30 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="category-navigation overflow-x-auto hide-scrollbar py-3">
          <div className="flex space-x-2 md:space-x-4 min-w-max">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}