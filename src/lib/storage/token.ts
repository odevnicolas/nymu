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
const TOKEN_EXPIRY_KEY = 'nymu_token_expiry';
const isWeb = Platform.OS === 'web';

// Tempo de expiração da sessão: 2 horas em milliseconds
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000;

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
    const expiryTime = Date.now() + SESSION_EXPIRY_MS;
    
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TOKEN_KEY, token);
        window.localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      }
      return;
    }

    // Nativo: usar SecureStore (já instalado no projeto)
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.warn('Aviso ao salvar token:', error);
    // Não relança o erro para não quebrar o fluxo de login
  }
}

/**
 * Recupera o token de autenticação salvo
 * 
 * @returns Promise<string | null> - Token salvo ou null se não existir ou estiver expirado
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
    let expiryTime: number | null = null;
    
    if (isWeb) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const expiryStr = window.localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (expiryStr) {
          expiryTime = parseInt(expiryStr, 10);
        }
      }
    } else {
      const expiryStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
      if (expiryStr) {
        expiryTime = parseInt(expiryStr, 10);
      }
    }

    // Verificar se o token está expirado
    if (expiryTime && Date.now() > expiryTime) {
      // Token expirado, remover e retornar null
      await removeToken();
      return null;
    }

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
        window.localStorage.removeItem(TOKEN_EXPIRY_KEY);
      }
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.warn('Aviso ao remover token:', error);
    // Não relança para não quebrar fluxo de logout
  }
}
