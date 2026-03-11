/**
 * Storage - Módulo centralizado
 * 
 * Exporta todas as funções relacionadas ao armazenamento local
 * Usa expo-secure-store para armazenamento seguro
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export { saveToken, getToken, removeToken } from './token';

// Chaves para storage (SecureStore requer apenas [a-zA-Z0-9._-])
const ONBOARDING_KEY = 'nymu_onboarding';

/**
 * Salva flag indicando que o onboarding foi completado
 * 
 * @returns Promise<void>
 */
export async function saveOnboardingCompleted(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(ONBOARDING_KEY, 'true');
      }
      return;
    }

    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.warn('Erro ao salvar onboarding:', error);
  }
}

/**
 * Verifica se o onboarding já foi completado
 * 
 * @returns Promise<boolean> - true se já viu o onboarding
 */
export async function getOnboardingCompleted(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        const value = window.localStorage.getItem(ONBOARDING_KEY);
        return value === 'true';
      }
      return false;
    }

    const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.warn('Erro ao verificar onboarding:', error);
    return false;
  }
}

/**
 * Reseta a flag de onboarding (útil para testes ou reset)
 * 
 * @returns Promise<void>
 */
export async function resetOnboardingCompleted(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(ONBOARDING_KEY);
      }
      return;
    }

    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
  } catch (error) {
    console.warn('Erro ao resetar onboarding:', error);
  }
}
