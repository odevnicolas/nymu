/**
 * API de Notas Fiscais
 */

import { apiRequest } from './client';
import { apiEndpoints } from './config';
import { NotaFiscal, SolicitarNotaFiscalFormData } from './types';

/**
 * Cria/solicita uma nova nota fiscal
 */
export async function createNotaFiscal(data: {
  tomadorId: string;
  localPrestacao: string;
  competencia: string;
  valor: number;
  descricao: string;
}): Promise<NotaFiscal> {
  const requestBody = {
    type: 'NFSE', // Padrão do sistema
    tomadorId: data.tomadorId,
    localPrestacao: data.localPrestacao,
    competencia: data.competencia, // Formato MM/YYYY
    valor: data.valor, // Em centavos
    descricao: data.descricao,
    issRetention: false,
    observations: '',
  };

  const response = await apiRequest<{
    status: string;
    message: string;
    invoice: any;
  }>(
    apiEndpoints.invoices,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    true
  );

  const invoice = response.invoice;
  
  // Normalizar datas e retornar NotaFiscal
  return {
    ...invoice,
    createdAt: invoice.createdAt ? new Date(invoice.createdAt) : new Date(),
    updatedAt: invoice.updatedAt ? new Date(invoice.updatedAt) : new Date(),
    authorizedAt: invoice.authorizedAt ? new Date(invoice.authorizedAt) : undefined,
    cancelledAt: invoice.cancelledAt ? new Date(invoice.cancelledAt) : undefined,
  };
}

/**
 * Lista notas fiscais do usuário
 */
export async function listNotasFiscais(params?: {
  page?: number;
  limit?: number;
  tomadorId?: string;
  competencia?: string;
  status?: string;
}): Promise<{
  invoices: NotaFiscal[];
  total: number;
  page: number;
  limit: number;
}> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.tomadorId) queryParams.append('tomadorId', params.tomadorId);
  if (params?.competencia) queryParams.append('competencia', params.competencia);
  if (params?.status) queryParams.append('status', params.status);

  const url = params ? `${apiEndpoints.invoices}?${queryParams}` : apiEndpoints.invoices;

  const response = await apiRequest<{
    status: string;
    result: {
      invoices: any[];
      page: number;
      limit: number;
      total: number;
    };
  }>(
    url,
    {
      method: 'GET',
    },
    true
  );

  // Normalizar datas
  const invoices = (response.result.invoices || []).map((invoice: any) => ({
    ...invoice,
    createdAt: invoice.createdAt ? new Date(invoice.createdAt) : new Date(),
    updatedAt: invoice.updatedAt ? new Date(invoice.updatedAt) : new Date(),
    authorizedAt: invoice.authorizedAt ? new Date(invoice.authorizedAt) : undefined,
    cancelledAt: invoice.cancelledAt ? new Date(invoice.cancelledAt) : undefined,
  }));

  return {
    invoices,
    total: response.result.total || 0,
    page: response.result.page || 1,
    limit: response.result.limit || 20,
  };
}

/**
 * Obtém uma nota fiscal por ID
 */
export async function getNotaFiscalById(id: string): Promise<NotaFiscal> {
  const response = await apiRequest<{
    status: string;
    result: any;
  }>(
    `${apiEndpoints.invoices}/${id}`,
    {
      method: 'GET',
    },
    true
  );

  const invoice = response.result;

  // Normalizar datas
  return {
    ...invoice,
    createdAt: invoice.createdAt ? new Date(invoice.createdAt) : new Date(),
    updatedAt: invoice.updatedAt ? new Date(invoice.updatedAt) : new Date(),
    authorizedAt: invoice.authorizedAt ? new Date(invoice.authorizedAt) : undefined,
    cancelledAt: invoice.cancelledAt ? new Date(invoice.cancelledAt) : undefined,
  };
}

/**
 * Cancela uma nota fiscal
 */
export async function cancelNotaFiscal(
  id: string,
  reason: string
): Promise<{ status: string; message: string }> {
  return apiRequest<{ status: string; message: string }>(
    `${apiEndpoints.invoices}/${id}/cancel`,
    {
      method: 'POST',
      body: JSON.stringify({ reason }),
    },
    true
  );
}

/**
 * Obtém URL do XML da nota fiscal
 */
export function getXmlUrl(id: string): string {
  return `${apiEndpoints.invoices}/${id}/xml`;
}

/**
 * Obtém URL do PDF da nota fiscal
 */
export function getPdfUrl(id: string): string {
  return `${apiEndpoints.invoices}/${id}/pdf`;
}

/**
 * Download do XML da nota fiscal
 */
export async function downloadXml(id: string): Promise<Blob> {
  const response = await fetch(getXmlUrl(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${await getStoredToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao baixar XML');
  }

  return response.blob();
}

/**
 * Download do PDF da nota fiscal
 */
export async function downloadPdf(id: string): Promise<Blob> {
  const response = await fetch(getPdfUrl(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${await getStoredToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao baixar PDF');
  }

  return response.blob();
}

// Helper para obter token
async function getStoredToken(): Promise<string> {
  const { getToken } = await import('../storage/token');
  return (await getToken()) || '';
}
