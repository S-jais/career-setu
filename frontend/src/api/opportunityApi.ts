import { apiClient } from './apiClient'

export interface Opportunity {
  id: string
  companyId: string
  postedBy: string
  title: string
  slug: string
  type: string
  description: string
  locationCity?: string
  locationState?: string
  workMode: string
  stipendMin?: number
  stipendMax?: number
  salaryMin?: number
  salaryMax?: number
  currency: string
  isPaid: boolean
  durationWeeks?: number
  applicationDeadline?: string
  openings?: number
  applicationsCount?: number
  status: string
  isFeatured?: boolean
  createdAt: string
  companyName?: string
}

export interface OpportunityFilters {
  search?: string
  type?: string
  workMode?: string
}

export interface CreateOpportunityPayload {
  title: string
  type: 'INTERNSHIP' | 'FULL_TIME' | 'CONTRACT' | 'APPRENTICESHIP'
  description: string
  locationCity?: string
  locationState?: string
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE'
  stipendMin?: number
  stipendMax?: number
  salaryMin?: number
  salaryMax?: number
  openings?: number
  durationWeeks?: number
  minCgpa?: number
}

export const opportunityApi = {
  async searchOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]> {
    const params = new URLSearchParams()
    if (filters?.search && filters.search.trim()) {
      params.append('search', filters.search.trim())
    }
    if (filters?.type && filters.type !== 'ALL') {
      params.append('type', filters.type)
    }
    if (filters?.workMode && filters.workMode !== 'ALL') {
      params.append('workMode', filters.workMode)
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    const { data } = await apiClient.get<Opportunity[]>(`/opportunities${query}`)
    return data
  },

  async getOpportunityById(id: string): Promise<Opportunity> {
    const { data } = await apiClient.get<Opportunity>(`/opportunities/${id}`)
    return data
  },

  async createOpportunity(payload: CreateOpportunityPayload): Promise<Opportunity> {
    const { data } = await apiClient.post<Opportunity>('/opportunities', payload)
    return data
  },

  async closeOpportunity(id: string): Promise<Opportunity> {
    const { data } = await apiClient.patch<Opportunity>(`/opportunities/${id}/close`)
    return data
  },
}
