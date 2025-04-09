import React, { useState, useEffect, useRef } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search, Menu, Home, Coffee, Pizza, IceCream, Utensils, ExternalLink } from 'lucide-react';
import { Product } from '@shared/schema';
import axios from 'axios';
import { formatCurrency } from '@/lib/utils';

interface OnboardingTourProps {
  isFirstVisit?: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isFirstVisit = true }) => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [, setLocation] = useLocation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  // Definindo o tipo correto para o estado de referência
  type TourState = {
    currentStep: number;
    highlightedProduct: Product | null;
  };
  
  const tourState = useRef<TourState>({ 
    currentStep: 0, 
    highlightedProduct: null 
  });

  // Carregar produtos em destaque para o tour
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        // Pegar os 3 primeiros produtos para demonstração
        const products = response.data.slice(0, 3);
        setFeaturedProducts(products);
        setLoading(false);
        
        // Iniciar o tour após carregar os produtos
        // Verificar se é a primeira visita ou se tour foi completado
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        if (isFirstVisit && !onboardingCompleted) {
          setRun(true);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos para o tour:', error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [isFirstVisit]);

  // Configurar os passos do tour após carregar os produtos
  useEffect(() => {
    if (featuredProducts.length > 0) {
      setSteps([
        {
          target: 'body',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">🍽️ Bem-vindo ao Cardápio Digital!</h3>
              <p>Vamos fazer um tour interativo para você conhecer nosso delicioso menu e experimentar todas as funcionalidades.</p>
              <div className="flex justify-center pt-2">
                <Utensils size={24} className="text-primary animate-bounce" />
              </div>
            </div>
          ),
          placement: 'center',
          disableBeacon: true,
        },
        {
          target: '.header-navigation',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">🧭 Navegação Principal</h3>
              <p>Aqui você encontra todas as opções de navegação do nosso cardápio.</p>
              <div className="flex gap-3 mt-2">
                <div className="flex flex-col items-center">
                  <Home size={20} className="text-primary" />
                  <span className="text-xs mt-1">Início</span>
                </div>
                <div className="flex flex-col items-center">
                  <Menu size={20} className="text-primary" />
                  <span className="text-xs mt-1">Menu</span>
                </div>
                <div className="flex flex-col items-center">
                  <Search size={20} className="text-primary" />
                  <span className="text-xs mt-1">Buscar</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShoppingCart size={20} className="text-primary" />
                  <span className="text-xs mt-1">Carrinho</span>
                </div>
              </div>
            </div>
          ),
          placement: 'bottom',
        },
        {
          target: '.category-navigation',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">🔍 Categorias de Produtos</h3>
              <p>Navegue facilmente por nossas categorias para encontrar exatamente o que deseja.</p>
              <div className="flex gap-3 mt-2">
                <div className="flex flex-col items-center">
                  <Pizza size={20} className="text-primary" />
                  <span className="text-xs mt-1">Entradas</span>
                </div>
                <div className="flex flex-col items-center">
                  <Utensils size={20} className="text-primary" />
                  <span className="text-xs mt-1">Principais</span>
                </div>
                <div className="flex flex-col items-center">
                  <Coffee size={20} className="text-primary" />
                  <span className="text-xs mt-1">Bebidas</span>
                </div>
                <div className="flex flex-col items-center">
                  <IceCream size={20} className="text-primary" />
                  <span className="text-xs mt-1">Sobremesas</span>
                </div>
              </div>
            </div>
          ),
          placement: 'bottom',
        },
        {
          target: '.product-grid',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">🍕 Explore Nossos Produtos</h3>
              <p>Conheça alguns dos nossos produtos mais populares:</p>
              <div className="grid gap-3 pt-2 max-h-[300px] overflow-y-auto">
                {featuredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="border rounded-lg p-3 bg-card"
                    onClick={() => {
                      tourState.current.highlightedProduct = product;
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img 
                          src={product.imageUrl || 'https://via.placeholder.com/80?text=Produto'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80?text=Erro';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{product.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                        <p className="text-sm font-bold mt-1">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
          placement: 'right',
          disableOverlayClose: true,
        },
        {
          target: '.product-card',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">✨ Detalhes do Produto</h3>
              <p>Clique em qualquer produto para ver mais detalhes, ingredientes e opções de personalização.</p>
              <div className="pt-2 flex justify-center">
                {tourState.current.highlightedProduct ? (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (tourState.current.highlightedProduct) {
                        addToCart(tourState.current.highlightedProduct as any);
                      }
                    }}
                  >
                    Experimentar adicionar ao carrinho
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (featuredProducts.length > 0) {
                        addToCart(featuredProducts[0] as any);
                      }
                    }}
                  >
                    Experimentar adicionar ao carrinho
                  </Button>
                )}
              </div>
            </div>
          ),
          placement: 'left',
        },
        {
          target: '.cart-button',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">🛒 Seu Carrinho</h3>
              <p>Todos os itens que você selecionar aparecerão aqui. É fácil revisar seu pedido antes de finalizar.</p>
              <p className="text-xs italic">Experimente adicionar mais produtos e ajustar as quantidades!</p>
            </div>
          ),
          placement: 'left',
        },
        {
          target: '.checkout-button',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">💳 Finalizar Pedido</h3>
              <p>Quando estiver satisfeito com sua seleção, é só clicar aqui para finalizar o pedido e informar seus dados de entrega.</p>
            </div>
          ),
          placement: 'top',
        },
        {
          target: 'body',
          content: (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">🎉 Pronto para começar!</h3>
              <p>Agora é só explorar nosso cardápio e fazer seu pedido. Bom apetite!</p>
              <div className="flex justify-center gap-2 pt-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setRun(false);
                    localStorage.setItem('onboardingCompleted', 'true');
                  }}
                >
                  Finalizar Tour
                </Button>
                <Button 
                  onClick={() => {
                    setRun(false);
                    setLocation('/');
                    localStorage.setItem('onboardingCompleted', 'true');
                  }}
                >
                  Explorar Cardápio
                </Button>
              </div>
            </div>
          ),
          placement: 'center',
        },
      ]);
    }
  }, [featuredProducts, addToCart, setLocation]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Atualizar o passo atual
    tourState.current.currentStep = index;

    if (finishedStatuses.includes(status)) {
      setRun(false);
      // Armazenar no localStorage que o usuário já viu o tour
      localStorage.setItem('onboardingCompleted', 'true');
    }
  };

  const startTour = () => {
    localStorage.removeItem('onboardingCompleted');
    tourState.current = { currentStep: 0, highlightedProduct: null };
    setRun(true);
  };

  if (loading) {
    return null; // Não renderizar nada durante o carregamento
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#FF5A5F',
            backgroundColor: '#FFFFFF',
            textColor: '#484848',
            arrowColor: '#FFFFFF',
            zIndex: 10000,
          },
          spotlight: {
            backgroundColor: 'transparent',
          },
          buttonNext: {
            backgroundColor: '#FF5A5F',
          },
          buttonBack: {
            color: '#FF5A5F',
          },
          tooltip: {
            width: 'auto',
            maxWidth: '400px',
          },
        }}
        locale={{
          back: 'Anterior',
          close: 'Fechar',
          last: 'Finalizar',
          next: 'Próximo',
          skip: 'Pular tour',
        }}
      />
      
      {/* Botão para reiniciar o tour */}
      {!run && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            variant="secondary"
            size="sm"
            className="shadow-lg"
            onClick={startTour}
          >
            Iniciar Tour Interativo
          </Button>
        </div>
      )}
    </>
  );
};

export default OnboardingTour;