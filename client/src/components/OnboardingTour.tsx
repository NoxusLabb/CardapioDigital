import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import { useLocation } from 'wouter';

interface OnboardingTourProps {
  isFirstVisit?: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isFirstVisit = true }) => {
  const [run, setRun] = useState(isFirstVisit);
  const [steps, setSteps] = useState<Step[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Definir os passos do tour apenas após a renderização do DOM
    // para garantir que os elementos alvo existam
    setSteps([
      {
        target: 'body',
        content: (
          <div>
            <h3>🍽️ Bem-vindo ao Cardápio Digital!</h3>
            <p>Vamos fazer um tour rápido para você conhecer nosso delicioso menu.</p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: '.navbar',
        content: (
          <div>
            <h3>🧭 Navegação</h3>
            <p>Aqui você encontra todas as opções de navegação do nosso cardápio.</p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.category-nav',
        content: (
          <div>
            <h3>🔍 Categorias</h3>
            <p>Navegue facilmente por categorias como entradas, pratos principais e sobremesas.</p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.product-card',
        content: (
          <div>
            <h3>🍕 Nossos Produtos</h3>
            <p>Clique em qualquer produto para ver mais detalhes como ingredientes e opções de personalização.</p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '.cart-button',
        content: (
          <div>
            <h3>🛒 Seu Carrinho</h3>
            <p>Todos os itens que você selecionar aparecerão aqui. É fácil revisar seu pedido antes de finalizar.</p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: 'body',
        content: (
          <div>
            <h3>🎉 Pronto para começar!</h3>
            <p>Agora é só explorar nosso cardápio e fazer seu pedido. Bom apetite!</p>
          </div>
        ),
        placement: 'center',
      },
    ]);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      // Armazenar no localStorage que o usuário já viu o tour
      localStorage.setItem('onboardingCompleted', 'true');
    }
  };

  const handleSkipTour = () => {
    setRun(false);
    // Armazenar no localStorage que o usuário já viu o tour
    localStorage.setItem('onboardingCompleted', 'true');
  };

  return (
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
      }}
      locale={{
        back: 'Anterior',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular tour',
      }}
    />
  );
};

export default OnboardingTour;