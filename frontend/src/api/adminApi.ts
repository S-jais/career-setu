import { apiClient } from './apiClient'

export interface PlatformStats {
  totalUsers: number
  totalStudents: number
  totalEmployers: number
  totalOpportunities: number
  totalApplications: number
  totalAdmins: number
  databaseStatus: string
  serverTime: string
}

export interface AdminUserSummary {
  id: string
  email: string
  fullName: string
  displayName: string
  primaryRole: string
  accountStatus: string
  emailVerified: boolean
  lastLoginAt?: string
  createdAt: string
}

export interface AuditLogDto {
  id: string
  eventType: string
  actorEmail?: string
  status: string
  details?: string
  createdAt: string
}

export const adminApi = {
  async getStats(): Promise<PlatformStats> {
    const { data } = await apiClient.get<PlatformStats>('/admin/stats')
    return data
  },

  async getUsers(): Promise<AdminUserSummary[]> {
    const { data } = await apiClient.get<AdminUserSummary[]>('/admin/users')
    return data
  },

  async updateUserRole(id: string, role: string): Promise<AdminUserSummary> {
    const { data } = await apiClient.patch<AdminUserSummary>(`/admin/users/${id}/role`, { role })
    return data
  },

  async updateUserStatus(id: string, status: string): Promise<AdminUserSummary> {
    const { data } = await apiClient.patch<AdminUserSummary>(`/admin/users/${id}/status`, { status })
    return data
  },

  async getAuditLogs(): Promise<AuditLogDto[]> {
    const { data } = await apiClient.get<AuditLogDto[]>('/admin/audit-logs')
    return data
  },
}
