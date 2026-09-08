import { apiClient } from './apiClient'

export interface MentorData {
  id: string
  name: string
  role: string
  company: string
  experienceYears: number
  rating: number
  sessionsCount: number
  avatarInitials: string
  gradient: string
  domains: string[]
  bio: string
  nextAvailable: string
  languages: string[]
  hourlyRate: number
}

export interface BookSessionPayload {
  mentorId: string
  scheduledTime: string
  topic: string
  goals?: string
  durationMinutes?: number
}

export interface MentorshipSessionRecord {
  id: string
  mentorId: string
  mentorName: string
  studentId: string
  studentName: string
  scheduledTime: string
  topic: string
  goals?: string
  durationMinutes: number
  status: string
  meetingLink: string
  createdAt: string
}

export const mentorshipApi = {
  async getMentors(search?: string): Promise<MentorData[]> {
    const params = search ? { search } : {}
    const { data } = await apiClient.get<MentorData[]>('/mentors', { params })
    return data
  },

  async bookSession(payload: BookSessionPayload): Promise<MentorshipSessionRecord> {
    const { data } = await apiClient.post<MentorshipSessionRecord>('/mentors/book', payload)
    return data
  },

  async getMySessions(): Promise<MentorshipSessionRecord[]> {
    const { data } = await apiClient.get<MentorshipSessionRecord[]>('/mentors/my-sessions')
    return data
  }
}
