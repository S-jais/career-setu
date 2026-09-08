import { apiClient } from './apiClient'

export interface SkillItem {
  id: string
  name: string
  slug: string
  description?: string
  industryDemand: 'HIGH' | 'MEDIUM' | 'LOW' | 'EMERGING'
  isTechnical: boolean
  isSoftSkill: boolean
  isActive: boolean
  createdAt: string
}

export const skillApi = {
  async getSkills(search?: string): Promise<SkillItem[]> {
    const params = search ? `?search=${encodeURIComponent(search.trim())}` : ''
    const { data } = await apiClient.get<SkillItem[]>(`/skills${params}`)
    return data
  },

  async getHighDemandSkills(): Promise<SkillItem[]> {
    const { data } = await apiClient.get<SkillItem[]>('/skills/high-demand')
    return data
  },
}
