/**
 * Configuração centralizada da API
 * 
 * Centraliza:
 * - URL base da API
 * - Rotas (endpoints) da aplicação
 */

import Constants from 'expo-constants';

/**
 * URL base da API
 * 
 * Ordem de prioridade:
 * 1. app.json (extra.apiUrl) - para builds/configurações fixas
 * 2. EXPO_PUBLIC_API_URL - variável de ambiente (recomendado para desenvolvimento)
 * 3. localhost:3000 - fallback padrão (só funciona em simulador/emulador)
 * 
 * IMPORTANTE para dispositivos físicos:
 * - Não use localhost! Use o IP da sua máquina
 * - Exemplo: EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
 * - Descubra seu IP: macOS: ifconfig | grep "inet " | grep -v 127.0.0.1
 * 
 * Para usar variáveis de ambiente:
 * - Crie um arquivo .env na raiz do projeto
 * - Adicione: EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3000
 * - Reinicie o servidor Expo (npm start)
 */
export const API_URL = 
  Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  'http://localhost:3000';


export const apiEndpoints = {
  // Autenticação
  login: `${API_URL}/auth/login`,
  validateCode: `${API_URL}/auth/validateCode`,
  register: `${API_URL}/auth/register`,
  updateProfile: `${API_URL}/auth/profile`,
  changePassword: `${API_URL}/auth/change-password`,
  
  // CNPJ
  cnpjRequest: `${API_URL}/api/cnpj-request`,
} as const;
