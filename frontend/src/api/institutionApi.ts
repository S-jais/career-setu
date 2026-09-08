import { apiClient as api } from './apiClient'

export interface InstitutionStudentRecord {
  id: string
  name: string
  email: string
  rollNo: string
  department: string
  year: number
  cgpa: number
  nepCredits: number
  nepStatus: 'COMPLIANT' | 'IN_PROGRESS' | 'PENDING'
  verifiedBadgesCount: number
  placementStatus: string
  placedCompany?: string
  placedPackageLpa?: number
}

export interface CampusPlacementDrive {
  id: string
  companyName: string
  roleTitle: string
  ctcPackage: string
  stipend?: string
  minCgpa: number
  eligibleBranches: string
  driveDate: string
  roundsSummary: string
  status: 'UPCOMING' | 'IN_PROGRESS' | 'OFFERS_RELEASED' | 'COMPLETED'
  applicantsCount: number
  offersCount?: number
}

export const institutionApi = {
  getStudents: async (params?: { department?: string; nepStatus?: string; search?: string }) => {
    const res = await api.get<InstitutionStudentRecord[]>('/institutions/students', { params })
    return res.data
  },

  bulkUploadCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post<{
      success: boolean
      message: string
      importedCount: number
      errorCount?: number
      errors?: string[]
    }>('/institutions/students/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  getStats: async () => {
    const res = await api.get<{
      totalStudents: number
      avgCgpa: number
      nepCompliantPercentage: number
      placementPercentage: number
      totalPlaced: number
      nepCompliantCount: number
    }>('/institutions/stats')
    return res.data
  },

  getDrives: async () => {
    const res = await api.get<CampusPlacementDrive[]>('/drives')
    return res.data
  },

  createDrive: async (driveData: Partial<CampusPlacementDrive>) => {
    const res = await api.post<CampusPlacementDrive>('/drives', driveData)
    return res.data
  },

  registerForDrive: async (driveId: string, data?: { name?: string; rollNo?: string; email?: string }) => {
    const res = await api.post(`/drives/${driveId}/register`, data)
    return res.data
  },

  broadcastDrive: async (driveId: string) => {
    const res = await api.post<{ success: boolean; message: string; eligibleCount: number }>(`/drives/${driveId}/broadcast`)
    return res.data
  },

  updateDriveStatus: async (driveId: string, status: string) => {
    const res = await api.patch<CampusPlacementDrive>(`/drives/${driveId}/status`, { status })
    return res.data
  },
}
