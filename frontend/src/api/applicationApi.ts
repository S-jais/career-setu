import { apiClient } from './apiClient'

export interface StudentApplication {
  id: string
  opportunityId: string
  opportunityTitle: string
  companyName: string
  companyBrandName: string
  type: string
  workMode: string
  locationCity: string
  locationState: string
  stipendMin?: number
  stipendMax?: number
  salaryMin?: number
  salaryMax?: number
  status: string
  coverNote?: string
  matchScore?: number
  aiExplanation?: string
  appliedAt: string
  lastActivityAt: string
}

export interface OpportunityApplicant {
  id: string
  opportunityId: string
  opportunityTitle: string
  studentProfileId: string
  studentName: string
  studentEmail: string
  headline?: string
  currentYear?: number
  cgpa?: number
  status: string
  coverNote?: string
  matchScore?: number
  aiExplanation?: string
  appliedAt: string
  lastActivityAt: string
}

export interface ApplyPayload {
  opportunityId: string
  coverNote?: string
}

export const applicationApi = {
  async apply(payload: ApplyPayload): Promise<any> {
    const { data } = await apiClient.post('/applications', payload)
    return data
  },

  async getMyApplications(): Promise<StudentApplication[]> {
    const { data } = await apiClient.get<StudentApplication[]>('/applications/me')
    return data
  },

  async getAllApplications(): Promise<OpportunityApplicant[]> {
    const { data } = await apiClient.get<OpportunityApplicant[]>('/applications')
    return data
  },

  async getOpportunityApplications(opportunityId: string): Promise<OpportunityApplicant[]> {
    const { data } = await apiClient.get<OpportunityApplicant[]>(`/applications/opportunity/${opportunityId}`)
    return data
  },

  async updateStatus(applicationId: string, status: string): Promise<any> {
    const { data } = await apiClient.patch(`/applications/${applicationId}/status`, { status })
    return data
  },
}
