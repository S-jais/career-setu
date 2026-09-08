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
      setAuth: (user, accessToken, refreshToken) =>
        set({ isAuthenticated: true, user, accessToken, refreshToken, activeRoleView: null }),
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
