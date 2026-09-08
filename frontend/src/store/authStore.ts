import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  fullName: string
  displayName: string
  primaryRole: string
  roles: string[]
  emailVerified: boolean
  profilePictureUrl?: string
}

export const SUPER_ADMIN_EMAILS = ['sj6161362@gmail.com', 'admin@careersetu.in']

export const isSuperAdminEmail = (email?: string | null): boolean => {
  if (!email) return false
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim())
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  activeRoleView?: string | null
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  updateUser: (partial: Partial<User>) => void
  setActiveRoleView: (role: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      activeRoleView: null,
      setAuth: (user, accessToken, refreshToken) => {
        const isAdmin = isSuperAdminEmail(user.email)
        const enrichedUser: User = isAdmin
          ? {
              ...user,
              primaryRole: 'PLATFORM_ADMIN',
              roles: Array.from(new Set([...(user.roles || []), 'PLATFORM_ADMIN', 'SUPER_ADMIN', 'STUDENT', 'EMPLOYER', 'INSTITUTION_ADMIN'])),
            }
          : user
        set({ isAuthenticated: true, user: enrichedUser, accessToken, refreshToken, activeRoleView: null })
      },
      clearAuth: () =>
        set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null, activeRoleView: null }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
      setActiveRoleView: (role) =>
        set({ activeRoleView: role }),
    }),
    {
      name: 'careersetu-auth',
      onRehydrateStorage: () => (state) => {
        // Auto-elevate super admin if already logged in or stored
        if (state?.user && isSuperAdminEmail(state.user.email)) {
          state.user.primaryRole = 'PLATFORM_ADMIN'
          state.user.roles = Array.from(new Set([...(state.user.roles || []), 'PLATFORM_ADMIN', 'SUPER_ADMIN', 'STUDENT', 'EMPLOYER', 'INSTITUTION_ADMIN']))
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        activeRoleView: state.activeRoleView,
      }),
    }
  )
)
