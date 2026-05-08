/**
 * Context para gerenciar o estado global de impostos/tributos
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuthEventListener } from '@/hooks/use-auth-event';
import { getToken, removeToken } from '@/lib/storage';
import { 
  Imposto, 
  ImpostoSummary, 
  listImpostos, 
  getImpostosSummary,
  ImpostoStatus
} from '@/lib/api/impostos';

interface ImpostosContextData {
  impostos: Imposto[];
  summary: ImpostoSummary | null;
  isLoading: boolean;
  refreshImpostos: () => Promise<void>;
  getImpostosByStatus: (status: ImpostoStatus) => Imposto[];
}

const ImpostosContext = createContext<ImpostosContextData>({} as ImpostosContextData);

export function ImpostosProvider({ children }: { children: React.ReactNode }) {
  const [impostos, setImpostos] = useState<Imposto[]>([]);
  const [summary, setSummary] = useState<ImpostoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshImpostos = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      return;
    }

    setIsLoading(true);

    try {
      // Buscar lista de impostos
      const response = await listImpostos();
      setImpostos(response.tributos || []);

      // Buscar resumo
      const summaryData = await getImpostosSummary();
      setSummary(summaryData);
    } catch (error) {
      const is401 = error instanceof Error && error.message.includes('401');
      if (is401) {
        await removeToken();
      } else {
        console.error('Erro ao carregar impostos:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar impostos ao montar o componente (se autenticado)
  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();
      if (token) {
        refreshImpostos();
      }
    };
    
    loadData();
  }, [refreshImpostos]);

  // Ouvir eventos de login para recarregar dados
  useAuthEventListener({
    onLogin: () => {
      refreshImpostos();
    },
    onLogout: () => {
      setImpostos([]);
      setSummary(null);
    },
  });

  const getImpostosByStatus = useCallback(
    (status: ImpostoStatus) => {
      return impostos.filter((imp) => imp.status === status);
    },
    [impostos]
  );

  return (
    <ImpostosContext.Provider
      value={{
        impostos,
        summary,
        isLoading,
        refreshImpostos,
        getImpostosByStatus,
      }}
    >
      {children}
    </ImpostosContext.Provider>
  );
}

export function useImpostos() {
  const context = useContext(ImpostosContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error('useImpostos deve ser usado dentro de ImpostosProvider');
  }

  return context;
}
