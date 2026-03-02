/**
 * Context para gerenciar o estado global de tomadores de serviço
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Tomador, TomadorFormData } from '@/lib/api/types';
import * as tomadoresAPI from '@/lib/api/tomadores';
import { getToken } from '@/lib/storage';

interface TomadoresContextData {
  tomadores: Tomador[];
  isLoading: boolean;
  addTomador: (data: TomadorFormData) => Promise<void>;
  removeTomador: (id: string) => Promise<void>;
  updateTomador: (id: string, data: Partial<TomadorFormData>) => Promise<void>;
  getTomadoresByTipo: (tipo: 'PF' | 'PJ') => Tomador[];
  refreshTomadores: () => Promise<void>;
}

const TomadoresContext = createContext<TomadoresContextData>({} as TomadoresContextData);

export function TomadoresProvider({ children }: { children: React.ReactNode }) {
  const [tomadores, setTomadores] = useState<Tomador[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carrega tomadores da API
   */
  const refreshTomadores = useCallback(async () => {
    // Só carregar se houver token (usuário autenticado)
    const token = await getToken();
    if (!token) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await tomadoresAPI.listTomadores();
      setTomadores(response.tomadores);
    } catch (error) {
      console.error('Erro ao carregar tomadores:', error);
      // Não lançar erro para não quebrar o app
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar tomadores ao montar o componente (se autenticado)
  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();
      if (token) {
        refreshTomadores();
      }
    };
    
    loadData();
  }, []);

  /**
   * Adiciona um novo tomador via API
   */
  const addTomador = useCallback(async (data: TomadorFormData) => {
    setIsLoading(true);
    
    try {
      const response = await tomadoresAPI.createTomador(data);
      setTomadores(prev => [response.tomador, ...prev]);
    } catch (error) {
      // Re-lançar o erro para ser tratado no componente
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Remove um tomador via API
   */
  const removeTomador = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      await tomadoresAPI.deleteTomador(id);
      setTomadores(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao remover tomador:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza um tomador existente via API
   */
  const updateTomador = useCallback(async (
    id: string,
    data: Partial<TomadorFormData>
  ) => {
    setIsLoading(true);
    
    try {
      const updatedTomador = await tomadoresAPI.updateTomador(id, data);
      setTomadores(prev => prev.map(t => 
        t.id === id ? updatedTomador : t
      ));
    } catch (error) {
      console.error('Erro ao atualizar tomador:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Retorna tomadores filtrados por tipo (PF ou PJ)
   */
  const getTomadoresByTipo = useCallback((tipo: 'PF' | 'PJ') => {
    return tomadores.filter(t => t.tipo === tipo);
  }, [tomadores]);

  return (
    <TomadoresContext.Provider
      value={{
        tomadores,
        isLoading,
        addTomador,
        removeTomador,
        updateTomador,
        getTomadoresByTipo,
        refreshTomadores,
      }}
    >
      {children}
    </TomadoresContext.Provider>
  );
}

/**
 * Hook para usar o contexto de tomadores
 */
export function useTomadores() {
  const context = useContext(TomadoresContext);
  
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useTomadores deve ser usado dentro de TomadoresProvider');
  }
  
  return context;
}
