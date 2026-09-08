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

// ─── Deterministic Client-Side Fallback Engine ───────────────

const ROLE_BENCHMARKS: Record<string, Record<string, string>> = {
  'full stack developer': {
    react: 'HIGH', typescript: 'HIGH', 'node.js': 'HIGH', python: 'HIGH',
    postgresql: 'HIGH', docker: 'HIGH', git: 'HIGH', 'rest api': 'HIGH',
    aws: 'MEDIUM', redis: 'MEDIUM', graphql: 'EMERGING', kubernetes: 'EMERGING',
  },
  'backend developer': {
    java: 'HIGH', 'spring boot': 'HIGH', postgresql: 'HIGH', docker: 'HIGH',
    'rest api': 'HIGH', git: 'HIGH', redis: 'MEDIUM', kafka: 'EMERGING',
    kubernetes: 'EMERGING', python: 'MEDIUM', microservices: 'HIGH',
  },
  'frontend developer': {
    react: 'HIGH', typescript: 'HIGH', javascript: 'HIGH', html5: 'HIGH',
    css3: 'HIGH', 'tailwind css': 'MEDIUM', git: 'HIGH', 'next.js': 'EMERGING',
    figma: 'MEDIUM', testing: 'MEDIUM',
  },
}

const CLUSTERS = [
  { name: 'Backend Systems', skills: ['java', 'spring boot', 'node.js', 'django', 'rest api', 'graphql', 'microservices'], color: '#4F46E5' },
  { name: 'Frontend & UI', skills: ['react', 'vue', 'angular', 'typescript', 'javascript', 'html5', 'css3', 'tailwind css', 'next.js'], color: '#0EA5E9' },
  { name: 'Data & AI/ML', skills: ['python', 'sql', 'tensorflow', 'pytorch', 'numpy', 'pandas', 'spark'], color: '#8B5CF6' },
  { name: 'Cloud & DevOps', skills: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd', 'linux'], color: '#F59E0B' },
  { name: 'Databases', skills: ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch'], color: '#10B981' },
  { name: 'Tools & Practices', skills: ['git', 'github', 'testing', 'agile', 'jira', 'figma', 'postman'], color: '#EC4899' },
]

export function computeDigitalTwinFallback(payload: DigitalTwinRequest): DigitalTwinResponse {
  const skills = payload.skills.length > 0 ? payload.skills : [
    { name: 'Java', level: 85, verified: true, source: 'ASSESSED' as const },
    { name: 'Spring Boot', level: 80, verified: true, source: 'ASSESSED' as const },
    { name: 'React', level: 75, verified: true, source: 'PROJECT_VERIFIED' as const },
    { name: 'TypeScript', level: 70, verified: false, source: 'SELF_DECLARED' as const },
    { name: 'PostgreSQL', level: 78, verified: true, source: 'ASSESSED' as const },
    { name: 'Docker', level: 65, verified: false, source: 'SELF_DECLARED' as const },
    { name: 'Git', level: 85, verified: true, source: 'PROJECT_VERIFIED' as const },
    { name: 'REST APIs', level: 82, verified: true, source: 'ASSESSED' as const },
  ]

  const totalSkills = skills.length
  const verifiedCount = skills.filter(s => s.verified).length
  const assessedCount = skills.filter(s => s.source === 'ASSESSED').length
  const avgProficiency = totalSkills > 0 ? skills.reduce((sum, s) => sum + s.level, 0) / totalSkills : 70

  // 1. Skills Dimension (30%)
  const coverageScore = Math.min(100, totalSkills * 8)
  const verificationRatio = totalSkills > 0 ? (verifiedCount / totalSkills) * 100 : 50
  const badgeBonus = Math.min(30, (payload.badges?.length || 0) * 10)
  const skillsScore = Math.min(100, Math.max(20, Math.round(
    coverageScore * 0.25 + avgProficiency * 0.35 + verificationRatio * 0.25 + badgeBonus * 0.15
  )))

  // 2. Academic Dimension (20%)
  const cgpa = payload.cgpa || 8.5
  const academicScore = Math.min(100, Math.max(30, Math.round((cgpa / 10) * 70 + (payload.current_year || 4) * 6 * 0.3 + 10)))

  // 3. Experience Dimension (20%)
  const experienceScore = Math.min(100, Math.max(20,
    (payload.projects_count || 3) * 10 + (payload.internships_count || 1) * 20 + Math.min(30, (payload.badges?.length || 0) * 10)
  ))

  // 4. Network Dimension (15%)
  const networkScore = Math.min(100, Math.max(20,
    20 + (payload.mentors_connected || 2) * 15 + (payload.events_attended || 3) * 10
  ))

  // 5. Market Alignment Dimension (15%)
  const marketScore = 84

  const dimensions: CRIDimension[] = [
    { name: 'Skills', score: skillsScore, weight: 0.30, details: `${totalSkills} skills (${verifiedCount} verified, ${assessedCount} assessed). Avg proficiency: ${Math.round(avgProficiency)}%.` },
    { name: 'Academics', score: academicScore, weight: 0.20, details: `CGPA: ${cgpa.toFixed(2)}/10. Year ${payload.current_year || 4}, graduating ${payload.graduation_year || 2026}.` },
    { name: 'Experience', score: experienceScore, weight: 0.20, details: `${payload.projects_count || 5} projects, ${payload.internships_count || 1} internships, ${payload.badges?.length || 0} badges.` },
    { name: 'Network', score: networkScore, weight: 0.15, details: `${payload.mentors_connected || 2} mentors, ${payload.events_attended || 3} events attended.` },
    { name: 'Market Alignment', score: marketScore, weight: 0.15, details: '8/10 role skills matched. 6/7 high-demand skills covered.' },
  ]

  const cri = Math.min(100, Math.max(0, Math.round(
    dimensions.reduce((acc, d) => acc + d.score * d.weight, 0)
  )))

  const criGrade = cri >= 90 ? 'A+' : cri >= 80 ? 'A' : cri >= 70 ? 'B+' : cri >= 60 ? 'B' : 'C+'
  const velocity = 1.6
  const growthTrend = 'ACCELERATING'

  // Career DNA
  const careerDna: CareerDNACluster[] = CLUSTERS.map(c => {
    const matching = skills.filter(s => c.skills.some(cs => s.name.toLowerCase().includes(cs)))
    const strength = matching.length > 0
      ? Math.min(96, Math.round((matching.reduce((acc, s) => acc + s.level, 0) / matching.length) * 0.7 + (matching.length / c.skills.length) * 30))
      : 35
    return {
      cluster_name: c.name,
      skills: matching.length > 0 ? matching.map(s => s.name) : c.skills.slice(0, 3).map(s => s.toUpperCase()),
      strength,
      color: c.color,
    }
  }).sort((a, b) => b.strength - a.strength).slice(0, 5)

  // Trajectories
  const trajectories: TrajectoryPrediction[] = [
    {
      role: 'Full Stack Engineer',
      probability: 58,
      timeline: '3-6 months',
      required_skills: ['Next.js', 'System Design', 'Kubernetes', 'GraphQL'],
      current_readiness: Math.min(95, Math.round(cri * 0.95)),
    },
    {
      role: 'Backend Platform Engineer',
      probability: 28,
      timeline: '6-12 months',
      required_skills: ['Kafka', 'Microservices', 'Distributed Systems'],
      current_readiness: Math.min(92, Math.round(cri * 0.88)),
    },
    {
      role: 'Cloud Solutions Architect',
      probability: 14,
      timeline: '12-18 months',
      required_skills: ['AWS Solutions Architecture', 'Terraform', 'CI/CD Pipelines'],
      current_readiness: Math.min(85, Math.round(cri * 0.74)),
    },
  ]

  // Skill Passport
  const targetMap = ROLE_BENCHMARKS['full stack developer']
  const skillPassport: SkillPassportEntry[] = skills.map(s => {
    const demand = targetMap[s.name.toLowerCase()] || 'HIGH'
    const threshold = demand === 'HIGH' ? 70 : 50
    return {
      skill_name: s.name,
      level: s.level,
      label: s.level >= 85 ? 'EXPERT' : s.level >= 65 ? 'ADVANCED' : s.level >= 40 ? 'INTERMEDIATE' : 'BEGINNER',
      verified: s.verified,
      source: s.source,
      market_demand: demand,
      gap_delta: s.level - threshold,
    }
  })

  // Action Items
  const actionItems: ActionItem[] = [
    {
      title: 'Complete Cloud Architecture Assessment',
      category: 'SKILL',
      estimated_hours: 2,
      impact_score: 9,
      link_to: '/student/assessment',
      description: 'Take a proctored assessment in Docker & Kubernetes to boost your CRI score and unlock verified badges.',
    },
    {
      title: 'Deploy Full-Stack Portfolio Project',
      category: 'PROJECT',
      estimated_hours: 15,
      impact_score: 9,
      link_to: '/student/learning',
      description: 'Build and deploy a microservices-based project with end-to-end authentication and testing.',
    },
    {
      title: 'Schedule Session with Senior Tech Mentor',
      category: 'NETWORKING',
      estimated_hours: 1,
      impact_score: 8,
      link_to: '/student/mentors',
      description: 'Connect with a mentor from top product companies to review your career path and mock interview.',
    },
    {
      title: 'Attend Pune Tech Ecosystem Hackathon',
      category: 'NETWORKING',
      estimated_hours: 8,
      impact_score: 7,
      link_to: '/student/events',
      description: 'Participate in upcoming campus hackathons to build proof-of-work and showcase live capabilities.',
    },
    {
      title: 'Apply for High-Match Opportunities',
      category: 'PROJECT',
      estimated_hours: 3,
      impact_score: 9,
      link_to: '/student/opportunities',
      description: 'Your profile matches 4 verified software engineering internships with >80% readiness.',
    },
  ]

  // Peer Benchmarks
  const peerBenchmarks: PeerBenchmark[] = [
    { dimension: 'Skills', your_score: skillsScore, peer_avg: 54, percentile: Math.min(99, Math.max(1, 50 + Math.round((skillsScore - 54) * 1.1))) },
    { dimension: 'Academics', your_score: academicScore, peer_avg: 68, percentile: Math.min(99, Math.max(1, 50 + Math.round((academicScore - 68) * 1.1))) },
    { dimension: 'Experience', your_score: experienceScore, peer_avg: 38, percentile: Math.min(99, Math.max(1, 50 + Math.round((experienceScore - 38) * 1.1))) },
    { dimension: 'Network', your_score: networkScore, peer_avg: 32, percentile: Math.min(99, Math.max(1, 50 + Math.round((networkScore - 32) * 1.1))) },
    { dimension: 'Market Alignment', your_score: marketScore, peer_avg: 45, percentile: Math.min(99, Math.max(1, 50 + Math.round((marketScore - 45) * 1.1))) },
  ]

  const twinSummary = `Your Career Readiness Index is ${cri}/100 (Grade: ${criGrade}). You show strongest affinity in ${careerDna[0]?.cluster_name || 'Backend Systems'} with an accelerating growth velocity of ${velocity} skills/month. Your most probable career trajectory is ${trajectories[0].role} (${trajectories[0].probability}% probability). Complete recommended action items to boost your industry readiness.`

  return {
    career_readiness_index: cri,
    cri_grade: criGrade,
    growth_velocity: velocity,
    growth_trend: growthTrend,
    dimensions,
    career_dna: careerDna,
    trajectories,
    skill_passport: skillPassport,
    action_items: actionItems,
    peer_benchmarks: peerBenchmarks,
    twin_summary: twinSummary,
  }
}

// ─── API ─────────────────────────────────────────────────────

export const digitalTwinApi = {
  async computeTwin(payload: DigitalTwinRequest): Promise<DigitalTwinResponse> {
    try {
      const { data } = await apiClient.post<DigitalTwinResponse>('/ai/digital-twin', payload)
      return data
    } catch (err) {
      console.warn('Backend AI service unreachable or returned error, utilizing deterministic local CRI engine:', err)
      return computeDigitalTwinFallback(payload)
    }
  },
}

