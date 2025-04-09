import { useState, useEffect } from 'react';

interface OnboardingProgress {
  completedSteps: number[];
  lastVisitedStep: number;
  completedAt?: string;
}

export function useOnboarding() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress>({
    completedSteps: [],
    lastVisitedStep: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      // Verificar se é a primeira visita do usuário
      const storedData = localStorage.getItem('onboarding');
      
      if (!storedData) {
        // Primeira visita
        setIsFirstVisit(true);
        setLoading(false);
        return;
      }

      // Carregar dados do progresso do onboarding
      const progress = JSON.parse(storedData) as OnboardingProgress;
      setOnboardingProgress(progress);
      
      // Se tem data de conclusão, o tour foi completado
      setIsFirstVisit(!progress.completedAt);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados de onboarding:', error);
      setIsFirstVisit(true);
      setLoading(false);
    }
  }, []);

  // Atualizar o progresso do tour
  const updateProgress = (step: number) => {
    const updatedProgress = { ...onboardingProgress };
    
    // Adicionar o passo atual aos passos completados (se ainda não estiver)
    if (!updatedProgress.completedSteps.includes(step)) {
      updatedProgress.completedSteps = [...updatedProgress.completedSteps, step];
    }
    
    // Atualizar o último passo visitado
    updatedProgress.lastVisitedStep = step;
    
    setOnboardingProgress(updatedProgress);
    localStorage.setItem('onboarding', JSON.stringify(updatedProgress));
  };

  // Marcar o tour como concluído
  const completeOnboarding = () => {
    const finalProgress = { 
      ...onboardingProgress,
      completedAt: new Date().toISOString()
    };
    
    setOnboardingProgress(finalProgress);
    localStorage.setItem('onboarding', JSON.stringify(finalProgress));
    setIsFirstVisit(false);
  };

  // Resetar todo o progresso do tour
  const resetOnboarding = () => {
    const initialProgress = {
      completedSteps: [],
      lastVisitedStep: 0
    };
    
    setOnboardingProgress(initialProgress);
    localStorage.setItem('onboarding', JSON.stringify(initialProgress));
    setIsFirstVisit(true);
  };

  // Recuperar o tour do último ponto
  const resumeTour = () => {
    return onboardingProgress.lastVisitedStep || 0;
  };

  // Verificar se o usuário completou uma step específica
  const hasCompletedStep = (step: number) => {
    return onboardingProgress.completedSteps.includes(step);
  };

  return {
    isFirstVisit,
    loading,
    currentStep: onboardingProgress.lastVisitedStep,
    completedSteps: onboardingProgress.completedSteps,
    completeOnboarding,
    resetOnboarding,
    updateProgress,
    resumeTour,
    hasCompletedStep
  };
}