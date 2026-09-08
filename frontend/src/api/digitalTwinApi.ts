import { apiClient } from './apiClient'

// ─── Digital Twin Types ──────────────────────────────────────

export interface SkillEntryPayload {
  name: string
  level: number
  verified: boolean
  source: 'ASSESSED' | 'PROJECT_VERIFIED' | 'SELF_DECLARED'
}

export interface BadgeEntryPayload {
  skill_name: string
  score: number
  level: string
}

export interface DigitalTwinRequest {
  student_name?: string
  target_role?: string
  skills: SkillEntryPayload[]
  badges: BadgeEntryPayload[]
  cgpa?: number
  current_year: number
  graduation_year: number
  projects_count: number
  internships_count: number
  events_attended: number
  mentors_connected: number
}

export interface CRIDimension {
  name: string
  score: number
  weight: number
  details: string
}

export interface CareerDNACluster {
  cluster_name: string
  skills: string[]
  strength: number
  color: string
}

export interface TrajectoryPrediction {
  role: string
  probability: number
  timeline: string
  required_skills: string[]
  current_readiness: number
}

export interface SkillPassportEntry {
  skill_name: string
  level: number
  label: string
  verified: boolean
  source: string
  market_demand: string
  gap_delta: number
}

export interface ActionItem {
  title: string
  category: string
  estimated_hours: number
  impact_score: number
  link_to: string
  description: string
}

export interface PeerBenchmark {
  dimension: string
  your_score: number
  peer_avg: number
  percentile: number
}

export interface DigitalTwinResponse {
  career_readiness_index: number
  cri_grade: string
  growth_velocity: number
  growth_trend: string
  dimensions: CRIDimension[]
  career_dna: CareerDNACluster[]
  trajectories: TrajectoryPrediction[]
  skill_passport: SkillPassportEntry[]
  action_items: ActionItem[]
  peer_benchmarks: PeerBenchmark[]
  twin_summary: string
}

// ─── API ─────────────────────────────────────────────────────

export const digitalTwinApi = {
  async computeTwin(payload: DigitalTwinRequest): Promise<DigitalTwinResponse> {
    const { data } = await apiClient.post<DigitalTwinResponse>('/ai/digital-twin', payload)
    return data
  },
}
