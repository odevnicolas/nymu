/**
 * Cache local dos dados do usuário autenticado
 *
 * Persiste o objeto User no SecureStore para exibição instantânea na UI
 * mesmo antes da resposta da API. Deve ser limpo ao receber 401.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '../api/types';

const USER_CACHE_KEY = 'nymu_user_cache';
const isWeb = Platform.OS === 'web';

export async function saveUserCache(user: User): Promise<void> {
  try {
    const json = JSON.stringify(user);
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(USER_CACHE_KEY, json);
      }
      return;
    }
    await SecureStore.setItemAsync(USER_CACHE_KEY, json);
  } catch (error) {
    console.warn('Aviso ao salvar cache do usuário:', error);
  }
}

export async function getUserCache(): Promise<User | null> {
  try {
    let json: string | null = null;
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        json = window.localStorage.getItem(USER_CACHE_KEY);
      }
    } else {
      json = await SecureStore.getItemAsync(USER_CACHE_KEY);
    }
    if (!json) return null;
    return JSON.parse(json) as User;
  } catch (error) {
    console.warn('Aviso ao ler cache do usuário:', error);
    return null;
  }
}

export async function clearUserCache(): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(USER_CACHE_KEY);
      }
      return;
    }
    await SecureStore.deleteItemAsync(USER_CACHE_KEY);
  } catch (error) {
    console.warn('Aviso ao limpar cache do usuário:', error);
  }
}
