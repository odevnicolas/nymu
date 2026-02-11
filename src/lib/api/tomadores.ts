/**
 * API de Tomadores
 */

import { apiRequest } from './client';
import { apiEndpoints } from './config';
import { Tomador, TomadorFormData } from './types';

/**
 * Cria um novo tomador
 */
export async function createTomador(data: TomadorFormData): Promise<{ tomador: Tomador; message?: string }> {
  const requestBody = {
    tipo: data.tipo,
    nome: data.nome,
    documento: data.documento, // Já limpo pelo frontend
    inscricaoMunicipal: data.inscricaoMunicipal,
    logradouro: data.logradouro,
    numero: data.numero,
    cep: data.cep, // Já limpo pelo frontend
    bairro: data.bairro,
    cidade: data.cidade,
    uf: data.uf.toUpperCase(),
    telefone: data.telefone, // Já limpo pelo frontend
  };

  return apiRequest<{ tomador: Tomador; message?: string }>(
    apiEndpoints.tomadores,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    },
    true // requireAuth
  );
}

/**
 * Lista tomadores do usuário
 */
export async function listTomadores(params?: {
  page?: number;
  limit?: number;
  tipo?: 'PF' | 'PJ';
}): Promise<{
  tomadores: Tomador[];
  total: number;
  page: number;
  limit: number;
}> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.tipo) queryParams.append('tipo', params.tipo);

  const url = params ? `${apiEndpoints.tomadores}?${queryParams}` : apiEndpoints.tomadores;

  return apiRequest<{
    tomadores: Tomador[];
    total: number;
    page: number;
    limit: number;
  }>(
    url,
    {
      method: 'GET',
    },
    true
  );
}

/**
 * Obtém um tomador por ID
 */
export async function getTomadorById(id: string): Promise<Tomador> {
  return apiRequest<Tomador>(
    `${apiEndpoints.tomadores}/${id}`,
    {
      method: 'GET',
    },
    true
  );
}

/**
 * Atualiza um tomador
 */
export async function updateTomador(
  id: string,
  data: Partial<TomadorFormData>
): Promise<Tomador> {
  const requestBody: Record<string, any> = {};

  if (data.nome) requestBody.nome = data.nome;
  if (data.documento) requestBody.documento = data.documento;
  if (data.inscricaoMunicipal !== undefined) requestBody.inscricaoMunicipal = data.inscricaoMunicipal;
  if (data.logradouro) requestBody.logradouro = data.logradouro;
  if (data.numero) requestBody.numero = data.numero;
  if (data.cep) requestBody.cep = data.cep;
  if (data.bairro) requestBody.bairro = data.bairro;
  if (data.cidade) requestBody.cidade = data.cidade;
  if (data.uf) requestBody.uf = data.uf.toUpperCase();
  if (data.telefone !== undefined) requestBody.telefone = data.telefone;

  return apiRequest<Tomador>(
    `${apiEndpoints.tomadores}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    },
    true
  );
}

/**
 * Remove um tomador
 */
export async function deleteTomador(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `${apiEndpoints.tomadores}/${id}`,
    {
      method: 'DELETE',
    },
    true
  );
}
