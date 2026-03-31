/**
 * Helpers para data URLs (base64) retornadas pela API de documentos.
 */

export function getMimeFromDataUrl(uri: string): string | null {
  const m = /^data:([^;,]+)/i.exec(uri);
  return m ? m[1].trim().toLowerCase() : null;
}

export function isPdfDataUrl(uri: string | undefined): boolean {
  if (!uri || !uri.startsWith('data:')) {
    return false;
  }
  const mime = getMimeFromDataUrl(uri);
  return mime === 'application/pdf' || mime === 'application/x-pdf' || mime === 'image/pdf';
}

export function isImageDataUrl(uri: string | undefined): boolean {
  if (!uri || !uri.startsWith('data:')) {
    return false;
  }
  const mime = getMimeFromDataUrl(uri);
  // image/pdf é PDF disfarçado — não tratar como imagem
  return mime != null && mime.startsWith('image/') && mime !== 'image/pdf';
}

export function isRemoteHttpUrl(uri: string | undefined): boolean {
  if (!uri) {
    return false;
  }
  return /^https?:\/\//i.test(uri);
}
