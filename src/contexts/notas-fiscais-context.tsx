/**
 * Context para gerenciar o estado global de notas fiscais
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NotaFiscal, NotaFiscalStatus } from '@/lib/api/types';
import * as notasFiscaisAPI from '@/lib/api/notas-fiscais';
import { getToken, removeToken } from '@/lib/storage';
import { useAuthEventListener } from '@/hooks/use-auth-event';
import { useUser } from '@/contexts/user-context';

interface NotasFiscaisContextData {
  notasFiscais: NotaFiscal[];
  isLoading: boolean;
  solicitarNotaFiscal: (data: {
    tomadorId: string;
    localPrestacao: string;
    competencia: string;
    valor: number;
    descricao: string;
  }) => Promise<void>;
  getNotasByTomador: (tomadorId: string) => NotaFiscal[];
  getNotasByStatus: (status: NotaFiscalStatus) => NotaFiscal[];
  cancelarNotaFiscal: (id: string, reason: string) => Promise<void>;
  refreshNotasFiscais: () => Promise<void>;
}

const NotasFiscaisContext = createContext<NotasFiscaisContextData>({} as NotasFiscaisContextData);

export function NotasFiscaisProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carrega notas fiscais da API
   */
  const refreshNotasFiscais = useCallback(async () => {
    // Só carregar se houver token (usuário autenticado)
    const token = await getToken();
    if (!token) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await notasFiscaisAPI.listNotasFiscais();
      setNotasFiscais(response.invoices);
    } catch (error) {
      const is401 = error instanceof Error && error.message.includes('401');
      if (is401) {
        // Token expirado: limpar do storage silenciosamente
        await removeToken();
      } else {
        console.error('Erro ao carregar notas fiscais:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar notas fiscais ao montar o componente (se autenticado)
  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();
      if (token) {
        refreshNotasFiscais();
      }
    };
    
    loadData();
  }, [refreshNotasFiscais]);

  // Ouvir eventos de login para recarregar dados
  useAuthEventListener({
    onLogin: () => {
      refreshNotasFiscais();
    },
    onLogout: () => {
      setNotasFiscais([]);
    },
  });

  /**
   * Solicita uma nova nota fiscal via API
   */
  const solicitarNotaFiscal = useCallback(
    async (data: {
      tomadorId: string;
      localPrestacao: string;
      competencia: string;
      valor: number;
      descricao: string;
    }) => {
      if (!user?.id) {
        throw new Error('Usuário não identificado. Faça login novamente.');
      }

      setIsLoading(true);

      try {
        const newNotaFiscal = await notasFiscaisAPI.createNotaFiscal({
          userId: user.id,
          ...data,
        });
        setNotasFiscais(prev => [newNotaFiscal, ...prev]);
      } catch (error) {
        console.error('Erro ao solicitar nota fiscal:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  /**
   * Retorna notas fiscais de um tomador específico
   */
  const getNotasByTomador = useCallback(
    (tomadorId: string) => {
      return notasFiscais.filter(nf => nf.tomadorId === tomadorId);
    },
    [notasFiscais]
  );

  /**
   * Retorna notas fiscais por status
   */
  const getNotasByStatus = useCallback(
    (status: NotaFiscalStatus) => {
      return notasFiscais.filter(nf => nf.status === status);
    },
    [notasFiscais]
  );

  /**
   * Cancela uma nota fiscal via API
   */
  const cancelarNotaFiscal = useCallback(async (id: string, reason: string) => {
    setIsLoading(true);

    try {
      await notasFiscaisAPI.cancelNotaFiscal(id, reason);
      setNotasFiscais(prev =>
        prev.map(nf => (nf.id === id ? { ...nf, status: 'CANCELADA' as NotaFiscalStatus } : nf))
      );
    } catch (error) {
      console.error('Erro ao cancelar nota fiscal:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <NotasFiscaisContext.Provider
      value={{
        notasFiscais,
        isLoading,
        solicitarNotaFiscal,
        getNotasByTomador,
        getNotasByStatus,
        cancelarNotaFiscal,
        refreshNotasFiscais,
      }}
    >
      {children}
    </NotasFiscaisContext.Provider>
  );
}

/**
 * Hook para usar o contexto de notas fiscais
 */
export function useNotasFiscais() {
  const context = useContext(NotasFiscaisContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error('useNotasFiscais deve ser usado dentro de NotasFiscaisProvider');
  }

  return context;
}
