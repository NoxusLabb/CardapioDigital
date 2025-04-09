import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@shared/schema';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  const closeCart = () => {
    onClose();
  };
  
  const handleIncrement = (productId: string) => {
    const item = cart.find(item => String(item.product.id) === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };
  
  const handleDecrement = (productId: string) => {
    const item = cart.find(item => String(item.product.id) === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };
  
  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };
  
  const checkout = () => {
    alert('Função de checkout ainda não implementada');
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeCart}
        />
      )}
      
      {/* Cart sidebar */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-96 h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Seu Carrinho
            </h2>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Fechar carrinho"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Cart items */}
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
                <p className="mb-2">Seu carrinho está vazio</p>
                <p className="text-sm">Adicione itens do cardápio para começar</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex border-b pb-4">
                    <div className="h-20 w-20 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/80?text=Imagem+Indisponível';
                        }}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium mb-1 pr-6">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{formatCurrency(item.product.price)}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded">
                          <button 
                            onClick={() => handleDecrement(String(item.product.id))}
                            className="p-1 hover:bg-gray-100"
                            aria-label="Diminuir quantidade"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-2 py-1 min-w-[30px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleIncrement(String(item.product.id))}
                            className="p-1 hover:bg-gray-100"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemove(String(item.product.id))}
                          className="p-1 text-gray-500 hover:text-red-500"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Cart footer */}
          <div className="border-t p-4">
            {cart.length > 0 && (
              <>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={checkout}
                    className="checkout-button w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Finalizar Pedido
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full border border-gray-300 hover:bg-gray-100 py-2 rounded-lg font-medium transition-colors"
                  >
                    Limpar Carrinho
                  </button>
                </div>
              </>
            )}
            
            {cart.length === 0 && (
              <button
                onClick={closeCart}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Continuar Comprando
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}