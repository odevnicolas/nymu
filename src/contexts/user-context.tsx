/**
 * Contexto para gerenciar dados do usuário autenticado
 * 
 * Centraliza o estado do usuário em todo o app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/api/types';
import { getToken, removeToken } from '@/lib/storage';

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

  // Carregar dados do usuário do storage ao inicializar
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      // TODO: Implementar leitura do storage quando necessário
      // Por enquanto, o usuário será definido apenas após login
      // const storedUser = await getUserFromStorage();
      // if (storedUser) setUser(storedUser);
    } catch (error) {
      console.warn('Erro ao carregar usuário do storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, logout }}>
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
