/**
 * Gerenciamento de token de autenticação
 *
 * Usa:
 * - expo-secure-store em plataformas nativas (iOS/Android)
 * - localStorage no web como fallback
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Chave precisa ser apenas [a-zA-Z0-9._-] para o SecureStore
const TOKEN_KEY = 'nymu_token';
const isWeb = Platform.OS === 'web';

/**
 * Salva o token de autenticação
 * 
 * @param token - Token JWT a ser salvo
 * @returns Promise<void>
 * 
 * @example
 * ```ts
 * await saveToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * ```
 */
export async function saveToken(token: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
      return;
    }

    // Nativo: usar SecureStore (já instalado no projeto)
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.warn('Aviso ao salvar token:', error);
    // Não relança o erro para não quebrar o fluxo de login
  }
}

/**
 * Recupera o token de autenticação salvo
 * 
 * @returns Promise<string | null> - Token salvo ou null se não existir
 * 
 * @example
 * ```ts
 * const token = await getToken();
 * if (token) {
 *   // Usar token
 * }
 * ```
 */
export async function getToken(): Promise<string | null> {
  try {
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(TOKEN_KEY);
      }
      return null;
    }

    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Aviso ao recuperar token:', error);
    return null;
  }
}

/**
 * Remove o token de autenticação
 * 
 * @returns Promise<void>
 * 
 * @example
 * ```ts
 * await removeToken();
 * ```
 */
export async function removeToken(): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Aviso ao remover token:', error);
    // Não relança para não quebrar fluxo de logout
  }
}
