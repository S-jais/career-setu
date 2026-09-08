import { apiClient as api } from './apiClient'

export interface ServerNotification {
  id: string
  recipientEmail: string
  title: string
  message: string
  type: 'APPLICATION' | 'OPPORTUNITY' | 'AI_INSIGHT' | 'ASSESSMENT' | 'SYSTEM'
  priority: 'HIGH' | 'NORMAL' | 'LOW'
  readStatus: boolean
  actionLink?: string
  createdAt: string
}

export const notificationApi = {
  getMyNotifications: async () => {
    const res = await api.get<ServerNotification[]>('/notifications/my')
    return res.data
  },

  getUnreadCount: async () => {
    const res = await api.get<{ unreadCount: number }>('/notifications/unread-count')
    return res.data
  },

  markAsRead: async (id: string) => {
    const res = await api.patch<ServerNotification>(`/notifications/${id}/read`)
    return res.data
  },

  markAllAsRead: async () => {
    const res = await api.patch<{ message: string }>('/notifications/read-all')
    return res.data
  },
}
