/**
 * Tipos TypeScript para requisições e respostas da API
 */

/**
 * Resposta de erro padrão da API
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

/**
 * Dados do usuário retornados pela API
 * 
 * O backend pode retornar "nome" ou "name"
 */
export interface User {
  id: string;
  name: string;
  nome?: string; // Campo alternativo do backend
  email: string;
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  foto?: string;
  avatar?: string; // Alias para foto
}

/**
 * Resposta de sucesso do login
 * 
 * O backend deve retornar:
 * {
 *   "result": {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "user": {
 *       "id": "123",
 *       "name": "Luan Robson",
 *       "email": "luan@exemplo.com",
 *       "cpf": "123.456.789-00",
 *       "avatar": "https://..." // opcional
 *     }
 *   }
 * }
 */
export interface LoginResponse {
  result: {
    token: string;
    user: User;
  };
}

/**
 * Payload para requisição de login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Resposta de sucesso da validação de código
 */
export interface ValidateCodeResponse {
  success: boolean;
  message?: string;
}

/**
 * Payload para requisição de validação de código
 */
export interface ValidateCodeRequest {
  email: string;
  code: string;
}

/**
 * Resposta de sucesso do registro
 */
export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Payload para requisição de registro
 */
export interface RegisterRequest {
  email: string;
  password: string;
  cpf: string;
  code?: string;
}

/**
 * Payload para atualização de perfil
 * 
 * O backend espera os campos diretamente, sem wrapper "user"
 */
export interface UpdateProfileRequest {
  nome?: string;
  telefone?: string;
  foto?: string;
}

/**
 * Resposta de atualização de perfil
 */
export interface UpdateProfileResponse {
  user: User;
  message?: string;
}

/**
 * Payload para mudança de senha
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Resposta de mudança de senha
 */
export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

/**
 * Endereço do tomador
 */
export interface Endereco {
  logradouro: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
}

/**
 * Tomador de serviço (Pessoa Física ou Jurídica)
 * Estrutura retornada pela API (campos de endereço diretos)
 */
export interface Tomador {
  id: string;
  tipo: 'PF' | 'PJ';
  nome: string; // Nome completo (PF) ou Razão Social (PJ)
  documento: string; // CPF (PF) ou CNPJ (PJ)
  inscricaoMunicipal?: string; // Apenas para PJ
  // Campos de endereço (diretos, não aninhados)
  logradouro: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone?: string;
  createdAt: Date;
}

/**
 * Dados do formulário de cadastro de tomador
 */
export interface TomadorFormData {
  tipo: 'PF' | 'PJ';
  nome: string;
  documento: string;
  inscricaoMunicipal?: string;
  logradouro: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone?: string;
}


/**
 * Status da nota fiscal (alinhado com backend - InvoiceStatus enum)
 */
export type NotaFiscalStatus = 
  | 'PROCESSANDO' 
  | 'EMITIDA' 
  | 'CANCELADA' 
  | 'ERRO' 
  | 'SIMULATED';

/**
 * Nota Fiscal (alinhado com InvoiceResponseDto do backend)
 */
export interface NotaFiscal {
  id: string;
  type: 'NFE' | 'NFSE';
  userId: string;
  tomadorId?: string;
  
  // Dados do serviço
  serviceDescription: string;
  serviceValue: number; // valor em centavos
  issRetention: boolean;
  observations?: string;
  
  // Campos específicos do sistema
  localPrestacao?: string;
  competencia?: string; // formato: "MM/YYYY"
  
  // Dados desnormalizados do tomador
  tomadorNome?: string;
  tomadorDocumento?: string;
  
  // Status e controle
  status: NotaFiscalStatus;
  emissionMode: 'PRODUCTION' | 'SIMULATED';
  
  // Dados da nota emitida
  invoiceNumber?: string;
  series?: string;
  accessKey?: string;
  verificationCode?: string;
  protocol?: string;
  xmlPath?: string;
  pdfPath?: string;
  municipality?: string;
  ufCode?: string;
  sefazMessage?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  authorizedAt?: Date;
  cancelledAt?: Date;
}

/**
 * Dados do formulário de solicitação de nota fiscal
 */
export interface SolicitarNotaFiscalFormData {
  localPrestacao: string;
  competencia: string; // formato: "MM/YYYY"
  valor: number; // valor em centavos
  descricao: string;
}

/**
 * Payload para solicitação de nota fiscal
 */
export interface SolicitarNotaFiscalRequest {
  tomadorId: string;
  localPrestacao: string;
  competencia: string; // formato: "MM/YYYY"
  valor: number; // valor em centavos
  descricao: string;
}

/**
 * Resposta de solicitação de nota fiscal
 */
export interface SolicitarNotaFiscalResponse {
  notaFiscal: NotaFiscal;
  message?: string;
}
