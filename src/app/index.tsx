import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getOnboardingCompleted, getToken } from '@/lib/storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        // Verificar se o onboarding já foi visto
        const hasSeenOnboarding = await getOnboardingCompleted();
        
        // Verificar se há token de autenticação
        const token = await getToken();

        if (hasSeenOnboarding) {
          // Se já viu o onboarding, ir para login
          setRedirectTo('/public/login');
        } else {
          // Se não viu o onboarding, ir para onboarding
          setRedirectTo('/public/onboarding');
        }
      } catch (error) {
        console.warn('Erro ao verificar rota inicial:', error);
        // Em caso de erro, ir para onboarding por segurança
        setRedirectTo('/public/onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialRoute();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333333" />
      </View>
    );
  }

  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
