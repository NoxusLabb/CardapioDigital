import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryNav from "@/components/CategoryNav";
import FeaturedItems from "@/components/FeaturedItems";
import MenuItemsGrid from "@/components/MenuItemsGrid";
import CartSidebar from "@/components/CartSidebar";
import MobileNav from "@/components/MobileNav";
import { Category, Product } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Fetch categories
  const { 
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch products
  const { 
    data: products,
    isLoading: productsLoading,
    error: productsError
  } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Handle search and filtering
  const filteredProducts = products
    ? products.filter(product => {
        // Apply category filter if selected
        if (selectedCategory && product.categoryId !== selectedCategory) {
          return false;
        }
        
        // Apply search filter if term exists
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        return true;
      })
    : [];

  // Group products by category for display
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    if (!acc[product.categoryId]) {
      acc[product.categoryId] = [];
    }
    acc[product.categoryId].push(product);
    return acc;
  }, {} as Record<number, Product[]>);

  // Get featured items (first 3-4 items or items marked as featured in a real app)
  const featuredItems = products ? products.slice(0, 3) : [];

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (categoriesError || productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar dados</h2>
          <p className="text-red-500">
            Ocorreu um erro ao carregar o cardápio. Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSearch={toggleSearch} toggleCart={toggleCart} cartItemCount={0} />
      
      {isSearchVisible && (
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
        />
      )}
      
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <CategoryNav 
          categories={categories || []} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <FeaturedItems items={featuredItems} />
        
        <MenuItemsGrid 
          productsByCategory={productsByCategory}
          categories={categories || []}
        />
      </main>
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <MobileNav 
        toggleCart={toggleCart} 
        toggleSearch={toggleSearch}
        cartItemCount={0} 
      />
    </div>
  );
}
