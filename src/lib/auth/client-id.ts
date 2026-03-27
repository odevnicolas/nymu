/**
 * Obtém o ID de cliente/usuário a partir do JWT quando o UserContext ainda não tem `user`.
 * Ordem: clientId, sub, id, userId (alinhado a backends comuns).
 */
export function getClientIdFromToken(token: string | null | undefined): string | undefined {
  if (!token || typeof token !== 'string') {
    return undefined;
  }
  const parts = token.split('.');
  if (parts.length < 2) {
    return undefined;
  }
  try {
    const json = decodeJwtPayloadSegment(parts[1]);
    const payload = JSON.parse(json) as Record<string, unknown>;
    for (const key of ['clientId', 'sub', 'id', 'userId'] as const) {
      const v = payload[key];
      if (typeof v === 'string' && v.trim()) {
        return v.trim();
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function decodeJwtPayloadSegment(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  return atob(base64 + pad);
}
