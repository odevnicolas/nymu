/**
 * API de Documentos
 */

import { apiRequest } from './client';
import { apiEndpoints } from './config';

/**
 * Tipos de documento disponíveis
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
  | 'CNDM';

/**
 * Interface de documento
 */
export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  description?: string;
  fileUrl?: string;
  uploadedAt?: string;
  expiresAt?: string;
  isClientDoc: boolean;
}

/**
 * Resposta da API de documentos
 */
export interface DocumentsResponse {
  documents: Document[];
}

/**
 * Lista documentos com filtro opcional por tipo
 */
export async function listDocuments(
  type?: DocumentType,
  isClientDoc?: boolean
): Promise<DocumentsResponse> {
  const params = new URLSearchParams();

  if (type) {
    params.append('type', type);
  }

  if (isClientDoc !== undefined) {
    params.append('isClientDoc', isClientDoc.toString());
  }

  const url = params.toString()
    ? `${apiEndpoints.documents}?${params}`
    : apiEndpoints.documents;

  try {
    const response = await apiRequest<any>(
      url,
      { method: 'GET' },
      true // requireAuth
    );

    // A API pode retornar diretamente o array ou dentro de result/documents
    const documents = response.documents || response.result?.documents || response || [];

    return { documents };
  } catch (error) {
    // Silencioso para 404 (endpoint pode não existir ainda)
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('404')) {
      console.warn('Erro na API de documentos:', error);
    }
    return { documents: [] };
  }
}

/**
 * Mapeamento de tipos de documento para descrição em português
 */
export const documentTypeLabels: Record<DocumentType, string> = {
  CNPJ: 'CNPJ',
  CNH: 'Carteira Nacional de Habilitação',
  CPF: 'CPF',
  CRM: 'CRM (Conselho Regional de Medicina)',
  CS: 'Certificado de Segurança',
  ECNPJ: 'E-CNPJ',
  IM: 'Inscrição Municipal',
  RG: 'Registro Geral',
  SN: 'Número de Série',
  TE: 'Título de Eleitor',
  TERMO: 'Termo',
  CNDTF: 'Certidão Negativa de Débitos Tributários Federais',
  CNDT: 'Certidão Negativa de Débitos Trabalhistas',
  CNDE: 'Certidão Negativa de Débitos Estaduais',
  CRF: 'Certificado de Regularidade do FGTS',
  CNDM: 'Certidão Negativa de Débitos Municipais',
};

/**
 * Categorias de documentos
 */
export const documentCategories = {
  EMPRESA: ['CNPJ', 'CS', 'ECNPJ', 'IM', 'SN', 'TERMO'],
  PESSOA_FISICA: ['CNH', 'CPF', 'CRM', 'RG', 'TE'],
  CERTIDOES: ['CNDTF', 'CNDT', 'CNDE', 'CRF', 'CNDM'],
} as const;
