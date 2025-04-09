import React from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Search, User } from 'lucide-react';
import MobileNav from './MobileNav';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  toggleSearch: () => void;
  toggleCart: () => void;
}

export default function Navbar({ toggleSearch, toggleCart }: NavbarProps) {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              CardápioDigital
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium hover:text-primary transition-colors">
              Cardápio
            </Link>
            <Link href="/sobre" className="font-medium hover:text-primary transition-colors">
              Sobre Nós
            </Link>
            <Link href="/contato" className="font-medium hover:text-primary transition-colors">
              Contato
            </Link>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search button - visible on desktop only */}
            <button
              onClick={toggleSearch}
              className="hidden md:block p-2 rounded-full hover:bg-gray-100"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Cart button - visible on desktop only */}
            <button
              onClick={toggleCart}
              className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="Carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* User button */}
            <Link href="/conta" className="p-2 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Link>
            
            {/* Mobile Navigation */}
            <MobileNav 
              toggleSearch={toggleSearch} 
              toggleCart={toggleCart} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
}