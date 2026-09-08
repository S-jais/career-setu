import { apiClient } from './apiClient'

export interface CopilotMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StudentContext {
  name?: string
  target_role?: string
  skills?: string[]
  education_level?: string
  preferred_location?: string
}

export interface CopilotRequest {
  messages: CopilotMessage[]
  student_context?: StudentContext
  stream?: boolean
}

export interface CopilotResponse {
  response: string
  suggested_actions: string[]
  recommended_skills: string[]
  disclaimer: string
}

export interface ResumeAnalyzeRequest {
  resume_text: string
  target_role?: string
  target_industry?: string
}

export interface ResumeAnalyzeResponse {
  overall_score: number
  ats_compatibility_score: number
  strengths: string[]
  weaknesses: string[]
  missing_keywords: string[]
  actionable_improvements: string[]
  summary: string
}

export interface SkillGapRequest {
  student_skills: string[]
  target_role: string
  required_skills?: string[]
}

export interface SkillRecommendation {
  skill: string
  importance: string
  learning_resources: string[]
  estimated_hours: number
}

export interface SkillGapResponse {
  target_role: string
  match_percentage: number
  matching_skills: string[]
  missing_skills: string[]
  recommendations: SkillRecommendation[]
  action_plan_summary: string
}

export interface ResumeUploadResponse {
  extracted_text: string
  file_name: string
  char_count: number
  analysis: ResumeAnalyzeResponse
}

export const aiApi = {
  async chatCopilot(payload: CopilotRequest): Promise<CopilotResponse> {
    const { data } = await apiClient.post<CopilotResponse>('/ai/copilot', payload)
    return data
  },

  async analyzeResume(payload: ResumeAnalyzeRequest): Promise<ResumeAnalyzeResponse> {
    const { data } = await apiClient.post<ResumeAnalyzeResponse>('/ai/resume-analyzer', payload)
    return data
  },

  async uploadResume(file: File, targetRole = 'Software Engineer Intern', targetIndustry = 'Technology'): Promise<ResumeUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('target_role', targetRole)
    formData.append('target_industry', targetIndustry)

    const { data } = await apiClient.post<ResumeUploadResponse>('/ai/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  async analyzeSkillGap(payload: SkillGapRequest): Promise<SkillGapResponse> {
    const { data } = await apiClient.post<SkillGapResponse>('/ai/skill-gap', payload)
    return data
  },

  async chatAssistant(payload: AssistantRequest): Promise<AssistantResponse> {
    const { data } = await apiClient.post<AssistantResponse>('/ai/assistant', payload)
    return data
  },
}

// ─── AI Assistant Types ────────────────────────────────────────

export interface AssistantResponseBlock {
  type: 'TEXT' | 'NAVIGATE' | 'STEP_LIST' | 'FEATURE_CARD' | 'TIP' | 'WARNING' | 'SUGGESTED_PROMPTS'
  content?: string
  route?: string
  label?: string
  steps?: string[]
  items?: Array<Record<string, unknown>>
}

export interface AssistantResponse {
  blocks: AssistantResponseBlock[]
  suggested_prompts: string[]
}

export interface AssistantRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  user_role?: string
  current_route?: string
  current_page_name?: string
}

// ─── Route Allowlist ───────────────────────────────────────────
// All navigation actions from the AI are validated against this list.

export const ROUTE_ALLOWLIST: Record<string, { label: string; roles: string[] }> = {
  '/student/overview': { label: 'Dashboard', roles: ['STUDENT', 'ALUMNI'] },
  '/student/passport': { label: 'Career Passport', roles: ['STUDENT', 'ALUMNI'] },
  '/student/digital-twin': { label: 'Career Digital Twin', roles: ['STUDENT', 'ALUMNI'] },
  '/student/skills': { label: 'Skill Intelligence', roles: ['STUDENT', 'ALUMNI'] },
  '/student/opportunities': { label: 'Opportunities', roles: ['STUDENT', 'ALUMNI'] },
  '/student/applications': { label: 'Applications', roles: ['STUDENT', 'ALUMNI'] },
  '/student/assessment': { label: 'Skill Assessment', roles: ['STUDENT', 'ALUMNI'] },
  '/student/copilot': { label: 'AI Copilot', roles: ['STUDENT', 'ALUMNI'] },
  '/student/learning': { label: 'Learning', roles: ['STUDENT', 'ALUMNI'] },
  '/student/mentors': { label: 'Mentors', roles: ['STUDENT', 'ALUMNI'] },
  '/student/events': { label: 'Events', roles: ['STUDENT', 'ALUMNI'] },
  '/student/messages': { label: 'Messages', roles: ['STUDENT', 'ALUMNI'] },
  '/employer/overview': { label: 'Dashboard', roles: ['EMPLOYER', 'RECRUITER'] },
  '/employer/jobs': { label: 'Jobs', roles: ['EMPLOYER', 'RECRUITER'] },
  '/employer/applicants': { label: 'Applicants', roles: ['EMPLOYER', 'RECRUITER'] },
  '/employer/interviews': { label: 'Interviews', roles: ['EMPLOYER', 'RECRUITER'] },
  '/employer/analytics': { label: 'Analytics', roles: ['EMPLOYER', 'RECRUITER'] },
  '/employer/profile': { label: 'Company Profile', roles: ['EMPLOYER', 'RECRUITER'] },
  '/employer/messages': { label: 'Messages', roles: ['EMPLOYER', 'RECRUITER'] },
  '/institution/overview': { label: 'Dashboard', roles: ['TPO', 'INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN'] },
  '/institution/students': { label: 'Student Roster', roles: ['TPO', 'INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN'] },
  '/institution/drives': { label: 'Placement Drives', roles: ['TPO', 'INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN'] },
}

export function isAllowedRoute(route: string): boolean {
  return route in ROUTE_ALLOWLIST
}
