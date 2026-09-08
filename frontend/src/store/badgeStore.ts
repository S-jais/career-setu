import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VerifiableBadge {
  id: string
  skillName: string
  assessmentName: string
  score: number
  earnedAt: string
  verificationHash: string
  level: string
}

export interface UserSkill {
  name: string
  category: string
  level: number
  label: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  verified: boolean
  source: 'ASSESSED' | 'PROJECT_VERIFIED' | 'SELF_DECLARED'
  industry_demand: 'HIGH' | 'MEDIUM' | 'LOW' | 'EMERGING'
}

interface BadgeState {
  badges: VerifiableBadge[]
  skills: UserSkill[]
  addEarnedBadge: (badge: Omit<VerifiableBadge, 'id' | 'earnedAt' | 'verificationHash'>) => void
}

const DEFAULT_BADGES: VerifiableBadge[] = [
  {
    id: 'badge-1',
    skillName: 'Java & Spring Boot Systems',
    assessmentName: 'Java 21+ & Enterprise Architecture',
    score: 92,
    earnedAt: '2026-08-15T10:30:00.000Z',
    verificationHash: '0x8f2d9a...4b12',
    level: 'ADVANCED'
  },
  {
    id: 'badge-2',
    skillName: 'SQL Query Optimization',
    assessmentName: 'Advanced SQL & Query Tuning',
    score: 88,
    earnedAt: '2026-08-20T14:15:00.000Z',
    verificationHash: '0x3c7e1b...9a44',
    level: 'INTERMEDIATE'
  }
]

const DEFAULT_SKILLS: UserSkill[] = [
  { name: 'Java', category: 'Programming', level: 85, label: 'ADVANCED', verified: true, source: 'ASSESSED', industry_demand: 'HIGH' },
  { name: 'SQL', category: 'Databases', level: 78, label: 'INTERMEDIATE', verified: true, source: 'ASSESSED', industry_demand: 'HIGH' },
  { name: 'Python', category: 'Programming', level: 65, label: 'INTERMEDIATE', verified: false, source: 'SELF_DECLARED', industry_demand: 'HIGH' },
  { name: 'Git', category: 'Tools', level: 75, label: 'INTERMEDIATE', verified: true, source: 'PROJECT_VERIFIED', industry_demand: 'HIGH' },
  { name: 'REST APIs', category: 'Web', level: 70, label: 'INTERMEDIATE', verified: true, source: 'PROJECT_VERIFIED', industry_demand: 'HIGH' },
  { name: 'Spring Boot', category: 'Frameworks', level: 60, label: 'INTERMEDIATE', verified: false, source: 'SELF_DECLARED', industry_demand: 'HIGH' },
  { name: 'Docker', category: 'DevOps', level: 35, label: 'BEGINNER', verified: false, source: 'SELF_DECLARED', industry_demand: 'HIGH' },
  { name: 'React', category: 'Web', level: 40, label: 'BEGINNER', verified: false, source: 'SELF_DECLARED', industry_demand: 'HIGH' },
]

export const useBadgeStore = create<BadgeState>()(
  persist(
    (set) => ({
      badges: DEFAULT_BADGES,
      skills: DEFAULT_SKILLS,
      addEarnedBadge: (badgeInput) => {
        const newBadge: VerifiableBadge = {
          ...badgeInput,
          id: `badge-${Date.now()}`,
          earnedAt: new Date().toISOString(),
          verificationHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        }

        set((state) => {
          // Check if skill already exists in skill list, upgrade it to verified
          const updatedSkills = state.skills.map((s) => {
            if (s.name.toLowerCase().includes(badgeInput.skillName.toLowerCase()) ||
                badgeInput.skillName.toLowerCase().includes(s.name.toLowerCase())) {
              return {
                ...s,
                verified: true,
                source: 'ASSESSED' as const,
                level: Math.max(s.level, badgeInput.score),
                label: (badgeInput.score >= 80 ? 'ADVANCED' : 'INTERMEDIATE') as UserSkill['label']
              }
            }
            return s
          })

          // If not in existing skills, add it
          const exists = updatedSkills.some(s => s.name.toLowerCase().includes(badgeInput.skillName.toLowerCase()) || badgeInput.skillName.toLowerCase().includes(s.name.toLowerCase()))
          if (!exists) {
            updatedSkills.push({
              name: badgeInput.skillName,
              category: 'Technical',
              level: badgeInput.score,
              label: (badgeInput.score >= 80 ? 'ADVANCED' : 'INTERMEDIATE') as UserSkill['label'],
              verified: true,
              source: 'ASSESSED',
              industry_demand: 'HIGH'
            })
          }

          return {
            badges: [newBadge, ...state.badges],
            skills: updatedSkills,
          }
        })
      }
    }),
    {
      name: 'careersetu-badges',
    }
  )
)
