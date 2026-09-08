import { apiClient } from './apiClient'

export interface InterviewRecord {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  interviewerId: string
  interviewerName: string
  companyName: string
  roleTitle: string
  round: 'TECHNICAL_1' | 'SYSTEM_DESIGN' | 'BEHAVIORAL' | 'FINAL_ROUND' | string
  dateStr: string
  timeStr: string
  scheduledAt: string
  durationMinutes: number
  meetingUrl: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | string
  notes?: string
  evaluationScore?: number
}

export interface ScheduleInterviewPayload {
  candidateId?: string
  candidateName: string
  candidateEmail: string
  roleTitle: string
  round: string
  dateStr?: string
  timeStr?: string
  durationMinutes?: number
  interviewerName?: string
  meetingUrl?: string
  notes?: string
}

export interface UpdateInterviewStatusPayload {
  status: string
  notes?: string
  evaluationScore?: number
}

export const interviewApi = {
  async getEmployerInterviews(): Promise<InterviewRecord[]> {
    const { data } = await apiClient.get<InterviewRecord[]>('/interviews/employer')
    return data
  },

  async getStudentInterviews(): Promise<InterviewRecord[]> {
    const { data } = await apiClient.get<InterviewRecord[]>('/interviews/student')
    return data
  },

  async scheduleInterview(payload: ScheduleInterviewPayload): Promise<InterviewRecord> {
    const { data } = await apiClient.post<InterviewRecord>('/interviews/schedule', payload)
    return data
  },

  async updateStatus(id: string, payload: UpdateInterviewStatusPayload): Promise<InterviewRecord> {
    const { data } = await apiClient.patch<InterviewRecord>(`/interviews/${id}/status`, payload)
    return data
  }
}
