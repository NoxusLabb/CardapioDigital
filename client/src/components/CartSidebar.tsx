import { X, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = 5.00; // fixed delivery fee
  const total = subtotal + deliveryFee;
  
  const handleCheckout = () => {
    toast({
      title: "Pedido realizado!",
      description: "Seu pedido foi recebido e está sendo processado.",
    });
    
    clearCart();
    onClose();
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Seu Pedido</h2>
          <button 
            className="text-accent hover:text-text" 
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Empty cart message */}
          {cart.length === 0 && (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-accent">Seu carrinho está vazio</p>
              <p className="text-sm text-accent mt-2">Adicione itens para fazer seu pedido</p>
            </div>
          )}
          
          {/* Cart items list */}
          {cart.length > 0 && (
            <div>
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-primary font-medium text-sm">{formatCurrency(item.product.price)}</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="text-accent hover:text-text w-8 h-8 flex items-center justify-center"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button 
                      className="text-accent hover:text-text w-8 h-8 flex items-center justify-center"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-accent">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-accent">Taxa de entrega</span>
                <span className="font-medium">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full py-3 bg-primary text-white hover:bg-primary/90"
              onClick={handleCheckout}
            >
              Finalizar Pedido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
