import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Lock, Play, Award, Zap, ChevronRight, BookOpen, Clock } from 'lucide-react'

interface SkillNode {
  id: string
  name: string
  tier: 'FOUNDATIONAL' | 'CORE' | 'ADVANCED' | 'SPECIALIZED'
  status: 'VERIFIED' | 'IN_PROGRESS' | 'LOCKED'
  score?: number
  prerequisites: string[]
  estimatedHours: number
  description: string
  projectsCount: number
}

const skillNodes: SkillNode[] = [
  // Foundational
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    tier: 'FOUNDATIONAL',
    status: 'VERIFIED',
    score: 92,
    prerequisites: [],
    estimatedHours: 40,
    description: 'Arrays, Trees, Graphs, Dynamic Programming, and Complexity Analysis.',
    projectsCount: 8
  },
  {
    id: 'sql',
    name: 'Relational DBs & SQL',
    tier: 'FOUNDATIONAL',
    status: 'VERIFIED',
    score: 88,
    prerequisites: [],
    estimatedHours: 25,
    description: 'Schema normalization, indexing strategies, and transactional queries.',
    projectsCount: 6
  },
  {
    id: 'git',
    name: 'Git & Version Control',
    tier: 'FOUNDATIONAL',
    status: 'VERIFIED',
    score: 95,
    prerequisites: [],
    estimatedHours: 15,
    description: 'Branching strategies, interactive rebasing, Git workflows, and CI triggers.',
    projectsCount: 12
  },

  // Core
  {
    id: 'java',
    name: 'Java 21+ & OOP',
    tier: 'CORE',
    status: 'VERIFIED',
    score: 86,
    prerequisites: ['dsa'],
    estimatedHours: 50,
    description: 'Modern Java records, pattern matching, virtual threads, and JVM tuning.',
    projectsCount: 7
  },
  {
    id: 'spring',
    name: 'Spring Boot 3',
    tier: 'CORE',
    status: 'IN_PROGRESS',
    score: 74,
    prerequisites: ['java', 'sql'],
    estimatedHours: 45,
    description: 'REST API architectures, Spring Data JPA, Spring Security with JWT & Argon2id.',
    projectsCount: 4
  },
  {
    id: 'docker',
    name: 'Docker & Containers',
    tier: 'CORE',
    status: 'IN_PROGRESS',
    score: 65,
    prerequisites: ['git'],
    estimatedHours: 20,
    description: 'Multi-stage builds, container networking, volumes, and Docker Compose orchestration.',
    projectsCount: 3
  },

  // Advanced
  {
    id: 'microservices',
    name: 'Distributed Microservices',
    tier: 'ADVANCED',
    status: 'LOCKED',
    prerequisites: ['spring', 'docker'],
    estimatedHours: 60,
    description: 'Service discovery, API gateways, resilience patterns (Circuit Breaker), and observability.',
    projectsCount: 2
  },
  {
    id: 'kafka',
    name: 'Event Streaming (Kafka)',
    tier: 'ADVANCED',
    status: 'LOCKED',
    prerequisites: ['spring'],
    estimatedHours: 35,
    description: 'Event-driven architecture, consumer groups, partition management, and idempotency.',
    projectsCount: 1
  },

  // Specialized
  {
    id: 'ai_systems',
    name: 'LLM & AI Integration',
    tier: 'SPECIALIZED',
    status: 'LOCKED',
    prerequisites: ['microservices'],
    estimatedHours: 40,
    description: 'RAG pipelines, vector databases (pgvector), embeddings, and guardrail validation.',
    projectsCount: 2
  }
]

export default function SkillGraphVisualizer() {
  const [selectedNode, setSelectedNode] = useState<SkillNode>(skillNodes[3]) // Java selected by default

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'FOUNDATIONAL': return '#3b82f6'
      case 'CORE': return '#10b981'
      case 'ADVANCED': return '#8b5cf6'
      case 'SPECIALIZED': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <div className="p-6 rounded-3xl border space-y-6" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Interactive Competency Graph
            </h3>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Track your prerequisite learning tree and unlock higher-tier roles.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Verified</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Locked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Columns (Foundational -> Core -> Advanced) */}
        <div className="lg:col-span-2 space-y-6">
          {(['FOUNDATIONAL', 'CORE', 'ADVANCED', 'SPECIALIZED'] as const).map(tier => {
            const tierNodes = skillNodes.filter(n => n.tier === tier)
            const color = getTierColor(tier)
            return (
              <div key={tier} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
                    {tier} TIER
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {tierNodes.map(node => {
                    const isSelected = selectedNode?.id === node.id
                    return (
                      <motion.button
                        key={node.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedNode(node)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'ring-2 ring-blue-500 shadow-md'
                            : 'hover:border-slate-400'
                        }`}
                        style={{
                          background: isSelected ? 'var(--color-brand-50)' : 'var(--surface-inset)',
                          borderColor: isSelected ? 'var(--color-brand-500)' : 'var(--border-default)'
                        }}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <span className="text-xs font-bold truncate pr-2" style={{ color: 'var(--text-primary)' }}>
                            {node.name}
                          </span>
                          {node.status === 'VERIFIED' && (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          {node.status === 'IN_PROGRESS' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                              {node.score}%
                            </span>
                          )}
                          {node.status === 'LOCKED' && (
                            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          <span>{node.projectsCount} projects</span>
                          <span>{node.estimatedHours}h</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Node Inspector Panel */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-5 rounded-2xl border flex flex-col justify-between"
              style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{
                      background: `${getTierColor(selectedNode.tier)}20`,
                      color: getTierColor(selectedNode.tier)
                    }}
                  >
                    {selectedNode.tier}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Status: <strong className="capitalize">{selectedNode.status.replace('_', ' ').toLowerCase()}</strong>
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedNode.name}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {selectedNode.description}
                  </p>
                </div>

                {/* Score & Progress */}
                {selectedNode.score !== undefined && (
                  <div className="p-3 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span style={{ color: 'var(--text-secondary)' }}>Proficiency Index</span>
                      <span className="font-bold text-blue-600">{selectedNode.score} / 100</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${selectedNode.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                <div>
                  <span className="text-[11px] font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Prerequisites:
                  </span>
                  {selectedNode.prerequisites.length === 0 ? (
                    <span className="text-xs text-slate-400">None (Foundational Entrypoint)</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.prerequisites.map(p => (
                        <span
                          key={p}
                          className="px-2 py-1 rounded-md text-[11px] font-medium border"
                          style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                        >
                          {p.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border-light)' }}>
                {selectedNode.status === 'VERIFIED' && (
                  <button className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 text-white flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
                    <Award className="w-4 h-4" /> View Verifiable Badge
                  </button>
                )}
                {selectedNode.status === 'IN_PROGRESS' && (
                  <button className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow hover:opacity-95 transition"
                          style={{ background: 'var(--color-brand-500)' }}>
                    <Play className="w-3.5 h-3.5" /> Continue Skill Track ({selectedNode.estimatedHours}h left)
                  </button>
                )}
                {selectedNode.status === 'LOCKED' && (
                  <button disabled className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-200 text-slate-500 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" /> Unlock by completing prerequisites
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
