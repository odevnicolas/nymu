/**
 * Hook para gerenciar eventos de autenticação
 * 
 * Permite que componentes e contextos reajam a eventos de login/logout
 * sem dependência direta entre si.
 * 
 * Implementação compatível com React Native (sem Node events)
 */

import { useEffect, useCallback, useRef } from 'react';

// Tipo para callbacks de eventos
type EventCallback = () => void;

// Armazenamento de listeners (fora do componente para persistir entre re-renders)
const listeners: Record<string, EventCallback[]> = {
  login: [],
  logout: [],
};

/**
 * Hook para emitir eventos de autenticação
 * 
 * @example
 * ```ts
 * const { emitLogin, emitLogout } = useAuthEventEmitter();
 * 
 * // Após login bem-sucedido
 * emitLogin();
 * ```
 */
export function useAuthEventEmitter() {
  const emitLogin = useCallback(() => {
    listeners.login.forEach(callback => callback());
  }, []);

  const emitLogout = useCallback(() => {
    listeners.logout.forEach(callback => callback());
  }, []);

  return {
    emitLogin,
    emitLogout,
  };
}

/**
 * Hook para ouvir eventos de autenticação
 * 
 * @param onLogin - Callback executado quando usuário faz login
 * @param onLogout - Callback executado quando usuário faz logout
 * 
 * @example
 * ```ts
 * useAuthEventListener({
 *   onLogin: () => {
 *     // Recarregar dados após login
 *     refreshTomadores();
 *   },
 *   onLogout: () => {
 *     // Limpar dados ao fazer logout
 *     setTomadores([]);
 *   }
 * });
 * ```
 */
export function useAuthEventListener(props: {
  onLogin?: () => void;
  onLogout?: () => void;
}) {
  const { onLogin, onLogout } = props;
  const onLoginRef = useRef(onLogin);
  const onLogoutRef = useRef(onLogout);

  // Manter a referência atualizada
  useEffect(() => {
    onLoginRef.current = onLogin;
    onLogoutRef.current = onLogout;
  }, [onLogin, onLogout]);

  useEffect(() => {
    if (onLogin) {
      listeners.login.push(onLoginRef.current);
    }

    if (onLogout) {
      listeners.logout.push(onLogoutRef.current);
    }

    return () => {
      // Remover listeners quando o componente desmontar
      if (onLogin) {
        const index = listeners.login.indexOf(onLoginRef.current);
        if (index > -1) {
          listeners.login.splice(index, 1);
        }
      }

      if (onLogout) {
        const index = listeners.logout.indexOf(onLogoutRef.current);
        if (index > -1) {
          listeners.logout.splice(index, 1);
        }
      }
    };
  }, [onLogin, onLogout]);
}

/**
 * Remove todos os listeners (útil para testes ou reset)
 */
export function removeAllAuthListeners() {
  listeners.login = [];
  listeners.logout = [];
}
