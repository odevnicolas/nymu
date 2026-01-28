/**
 * Configuração de interceptors para o cliente HTTP
 * 
 * Centraliza a configuração de interceptors que adicionam headers
 * automaticamente em todas as requisições
 */

import { addHeaderInterceptor } from './client';
import { getToken } from '../storage/token';

/**
 * Configura o interceptor de autenticação
 * 
 * Adiciona automaticamente o header Authorization com o token
 * em todas as requisições que precisarem de autenticação.
 * 
 * Deve ser chamado uma vez na inicialização do app.
 * 
 * @example
 * ```ts
 * // No _layout.tsx ou App.tsx
 * import { setupAuthInterceptor } from '@/lib/api/interceptors';
 * 
 * useEffect(() => {
 *   setupAuthInterceptor();
 * }, []);
 * ```
 */
export function setupAuthInterceptor(): void {
  addHeaderInterceptor(async () => {
    const token = await getToken();
    
    // Retorna header de autenticação se token existir
    // Caso contrário, retorna objeto vazio (não adiciona header)
    return token ? { Authorization: `Bearer ${token}` } : {};
  });
}
