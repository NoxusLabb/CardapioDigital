import { useState, useEffect } from 'react';

export function useOnboarding() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se é a primeira visita do usuário
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    setIsFirstVisit(!onboardingCompleted);
    setLoading(false);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setIsFirstVisit(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    setIsFirstVisit(true);
  };

  return {
    isFirstVisit,
    loading,
    completeOnboarding,
    resetOnboarding
  };
}