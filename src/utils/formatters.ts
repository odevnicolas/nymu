/**
 * Utilitários de formatação de valores
 */

/**
 * Formata valor em centavos para moeda brasileira
 * @param value Valor em centavos
 * @returns String formatada "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
  const reais = value / 100;
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata string de input para moeda enquanto o usuário digita
 * @param text Texto digitado pelo usuário
 * @returns String formatada "R$ 1.234,56"
 */
export function formatCurrencyInput(text: string): string {
  // Remove tudo que não é número
  const numbers = text.replace(/\D/g, '');
  
  if (!numbers) return 'R$ 0,00';
  
  // Converte para número (em centavos)
  const value = parseInt(numbers, 10);
  
  // Formata
  return formatCurrency(value);
}

/**
 * Remove formatação de moeda e retorna valor em centavos
 * @param text String formatada "R$ 1.234,56"
 * @returns Valor em centavos (número inteiro)
 */
export function parseCurrency(text: string): number {
  // Remove tudo que não é número
  const numbers = text.replace(/\D/g, '');
  
  if (!numbers) return 0;
  
  // Retorna o valor em centavos
  return parseInt(numbers, 10);
}

/**
 * Formata data para competência (MM/YYYY)
 * @param date Data a ser formatada
 * @returns String no formato "MM/YYYY"
 */
export function formatCompetencia(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${year}`;
}

/**
 * Converte string de competência para Date
 * @param competencia String no formato "MM/YYYY"
 * @returns Date objeto
 */
export function parseCompetencia(competencia: string): Date {
  const [month, year] = competencia.split('/');
  // Define o dia como 1 para sempre pegar o primeiro dia do mês
  return new Date(parseInt(year), parseInt(month) - 1, 1);
}

/**
 * Valida se a competência está no formato correto
 * @param competencia String a ser validada
 * @returns true se válida
 */
export function validateCompetencia(competencia: string): boolean {
  const regex = /^\d{2}\/\d{4}$/;
  if (!regex.test(competencia)) return false;
  
  const [month, year] = competencia.split('/').map(Number);
  
  // Valida mês (1-12)
  if (month < 1 || month > 12) return false;
  
  // Valida ano (não pode ser muito antigo ou muito futuro)
  const currentYear = new Date().getFullYear();
  if (year < currentYear - 10 || year > currentYear + 10) return false;
  
  return true;
}

/**
 * Formata número de telefone para exibição
 * Reutiliza a função do validators, mas expõe aqui para conveniência
 */
export { formatPhone, formatCPF, formatCNPJ, formatCEP } from './validators';
