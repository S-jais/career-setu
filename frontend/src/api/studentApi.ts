import { apiClient } from './apiClient'

export interface StudentProfileData {
  id?: string
  userId?: string
  institutionId?: string
  departmentId?: string
  enrollmentNumber?: string
  rollNumber?: string
  currentYear?: number
  currentSemester?: number
  cgpa?: number
  graduationYear?: number
  bio?: string
  headline?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  profileCompletionPct?: number
  isActivelyLooking?: boolean
  createdAt?: string
}

export const studentApi = {
  async getMyProfile(): Promise<StudentProfileData> {
    const { data } = await apiClient.get<StudentProfileData>('/students/me')
    return data
  },

  async updateMyProfile(payload: Partial<StudentProfileData>): Promise<StudentProfileData> {
    const { data } = await apiClient.put<StudentProfileData>('/students/me', payload)
    return data
  },
}
