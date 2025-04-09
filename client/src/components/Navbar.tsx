import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingCart, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  toggleSearch: () => void;
  toggleCart: () => void;
  cartItemCount: number;
}

export default function Navbar({ toggleSearch, toggleCart, cartItemCount }: NavbarProps) {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-xl font-bold text-primary">Sabor Expresso</a>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="text-text hover:text-primary" 
            onClick={toggleSearch}
            aria-label="Buscar"
          >
            <Search className="h-6 w-6" />
          </button>
          
          <button 
            className="text-text hover:text-primary relative" 
            onClick={toggleCart}
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </button>
          
          {user ? (
            <Link href={user.isAdmin ? "/admin" : "/perfil"}>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5 mr-2" />
                {user.isAdmin ? "Admin" : "Perfil"}
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
