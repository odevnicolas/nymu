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
