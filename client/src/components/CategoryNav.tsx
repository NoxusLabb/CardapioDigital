import { Category } from "@shared/schema";

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
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Categorias</h2>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3 pb-2 w-max">
          <button 
            className={`px-4 py-2 rounded-full font-medium focus:outline-none transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-white text-text border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelectCategory(null)}
          >
            Todos
          </button>
          
          {categories.map((category) => (
            <button 
              key={category.id}
              className={`px-4 py-2 rounded-full font-medium focus:outline-none transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-text border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
