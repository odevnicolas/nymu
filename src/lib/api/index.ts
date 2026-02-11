/**
 * API Client - Módulo centralizado
 * 
 * Exporta todas as funções e tipos relacionados à API
 */

// Configuração
export { API_URL, apiEndpoints } from './config';

// Tipos
export type {
    ApiErrorResponse,
    LoginRequest,
    LoginResponse, RegisterRequest,
    RegisterResponse, ValidateCodeRequest,
    ValidateCodeResponse
} from './types';

// Cliente HTTP
export { addHeaderInterceptor, apiRequest, clearHeaderInterceptors } from './client';

// Interceptors
export { setupAuthInterceptor } from './interceptors';

// Autenticação
export { changePassword, login, loginRequest, register, updateProfile, validateCode } from './auth';

// Tomadores
export { createTomador, deleteTomador, getTomadorById, listTomadores, updateTomador } from './tomadores';

// Notas Fiscais
export { cancelNotaFiscal, createNotaFiscal, downloadPdf, downloadXml, getNotaFiscalById, getPdfUrl, getXmlUrl, listNotasFiscais } from './notas-fiscais';

