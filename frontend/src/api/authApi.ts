import { apiClient } from './apiClient'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  displayName: string
  primaryRole: string
  roles: string[]
  emailVerified: boolean
  profilePictureUrl?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password })
    return data
  },

  async register(payload: {
    fullName: string
    email: string
    password: string
    role: string
    mobile?: string
    acceptedTerms: boolean
    acceptedPrivacyPolicy: boolean
  }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
    return data
  },

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/me')
    return data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data
  },
}
