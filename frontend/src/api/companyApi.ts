import { apiClient as api } from './apiClient'

export interface CompanyRecord {
  id: string
  legalName: string
  brandName?: string
  cin?: string
  gstin?: string
  industry?: string
  employeeCountRange?: string
  foundedYear?: number
  website?: string
  linkedinUrl?: string
  headquartersCity?: string
  headquartersState?: string
  description?: string
  verificationStatus: string
  isStartup?: boolean
  dpiitRecognized?: boolean
}

export const companyApi = {
  getPrimary: async () => {
    const res = await api.get<CompanyRecord>('/companies/primary')
    return res.data
  },

  verifyGstin: async (companyId: string, gstin: string, cin: string) => {
    const res = await api.post<{
      success: boolean
      verificationStatus: string
      gstin: string
      verifiedEntity: string
      message: string
    }>(`/companies/${companyId}/verify-gstin`, { gstin, cin })
    return res.data
  },

  updateProfile: async (companyId: string, data: Partial<CompanyRecord>) => {
    const res = await api.put<CompanyRecord>(`/companies/${companyId}`, data)
    return res.data
  },
}
