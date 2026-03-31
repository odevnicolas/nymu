/**
 * API de Impostos/Tributos
 */

import { apiRequest } from './client';
import { apiEndpoints } from './config';
import { getToken } from '../storage';

/**
 * Status do imposto/tributo
 */
export type ImpostoStatus = 'PENDENTE' | 'VENCENDO' | 'VENCIDO' | 'PAGO';

/**
 * Tipo de imposto
 */
export type ImpostoType = 'DAS' | 'DARF' | 'IRPF' | 'ISS' | 'INSS' | 'OUTROS';

/**
 * Interface de imposto/tributo
 */
export interface Imposto {
  id: string;
  sigla: string;
  nome: string;
  dataVencimento: string;
  valor: number;
  status: ImpostoStatus;
  url?: string;
  type?: ImpostoType;
  description?: string;
  paidAt?: string;
}

/**
 * Resumo de impostos (card)
 */
export interface ImpostoSummary {
  totalImpostos: number;
  qtdBoletos: number;
  das: number;
  darf: number;
}

export interface TaxDocumentDownloadResult {
  fileBytes: ArrayBuffer;
  contentType: string;
  filename: string;
}

/**
 * Resposta de lista de impostos
 */
export interface ImpostosResponse {
  tributos: Imposto[];
}

/**
 * Resposta do resumo de impostos
 */
export interface ImpostosSummaryResponse {
  totalImpostos: number;
  qtdBoletos: number;
  das: number;
  darf: number;
}

/**
 * Lista impostos/tributos do usuário
 */
export async function listImpostos(params?: {
  mes?: number;
  ano?: number;
  status?: ImpostoStatus;
  type?: ImpostoType;
}): Promise<ImpostosResponse> {
  const queryParams = new URLSearchParams();

  if (params?.mes) queryParams.append('mes', params.mes.toString());
  if (params?.ano) queryParams.append('ano', params.ano.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.type) queryParams.append('type', params.type);

  const url = params
    ? `${apiEndpoints.taxes}?${queryParams}`
    : apiEndpoints.taxes;

  try {
    const response = await apiRequest<any>(
      url,
      { method: 'GET' },
      true // requireAuth
    );

    // A API pode retornar diretamente o array ou dentro de result/tributos
    const tributarios = response.tributos || response.result?.tributos || response || [];
    
    return { tributos: tributarios };
  } catch (error) {
    console.error('Erro na API de impostos:', error);
    return { tributos: [] };
  }
}

/**
 * Obtém o resumo de impostos (card)
 */
export async function getImpostosSummary(): Promise<ImpostoSummary> {
  try {
    const response = await apiRequest<any>(
      apiEndpoints.taxesSummary,
      { method: 'GET' },
      true // requireAuth
    );

    // A API pode retornar diretamente o objeto ou dentro de result
    return {
      totalImpostos: response.totalImpostos ?? response.result?.totalImpostos ?? 0,
      qtdBoletos: response.qtdBoletos ?? response.result?.qtdBoletos ?? 0,
      das: response.das ?? response.result?.das ?? 0,
      darf: response.darf ?? response.result?.darf ?? 0,
    };
  } catch (error) {
    console.error('Erro na API de summary:', error);
    return {
      totalImpostos: 0,
      qtdBoletos: 0,
      das: 0,
      darf: 0,
    };
  }
}

function getFilenameFromDisposition(contentDisposition: string | null, taxId: string): string {
  if (!contentDisposition) {
    return `tax-${taxId}.pdf`;
  }

  // Ex.: attachment; filename="das-documento.pdf"
  const simpleMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (simpleMatch?.[1]) {
    return simpleMatch[1];
  }

  // Ex.: filename*=UTF-8''das-documento.pdf
  const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1]);
    } catch {
      return encodedMatch[1];
    }
  }

  return `tax-${taxId}.pdf`;
}

/**
 * Baixa o documento do imposto (PDF/imagem) como binário.
 * Retorna null quando documento não está disponível (404).
 */
export async function downloadTaxDocument(taxId: string): Promise<TaxDocumentDownloadResult | null> {
  const token = await getToken();

  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const response = await fetch(apiEndpoints.taxDocument(taxId), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Não autenticado. Faça login novamente.');
    }
    if (response.status === 403) {
      throw new Error('Você não tem permissão para acessar este documento.');
    }
    throw new Error('Erro ao baixar documento do imposto.');
  }

  const fileBytes = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const filename = getFilenameFromDisposition(response.headers.get('content-disposition'), taxId);

  return { fileBytes, contentType, filename };
}

/**
 * Formata valor monetário em BRL.
 * O backend já retorna em reais (ex.: 293.32).
 */
export function formatCurrencyValue(value: number): string {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata data de vencimento
 */
export function formatVencimento(dataVencimento: string): string {
  const data = new Date(dataVencimento);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diffTime = data.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Vencido';
  } else if (diffDays === 0) {
    return 'Vence Hoje';
  } else if (diffDays === 1) {
    return 'Vence Amanhã';
  } else if (diffDays <= 5) {
    return `Vence em ${diffDays} dias`;
  } else {
    return `Vence em ${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  }
}

/**
 * Obtém a cor baseada no status
 */
export function getStatusColor(status: ImpostoStatus): string {
  switch (status) {
    case 'PENDENTE':
      return '#E5E7EB';
    case 'VENCENDO':
      return '#FEF3C7';
    case 'VENCIDO':
      return '#FEE2E2';
    case 'PAGO':
      return '#D1FAE5';
    default:
      return '#E5E7EB';
  }
}

/**
 * Obtém a primeira letra para o ícone
 */
export function getLetter(sigla: string): string {
  return sigla.charAt(0).toUpperCase();
}
