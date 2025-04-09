import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Focus on input when component mounts
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };
  
  const clearSearch = () => {
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className="bg-white py-4 sticky top-16 z-30 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar itens no cardápio..."
            value={searchTerm}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
              onClick={clearSearch}
              aria-label="Limpar busca"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-500">
            Resultados da busca para: <span className="font-medium">{searchTerm}</span>
          </div>
        )}
      </div>
    </div>
  );
}