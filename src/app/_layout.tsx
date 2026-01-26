import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  // Carregar fontes Urbanist
  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  useEffect(() => {
    // Aguardar até que as rotas e fontes estejam carregadas antes de esconder a splash screen
    if (segments.length > 0 && fontsLoaded && !isReady) {
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
          setIsReady(true);
        } catch (error) {
          console.warn('Error hiding splash screen:', error);
        }
      };
      // Pequeno delay para garantir que tudo está renderizado
      setTimeout(hideSplash, 100);
    }
  }, [segments, fontsLoaded, isReady]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="public/onboarding" />
        <Stack.Screen name="public/login" />
        <Stack.Screen name="public/code-login" />
        <Stack.Screen name="public/sign-up" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
