import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

export const notificationService = {
  // Get user notifications
  async getNotifications(params?: { 
    limit?: number; 
    offset?: number; 
    unreadOnly?: boolean 
  }): Promise<ApiResponse<{ notifications: Notification[]; stats: NotificationStats }>> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    if (params?.unreadOnly) query.append('unreadOnly', 'true');

    return apiClient.get<ApiResponse<{ notifications: Notification[]; stats: NotificationStats }>>(
      `/api/notifications${query.toString() ? `?${query.toString()}` : ''}`
    );
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/api/notifications/${id}/read`);
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>('/api/notifications/mark-all-read');
  },

  // Delete notification
  async deleteNotification(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/notifications/${id}`);
  },
};
