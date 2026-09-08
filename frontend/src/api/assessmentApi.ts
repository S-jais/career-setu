import { apiClient as api } from './apiClient'

export interface ServerAssessmentSubmission {
  id: string
  studentEmail: string
  studentName: string
  challengeId: string
  challengeTitle: string
  language: string
  score: number
  codeSnippet: string
  passedTestCases: number
  totalTestCases: number
  verificationHash: string
  badgeTitle: string
  status: string
  submittedAt: string
}

export const assessmentApi = {
  submitAssessment: async (data: {
    challengeId: string
    challengeTitle: string
    language: string
    score: number
    code: string
    passedTestCases?: number
    totalTestCases?: number
    name?: string
    email?: string
  }) => {
    const res = await api.post<ServerAssessmentSubmission>('/assessment/submit', data)
    return res.data
  },

  verifyCredential: async (verificationHash: string) => {
    const res = await api.get<ServerAssessmentSubmission>(`/assessment/verify/${verificationHash}`)
    return res.data
  },

  getMySubmissions: async () => {
    const res = await api.get<ServerAssessmentSubmission[]>('/assessment/my-submissions')
    return res.data
  },
}
