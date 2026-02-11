/**
 * Utilitários de validação e formatação de documentos
 */

/**
 * Remove caracteres não numéricos de uma string
 */
export function cleanDocument(doc: string): string {
  return doc.replace(/\D/g, '');
}

/**
 * Valida CPF usando algoritmo de dígito verificador
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cleanDocument(cpf);
  
  if (cleaned.length !== 11) return false;
  
  // Elimina CPFs inválidos conhecidos
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Valida 1º dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  
  // Valida 2º dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
}

/**
 * Valida CNPJ usando algoritmo de dígito verificador
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cleanDocument(cnpj);
  
  if (cleaned.length !== 14) return false;
  
  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  // Valida 1º dígito
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cleaned.charAt(12))) return false;
  
  // Valida 2º dígito
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cleaned.charAt(13))) return false;
  
  return true;
}

/**
 * Formata CPF para "000.000.000-00"
 */
export function formatCPF(cpf: string): string {
  const cleaned = cleanDocument(cpf);
  if (cleaned.length === 0) return '';
  
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
  if (!match) return cpf;
  
  let formatted = match[1];
  if (match[2]) formatted += '.' + match[2];
  if (match[3]) formatted += '.' + match[3];
  if (match[4]) formatted += '-' + match[4];
  
  return formatted;
}

/**
 * Formata CNPJ para "00.000.000/0000-00"
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cleanDocument(cnpj);
  if (cleaned.length === 0) return '';
  
  const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);
  if (!match) return cnpj;
  
  let formatted = match[1];
  if (match[2]) formatted += '.' + match[2];
  if (match[3]) formatted += '.' + match[3];
  if (match[4]) formatted += '/' + match[4];
  if (match[5]) formatted += '-' + match[5];
  
  return formatted;
}

/**
 * Formata telefone para "(00) 00000-0000" ou "(00) 0000-0000"
 */
export function formatPhone(phone: string): string {
  const cleaned = cleanDocument(phone);
  if (cleaned.length === 0) return '';
  
  // Celular: (00) 00000-0000
  if (cleaned.length === 11) {
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // Fixo: (00) 0000-0000
  if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // Formatação parcial
  if (cleaned.length <= 2) {
    return `(${cleaned}`;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
}

/**
 * Formata CEP para "00000-000"
 */
export function formatCEP(cep: string): string {
  const cleaned = cleanDocument(cep);
  if (cleaned.length === 0) return '';
  
  const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);
  if (!match) return cep;
  
  let formatted = match[1];
  if (match[2]) formatted += '-' + match[2];
  
  return formatted;
}

/**
 * Valida CEP (apenas formato)
 */
export function validateCEP(cep: string): boolean {
  const cleaned = cleanDocument(cep);
  return cleaned.length === 8;
}

/**
 * Valida telefone (apenas formato)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Telefone é opcional
  const cleaned = cleanDocument(phone);
  return cleaned.length === 10 || cleaned.length === 11;
}
