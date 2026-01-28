/**
 * Utilitários para trabalhar com dados do usuário
 */

import { User } from '@/lib/api/types';

/**
 * Obtém o nome do usuário (aceita "name" ou "nome")
 */
export function getUserName(user: User | null | undefined): string {
  if (!user) return 'Usuário';
  
  // Aceita tanto "name" quanto "nome" do backend
  return user.name || user.nome || 'Usuário';
}

/**
 * Obtém apenas o primeiro e segundo nome do usuário
 * 
 * @example
 * "Luan Robson Sousa Mendes de Almeida" -> "Luan Robson"
 * "Maria" -> "Maria"
 * "João Silva Santos" -> "João Silva"
 */
export function getShortName(user: User | null | undefined): string {
  const fullName = getUserName(user);
  const parts = fullName.trim().split(/\s+/);
  
  // Retorna primeiro e segundo nome (se existir)
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`;
  }
  
  // Se tiver apenas um nome, retorna ele
  return parts[0] || 'Usuário';
}

/**
 * Obtém apenas o primeiro nome
 */
export function getFirstName(user: User | null | undefined): string {
  const fullName = getUserName(user);
  const parts = fullName.trim().split(/\s+/);
  return parts[0] || 'Usuário';
}
