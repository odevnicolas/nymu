/**
 * Contexto para gerenciar dados do usuário autenticado
 *
 * Centraliza o estado do usuário em todo o app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProfile } from '@/lib/api/auth';
import { User } from '@/lib/api/types';
import { getToken, removeToken } from '@/lib/storage';
import { getUserCache, saveUserCache, clearUserCache } from '@/lib/storage/user-cache';
import { useAuthEventEmitter } from '@/hooks/use-auth-event';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { emitLogout } = useAuthEventEmitter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      // Carregar cache local primeiro — UI instantânea
      const cached = await getUserCache();
      if (cached) {
        setUser(cached);
        setIsLoading(false);
      }

      // Sincronizar com a API em background
      try {
        const fresh = await getProfile();
        setUser(fresh);
        await saveUserCache(fresh);
      } catch (error) {
        // 401 é tratado pelo client.ts (limpa token + cache + redireciona)
        // Outros erros: mantém o cache existente
        if (!cached) {
          console.warn('Erro ao carregar usuário:', error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      saveUserCache(newUser);
    } else {
      clearUserCache();
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      await clearUserCache();
      setUser(null);
      emitLogout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, setUser: handleSetUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}
