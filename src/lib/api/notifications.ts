/**
 * API de Notificações
 */

import { apiRequest } from './client';
import { apiEndpoints } from './config';
import type { NotificationsListResponse } from './types';

/**
 * Parâmetros opcionais para listar notificações
 */
export interface ListNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

/**
 * Lista notificações do usuário (paginado)
 *
 * GET /notifications
 * Query: page, limit, unreadOnly (opcional)
 */
export async function listNotifications(
  params?: ListNotificationsParams
): Promise<NotificationsListResponse> {
  const query = new URLSearchParams();
  if (params?.page != null) query.set('page', String(params.page));
  if (params?.limit != null) query.set('limit', String(params.limit));
  if (params?.unreadOnly === true) query.set('unreadOnly', 'true');

  const url = query.toString()
    ? `${apiEndpoints.notifications}?${query}`
    : apiEndpoints.notifications;

  const response = await apiRequest<NotificationsListResponse>(url, { method: 'GET' }, true);
  return response;
}

/**
 * Marca uma notificação como lida
 *
 * PATCH /notifications/:id/read
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  await apiRequest<unknown>(
    `${apiEndpoints.notifications}/${id}/read`,
    { method: 'PATCH' },
    true
  );
}
