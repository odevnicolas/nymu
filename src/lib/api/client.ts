/**
 * Cliente HTTP centralizado
 * 
 * Funções helper para chamadas HTTP usando fetch nativo
 * Suporta interceptors para adicionar headers automaticamente (ex: token)
 */

import { router } from 'expo-router';
import { getToken, removeToken } from '../storage/token';
import { clearUserCache } from '../storage/user-cache';

/**
 * Erro HTTP com metadados da resposta (útil para logs e diagnóstico).
 */
export class ApiHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'ApiHttpError';
  }
}

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
 * Lê o corpo da resposta de erro (JSON ou texto) para logs e ApiHttpError.body
 */
async function handleApiError(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      statusCode: response.status,
      message: response.statusText || 'Resposta vazia',
      error: 'empty_body',
    };
  }

  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return {
      statusCode: response.status,
      message: trimmed.slice(0, 500),
      error: 'non_json_response',
      rawBody: trimmed.length > 4000 ? `${trimmed.slice(0, 4000)}…` : trimmed,
    };
  }
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
      if (response.status === 401) {
        await removeToken();
        await clearUserCache();
        router.replace('/public/login');
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const error = await handleApiError(response);

      // Se a mensagem for um array (validação), junta as mensagens
      let errorMessage = Array.isArray(error.message)
        ? error.message.filter((m) => m != null && String(m).trim()).join(', ')
        : typeof error.message === 'string'
          ? error.message.trim()
          : '';

      if (!errorMessage && typeof error.error === 'string' && error.error.trim()) {
        errorMessage = error.error.trim();
      }

      if (!errorMessage) {
        errorMessage = JSON.stringify(error);
      }

      if (!errorMessage || errorMessage === '{}') {
        errorMessage = `Erro ${response.status}: ${response.statusText || 'Resposta inválida do servidor'}`;
      }

      throw new ApiHttpError(errorMessage, response.status, url, error as unknown);
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
