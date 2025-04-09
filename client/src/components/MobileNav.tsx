import { Link, useLocation } from "wouter";
import { Home, Search, ShoppingCart, User } from "lucide-react";

interface MobileNavProps {
  toggleSearch: () => void;
  toggleCart: () => void;
  cartItemCount: number;
}

export default function MobileNav({ toggleSearch, toggleCart, cartItemCount }: MobileNavProps) {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 px-3 ${location === '/' ? 'text-primary' : 'text-accent hover:text-primary'}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Início</span>
          </a>
        </Link>
        
        <button
          className="flex flex-col items-center py-2 px-3 text-accent hover:text-primary"
          onClick={toggleSearch}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Buscar</span>
        </button>
        
        <button
          className="flex flex-col items-center py-2 px-3 text-accent hover:text-primary relative"
          onClick={toggleCart}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Carrinho</span>
        </button>
        
        <Link href="/auth">
          <a className={`flex flex-col items-center py-2 px-3 ${location === '/auth' || location === '/admin' ? 'text-primary' : 'text-accent hover:text-primary'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
