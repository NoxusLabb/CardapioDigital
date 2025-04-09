import React from 'react';
import { Menu, X, ShoppingCart, Search, Home, Info, Phone } from 'lucide-react';
import { Link } from 'wouter';

interface MobileNavProps {
  toggleSearch: () => void;
  toggleCart: () => void;
  cartItemCount: number;
}

export default function MobileNav({ toggleSearch, toggleCart, cartItemCount }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const handleCartClick = () => {
    closeMenu();
    toggleCart();
  };
  
  const handleSearchClick = () => {
    closeMenu();
    toggleSearch();
  };
  
  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={closeMenu}
        />
      )}
      
      {/* Mobile menu panel */}
      <div 
        className={`fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Nav links */}
          <div className="flex-grow overflow-y-auto">
            <nav className="py-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/" className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors" onClick={closeMenu}>
                    <Home className="h-5 w-5 mr-3 text-primary" />
                    <span>Cardápio</span>
                  </Link>
                </li>
                <li>
                  <Link href="/sobre" className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors" onClick={closeMenu}>
                    <Info className="h-5 w-5 mr-3 text-primary" />
                    <span>Sobre Nós</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors" onClick={closeMenu}>
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <span>Contato</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Action buttons */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <button
                onClick={handleSearchClick}
                className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors py-2 rounded-md flex items-center justify-center"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5 mr-2" />
                <span>Buscar</span>
              </button>
              <button
                onClick={handleCartClick}
                className="flex-1 bg-primary hover:bg-primary/90 transition-colors py-2 rounded-md text-white flex items-center justify-center relative"
                aria-label="Carrinho"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Carrinho</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-primary">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}