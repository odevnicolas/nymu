/**
 * Funções de autenticação
 * 
 * Centraliza todas as chamadas relacionadas à autenticação
 */

import { apiRequest } from './client';
import { API_URL, apiEndpoints } from './config';
import {
    ChangePasswordRequest,
    ChangePasswordResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    User,
    ValidateCodeRequest,
    ValidateCodeResponse,
} from './types';

/**
 * Faz login do usuário
 * 
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Promise com o token JWT e dados do usuário
 * @throws Error se as credenciais forem inválidas ou houver erro de conexão
 * 
 * @example
 * ```ts
 * try {
 *   const { token, user } = await login('usuario@exemplo.com', 'senha123');
 *   // Salvar token e usar dados do usuário
 * } catch (error) {
 *   console.error('Erro no login:', error.message);
 * }
 * ```
 */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const body: LoginRequest = { email, password };
  
  const response = await loginRequest(body);
  
  // Normalizar: se vier "nome" do backend, mapear para "name"
  const user = response.result.user;
  if (user.nome && !user.name) {
    user.name = user.nome;
  }
  // Normalizar: se vier "foto" do backend, mapear para "avatar"
  if (user.foto && !user.avatar) {
    user.avatar = user.foto;
  }
  
  return {
    token: response.result.token,
    user,
  };
}

/**
 * Requisição de login (retorna resposta completa)
 * 
 * @param body - Payload com email e senha
 * @returns Promise com a resposta completa do login
 */
export async function loginRequest(body: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(apiEndpoints.login, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  
  return response;
}

/**
 * Valida código de verificação
 * 
 * @param email - Email do usuário
 * @param code - Código de verificação
 * @returns Promise com a resposta de validação
 * @throws Error se o código for inválido ou expirado
 * 
 * @example
 * ```ts
 * try {
 *   const result = await validateCode('usuario@exemplo.com', '123456');
 *   // Código válido
 * } catch (error) {
 *   console.error('Código inválido:', error.message);
 * }
 * ```
 */
export async function validateCode(
  email: string,
  code: string
): Promise<ValidateCodeResponse> {
  const body: ValidateCodeRequest = { email, code };
  
  return apiRequest<ValidateCodeResponse>(apiEndpoints.validateCode, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Registra um novo usuário
 * 
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @param cpf - CPF do usuário
 * @param code - Código de verificação (opcional)
 * @returns Promise com a resposta de registro
 * @throws Error se houver erro no registro
 * 
 * @example
 * ```ts
 * try {
 *   const result = await register(
 *     'usuario@exemplo.com',
 *     'senha123',
 *     '123.456.789-00',
 *     '123456' // opcional
 *   );
 *   // Usuário registrado com sucesso
 * } catch (error) {
 *   console.error('Erro no registro:', error.message);
 * }
 * ```
 */
export async function register(
  email: string,
  password: string,
  cpf: string,
  code?: string
): Promise<RegisterResponse> {
  const body: RegisterRequest = { email, password, cpf, code };
  
  return apiRequest<RegisterResponse>(apiEndpoints.register, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Atualiza o perfil do usuário
 * 
 * @param profileData - Dados do perfil para atualizar
 * @returns Promise com os dados atualizados do usuário
 * @throws Error se houver erro na atualização
 * 
 * @example
 * ```ts
 * try {
 *   const updatedUser = await updateProfile({
 *     user: {
 *       id: '123',
 *       email: 'novo@email.com',
 *       nome: 'Novo Nome',
 *       telefone: '(71) 99022-12394',
 *     }
 *   });
 *   // Perfil atualizado
 * } catch (error) {
 *   console.error('Erro ao atualizar perfil:', error.message);
 * }
 * ```
 */
export async function updateProfile(
  profileData: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  // O backend espera os campos diretamente, sem wrapper "user"
  const response = await apiRequest<UpdateProfileResponse>(apiEndpoints.updateProfile, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }, true); // requireAuth = true
  
  // Normalizar: se vier "nome" do backend, mapear para "name"
  if (response.user.nome && !response.user.name) {
    response.user.name = response.user.nome;
  }
  
  // Normalizar foto: se vier "foto" do backend, mapear para "avatar"
  // Se a foto for um caminho relativo, construir a URL completa
  if (response.user.foto) {
    const fotoOriginal = response.user.foto;
    
    // Se já for uma URL completa (http:// ou https://), usar como está
    if (fotoOriginal.startsWith('http://') || fotoOriginal.startsWith('https://')) {
      response.user.avatar = fotoOriginal;
    } else if (fotoOriginal.startsWith('data:image')) {
      // Se for base64, usar como está
      response.user.avatar = fotoOriginal;
    } else {
      // Se for um caminho relativo, construir URL completa
      // Remover barra inicial se houver
      const fotoPath = fotoOriginal.startsWith('/') 
        ? fotoOriginal.substring(1) 
        : fotoOriginal;
      response.user.avatar = `${API_URL}/${fotoPath}`;
    }
    // Garantir que foto também tenha o valor normalizado
    response.user.foto = response.user.avatar;
  } else if (response.user.avatar) {
    // Se vier avatar mas não foto, copiar para foto
    response.user.foto = response.user.avatar;
  }
  
  return response;
}

/**
 * Muda a senha do usuário
 * 
 * @param currentPassword - Senha atual
 * @param newPassword - Nova senha
 * @returns Promise com resposta de sucesso
 * @throws Error se a senha atual estiver incorreta ou houver erro
 * 
 * @example
 * ```ts
 * try {
 *   await changePassword('senhaAtual123', 'novaSenha456');
 *   // Senha alterada com sucesso
 * } catch (error) {
 *   console.error('Erro ao mudar senha:', error.message);
 * }
 * ```
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> {
  const body: ChangePasswordRequest = { currentPassword, newPassword };
  
  return apiRequest<ChangePasswordResponse>(apiEndpoints.changePassword, {
    method: 'POST',
    body: JSON.stringify(body),
  }, true); // requireAuth = true
}
