/**
 * API de Documentos
 *
 * GET /documents?type=TIPO&userId=ID — resposta: { status: "Ok", result: [...] }
 */

import { ApiHttpError, apiRequest } from './client';
import { apiEndpoints } from './config';

/**
 * Tipos de documento disponíveis (alinhados ao backend)
 */
export type DocumentType =
  | 'CNPJ'
  | 'CNH'
  | 'CPF'
  | 'CRM'
  | 'CS'
  | 'ECNPJ'
  | 'IM'
  | 'RG'
  | 'SN'
  | 'TE'
  | 'TERMO'
  | 'CNDTF'
  | 'CNDT'
  | 'CNDE'
  | 'CRF'
  | 'CNDM'
  | 'OUTROS_CLIENTE';

/** Lista de todos os tipos para consultas agregadas */
export const ALL_DOCUMENT_TYPES: readonly DocumentType[] = [
  'CNPJ',
  'CNH',
  'CPF',
  'CRM',
  'CS',
  'ECNPJ',
  'IM',
  'RG',
  'SN',
  'TE',
  'TERMO',
  'CNDTF',
  'CNDT',
  'CNDE',
  'CRF',
  'CNDM',
  'OUTROS_CLIENTE',
] as const;

/**
 * Interface de documento (normalizada a partir da API)
 */
export interface Document {
  id: string;
  type: DocumentType;
  /** Nome do arquivo (ex.: documento.pdf) */
  name: string;
  filename?: string;
  /** URL ou data URL (ex.: data:image/png;base64,...) */
  url?: string;
  fileUrl?: string;
  uploadedAt?: string;
  isClientDoc: boolean;
}

/**
 * Resposta da API de documentos
 */
export interface DocumentsResponse {
  documents: Document[];
  /** Preenchido quando a requisição falhou (útil para diagnóstico) */
  error?: ApiHttpError;
}

export interface ListDocumentsParams {
  type?: DocumentType;
  userId?: string;
  isClientDoc?: boolean;
  /** Se true, não emite `console.warn` (usado em listAllDocumentsForClient) */
  quiet?: boolean;
}

function extractDocumentsArray(response: unknown): unknown[] {
  if (!response || typeof response !== 'object') {
    return [];
  }
  const r = response as Record<string, unknown>;
  if (Array.isArray(r.result)) {
    return r.result;
  }
  if (Array.isArray(r.documents)) {
    return r.documents;
  }
  if (Array.isArray(response)) {
    return response;
  }
  const nested = r.result as Record<string, unknown> | undefined;
  if (nested && Array.isArray(nested.documents)) {
    return nested.documents;
  }
  return [];
}

/**
 * Log estruturado para inspecionar no Metro: status HTTP, URL e corpo retornado pelo backend.
 */
export function logDocumentosRespostaErroBackend(
  contexto: string,
  tipoOuRotulo: string,
  err: ApiHttpError
): void {
  console.warn(`[documentos] ${contexto}`, {
    tipo: tipoOuRotulo,
    statusHTTP: err.status,
    url: err.url,
    mensagem: err.message,
    corpoQueOVoltouDoBackend: err.body,
  });
}

function normalizeDocument(raw: Record<string, unknown>): Document {
  const filename = (raw.filename as string) || (raw.name as string) || '';
  const url = (raw.url as string) || (raw.fileUrl as string);
  return {
    id: String(raw.id ?? ''),
    type: raw.type as DocumentType,
    name: filename || String(raw.type ?? ''),
    filename: filename || undefined,
    url,
    fileUrl: url,
    uploadedAt: raw.uploadedAt as string | undefined,
    isClientDoc: Boolean(raw.isClientDoc),
  };
}

/**
 * Lista documentos
 * Ex.: GET /documents?type=RG&isClientDoc=false&userId=...
 */
export async function listDocuments(
  params?: ListDocumentsParams
): Promise<DocumentsResponse> {
  const search = new URLSearchParams();

  if (params?.type) {
    search.append('type', params.type);
  }
  search.append('isClientDoc', String(params?.isClientDoc ?? false));
  if (params?.userId) {
    search.append('userId', params.userId);
  }

  const url = search.toString()
    ? `${apiEndpoints.documents}?${search}`
    : apiEndpoints.documents;

  try {
    const response = await apiRequest<Record<string, unknown>>(
      url,
      { method: 'GET' },
      true
    );

    const rawList = extractDocumentsArray(response);
    const documents = rawList
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map(normalizeDocument);

    return { documents };
  } catch (error) {
    const httpError = error instanceof ApiHttpError ? error : undefined;
    if (!params?.quiet) {
      if (httpError) {
        console.warn('[documentos] falha na requisição', {
          url: httpError.url,
          status: httpError.status,
          message: httpError.message,
          body: httpError.body,
        });
      } else {
        console.warn('[documentos] falha na requisição', {
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
    return { documents: [], ...(httpError ? { error: httpError } : {}) };
  }
}

/**
 * Carrega documentos de todos os tipos e une por `id` (evita duplicatas).
 * Usa o endpoint por tipo: ?type=...&userId=...
 */
export async function listAllDocumentsForClient(userId?: string): Promise<DocumentsResponse> {
  const results = await Promise.all(
    ALL_DOCUMENT_TYPES.map((type) => listDocuments({ type, userId, quiet: true }))
  );
  const byId = new Map<string, Document>();
  for (const { documents } of results) {
    for (const doc of documents) {
      if (doc.id) {
        byId.set(doc.id, doc);
      }
    }
  }
  const merged = Array.from(byId.values());
  const sampleErr = results.find((r) => r.error)?.error;
  if (merged.length === 0 && sampleErr) {
    console.warn('[documentos] nenhum documento carregado — resumo do erro da API', {
      url: sampleErr.url,
      status: sampleErr.status,
      message: sampleErr.message,
      body: sampleErr.body,
      tip:
        sampleErr.status === 404
          ? 'Rota não encontrada: confira o path de documentos no backend e apiEndpoints.documents em config.ts.'
          : undefined,
    });
  }
  return { documents: merged };
}

/**
 * Mapeamento de tipos de documento para descrição em português
 */
export const documentTypeLabels: Record<DocumentType, string> = {
  CNPJ: 'Cartão CNPJ',
  CNH: 'Carteira de Habilitação',
  CPF: 'Documento CPF',
  CRM: 'Registro Médico (CRM)',
  CS: 'Contrato Social',
  ECNPJ: 'e-CNPJ (certificado digital)',
  IM: 'Inscrição Municipal',
  RG: 'RG',
  SN: 'SN',
  TE: 'TE',
  TERMO: 'Termo',
  CNDTF: 'CND Tributos Federais',
  CNDT: 'CND Trabalhista',
  CNDE: 'CND Estadual',
  CRF: 'Certificado de Regularidade do FGTS',
  CNDM: 'CND Municipal',
  OUTROS_CLIENTE: 'Outros documentos de cliente',
};

/**
 * Categorias de documentos
 */
export const documentCategories = {
  EMPRESA: ['CNPJ', 'CS', 'ECNPJ', 'IM', 'SN', 'TERMO'],
  PESSOA_FISICA: ['CNH', 'CPF', 'CRM', 'RG', 'TE'],
  CERTIDOES: ['CNDTF', 'CNDT', 'CNDE', 'CRF', 'CNDM'],
  OUTROS: ['OUTROS_CLIENTE'],
} as const;
