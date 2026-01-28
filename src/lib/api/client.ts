/**
 * Cliente HTTP centralizado
 * 
 * Funções helper para chamadas HTTP usando fetch nativo
 * Suporta interceptors para adicionar headers automaticamente (ex: token)
 */

import { ApiErrorResponse } from './types';
import { getToken } from '../storage/token';

/**
 * Tipo para função de interceptor de headers
 * Permite adicionar headers dinamicamente antes de cada requisição
 */
type HeaderInterceptor = () => Promise<Record<string, string>> | Record<string, string>;

/**
 * Lista de interceptors de headers
 * Cada interceptor pode adicionar headers automaticamente
 */
const headerInterceptors: HeaderInterceptor[] = [];

/**
 * Adiciona um interceptor de headers
 * 
 * @param interceptor - Função que retorna headers a serem adicionados
 * 
 * @example
 * ```ts
 * addHeaderInterceptor(async () => {
 *   const token = await getToken();
 *   return token ? { Authorization: `Bearer ${token}` } : {};
 * });
 * ```
 */
export function addHeaderInterceptor(interceptor: HeaderInterceptor): void {
  headerInterceptors.push(interceptor);
}

/**
 * Remove todos os interceptors de headers
 */
export function clearHeaderInterceptors(): void {
  headerInterceptors.length = 0;
}

/**
 * Trata erros de resposta da API
 * 
 * @param response - Resposta do fetch
 * @returns Promise com o JSON de erro ou lança exceção
 */
async function handleApiError(response: Response): Promise<ApiErrorResponse> {
  let errorData: ApiErrorResponse;
  
  try {
    errorData = await response.json();
  } catch {
    // Se não conseguir parsear JSON, cria um erro genérico
    errorData = {
      statusCode: response.status,
      message: `Erro ${response.status}: ${response.statusText}`,
      error: 'Erro desconhecido',
    };
  }
  
  return errorData;
}

/**
 * Faz uma requisição HTTP genérica
 * 
 * @param url - URL completa do endpoint
 * @param options - Opções do fetch (method, headers, body, etc)
 * @param requireAuth - Se true, adiciona token de autenticação automaticamente (padrão: false)
 * @returns Promise com a resposta parseada como JSON
 * @throws Error com mensagem descritiva em caso de falha
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> {
  try {
    // Coletar headers dos interceptors
    const interceptorHeaders: Record<string, string> = {};
    
    for (const interceptor of headerInterceptors) {
      const headers = await Promise.resolve(interceptor());
      Object.assign(interceptorHeaders, headers);
    }
    
    // Se requireAuth for true, adicionar token automaticamente
    if (requireAuth) {
      const token = await getToken();
      if (token) {
        interceptorHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...interceptorHeaders,
        ...options.headers, // Headers explícitos têm prioridade
      },
    });

    if (!response.ok) {
      const error = await handleApiError(response);
      
      // Se a mensagem for um array (validação), junta as mensagens
      const errorMessage = Array.isArray(error.message)
        ? error.message.join(', ')
        : error.message;
      
      throw new Error(errorMessage || `Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Se já é um Error, re-lança
    if (error instanceof Error) {
      // Melhorar mensagem de erro de rede
      if (error.message.includes('Network request failed') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')) {
        throw new Error(
          'Erro de conexão. Verifique:\n' +
          '1. Se o servidor está rodando\n' +
          '2. Se o IP da API está correto (não use localhost em dispositivos físicos)\n' +
          '3. Se o dispositivo está na mesma rede Wi-Fi'
        );
      }
      throw error;
    }
    
    // Erro de rede ou outro erro desconhecido
    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
}
