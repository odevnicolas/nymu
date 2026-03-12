/**
 * Context para gerenciar o estado global de documentos
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Document, DocumentType, listDocuments } from '@/lib/api/documentos';
import { getToken, removeToken } from '@/lib/storage';
import { useAuthEventListener } from '@/hooks/use-auth-event';

interface DocumentosContextData {
  documentos: Document[];
  isLoading: boolean;
  refreshDocumentos: (type?: DocumentType) => Promise<void>;
}

const DocumentosContext = createContext<DocumentosContextData>({} as DocumentosContextData);

export function DocumentosProvider({ children }: { children: React.ReactNode }) {
  const [documentos, setDocumentos] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshDocumentos = useCallback(async (type?: DocumentType) => {
    const token = await getToken();
    if (!token) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await listDocuments(type);
      setDocumentos(response.documents || []);
    } catch (error) {
      const is401 = error instanceof Error && error.message.includes('401');
      if (is401) {
        await removeToken();
      } else {
        console.error('Erro ao carregar documentos:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();
      if (token) {
        refreshDocumentos();
      }
    };

    loadData();
  }, [refreshDocumentos]);

  useAuthEventListener({
    onLogin: () => {
      refreshDocumentos();
    },
    onLogout: () => {
      setDocumentos([]);
    },
  });

  return (
    <DocumentosContext.Provider
      value={{
        documentos,
        isLoading,
        refreshDocumentos,
      }}
    >
      {children}
    </DocumentosContext.Provider>
  );
}

export function useDocumentos() {
  const context = useContext(DocumentosContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error('useDocumentos deve ser usado dentro de DocumentosProvider');
  }

  return context;
}
