import React from 'react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryNav({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}: CategoryNavProps) {
  return (
    <div className="bg-white sticky top-16 z-30 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto hide-scrollbar py-3">
          <div className="flex space-x-2 md:space-x-4 min-w-max">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}