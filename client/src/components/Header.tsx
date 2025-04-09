import React from 'react';
import { Link } from 'wouter';
import { Search, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-primary flex items-center">
              <span className="mr-2">🍽️</span> Cardápio Digital
            </a>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/">
                    <a className="text-gray-700 hover:text-primary transition-colors">
                      Cardápio
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/sobre">
                    <a className="text-gray-700 hover:text-primary transition-colors">
                      Sobre
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/contato">
                    <a className="text-gray-700 hover:text-primary transition-colors">
                      Contato
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="h-6 w-6" />
            </button>
            
            <button 
              className="text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Carrinho"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
            
            <Link href="/admin/login">
              <a className="hidden md:flex items-center text-gray-700 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
                <User className="h-6 w-6" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}