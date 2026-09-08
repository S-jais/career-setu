import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppNotification {
  id: string
  title: string
  message: string
  type: 'APPLICATION' | 'OPPORTUNITY' | 'AI_INSIGHT' | 'ASSESSMENT' | 'SYSTEM'
  timestamp: string
  read: boolean
  link?: string
  priority?: 'HIGH' | 'NORMAL' | 'LOW'
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: () => number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  clearAll: () => void
}

const defaultNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Application Shortlisted!',
    message: 'TechCorp India reviewed your profile and moved your application for Cloud Native Engineer Intern to Shortlisted.',
    type: 'APPLICATION',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: false,
    link: '/student/applications',
    priority: 'HIGH',
  },
  {
    id: 'notif-2',
    title: 'AI ATS Resume Studio Score',
    message: 'Your ATS compatibility score achieved 91/100 for Backend Systems Engineer. 1 high-demand keyword recommended.',
    type: 'AI_INSIGHT',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    link: '/student/copilot',
    priority: 'NORMAL',
  },
  {
    id: 'notif-3',
    title: 'New Opportunity Matching Your Profile',
    message: 'Razorpay posted "Software Engineer Intern - Payments" matching 94% of your verified skills.',
    type: 'OPPORTUNITY',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    read: false,
    link: '/student/opportunities',
    priority: 'NORMAL',
  },
  {
    id: 'notif-4',
    title: 'Campus Drive Announced',
    message: 'TPO scheduled a 2026 Batch Campus Drive with Infosys AI Systems. 14 NEP credits eligible.',
    type: 'SYSTEM',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    link: '/student/passport',
    priority: 'LOW',
  },
]

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: defaultNotifications,
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      addNotification: (item) =>
        set((state) => ({
          notifications: [
            {
              ...item,
              id: `notif-${Date.now()}`,
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: 'careersetu-notifications',
    }
  )
)
