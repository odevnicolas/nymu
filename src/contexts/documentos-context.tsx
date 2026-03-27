/**
 * Context para gerenciar o estado global de documentos
 *
 * O endpoint de listagem só é chamado ao abrir um tipo específico (toque na lista)
 * ou ao puxar para atualizar (apenas tipos já consultados antes).
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  Document,
  DocumentType,
  listDocuments,
  logDocumentosRespostaErroBackend,
} from '@/lib/api/documentos';
import { getClientIdFromToken } from '@/lib/auth/client-id';
import { getToken, removeToken } from '@/lib/storage';
import { useAuthEventListener } from '@/hooks/use-auth-event';
import { useUser } from '@/contexts/user-context';

interface DocumentosContextData {
  documentos: Document[];
  /** Tipo em carregamento após toque (null = nenhum) */
  loadingTipo: DocumentType | null;
  isRefreshing: boolean;
  carregarDocumentosDoTipo: (type: DocumentType) => Promise<Document[]>;
  refreshDocumentos: () => Promise<void>;
}

const DocumentosContext = createContext<DocumentosContextData>({} as DocumentosContextData);

export function DocumentosProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [documentos, setDocumentos] = useState<Document[]>([]);
  const [loadingTipo, setLoadingTipo] = useState<DocumentType | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tiposConsultadosRef = useRef<Set<DocumentType>>(new Set());

  const carregarDocumentosDoTipo = useCallback(
    async (type: DocumentType): Promise<Document[]> => {
      const token = await getToken();
      if (!token) {
        return [];
      }

      setLoadingTipo(type);

      try {
        const userId = user?.id ?? getClientIdFromToken(token);
        const response = await listDocuments({ type, userId, quiet: true });
        const incoming = response.documents ?? [];

        setDocumentos((prev) => {
          const withoutType = prev.filter((d) => d.type !== type);
          return [...withoutType, ...incoming];
        });
        tiposConsultadosRef.current.add(type);

        if (response.error) {
          logDocumentosRespostaErroBackend('resposta de erro do backend (listagem por tipo)', type, response.error);
        }

        return incoming;
      } catch (error) {
        const is401 = error instanceof Error && error.message.includes('401');
        if (is401) {
          await removeToken();
        } else {
          console.error('Erro ao carregar documentos:', error);
        }
        return [];
      } finally {
        setLoadingTipo(null);
      }
    },
    [user?.id]
  );

  const refreshDocumentos = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      return;
    }
    const types = Array.from(tiposConsultadosRef.current);
    if (types.length === 0) {
      return;
    }

    setIsRefreshing(true);
    try {
      const userId = user?.id ?? getClientIdFromToken(token);
      const results = await Promise.all(
        types.map((type) => listDocuments({ type, userId, quiet: true }))
      );

      setDocumentos((prev) => {
        const withoutReloaded = prev.filter((d) => !types.includes(d.type));
        const merged = [...withoutReloaded];
        for (const r of results) {
          merged.push(...r.documents);
        }
        return merged;
      });

      const primeiroErro = results.find((r) => r.error)?.error;
      if (primeiroErro) {
        logDocumentosRespostaErroBackend(
          'resposta de erro do backend (atualizar lista)',
          types.join(', '),
          primeiroErro
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar documentos:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useAuthEventListener({
    onLogout: () => {
      setDocumentos([]);
      tiposConsultadosRef.current = new Set();
    },
  });

  return (
    <DocumentosContext.Provider
      value={{
        documentos,
        loadingTipo,
        isRefreshing,
        carregarDocumentosDoTipo,
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
