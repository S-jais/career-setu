import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, TrendingUp, Target, BookOpen, Award, ChevronRight,
  CheckCircle, AlertCircle, ArrowRight, Plus, Sparkles, X
} from 'lucide-react'
import SkillGraphVisualizer from '@/components/skills/SkillGraphVisualizer'
import { skillApi, type SkillItem } from '@/api/skillApi'
import { useBadgeStore, type UserSkill } from '@/store/badgeStore'

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i*0.07 } }) }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

const demandColors: Record<string, string> = { HIGH: 'hsl(148,60%,42%)', MEDIUM: 'hsl(38,92%,48%)', LOW: 'var(--text-muted)', EMERGING: 'var(--color-brand-500)' }
const verificationColors: Record<string, string> = {
  ASSESSED: 'hsl(148,60%,92%)',
  PROJECT_VERIFIED: 'hsl(224,75%,92%)',
  SELF_DECLARED: 'var(--surface-inset)',
}
const verificationTextColors: Record<string, string> = {
  ASSESSED: 'hsl(148,60%,38%)',
  PROJECT_VERIFIED: 'var(--color-brand-600)',
  SELF_DECLARED: 'var(--text-secondary)',
}

function SkillBar({ skill }: { skill: UserSkill }) {
  const getColor = (level: number) => {
    if (level >= 70) return 'hsl(148,60%,42%)'
    if (level >= 50) return 'var(--color-brand-500)'
    if (level >= 30) return 'hsl(38,92%,48%)'
    return 'hsl(4,78%,53%)'
  }

  return (
    <div className="p-4 rounded-xl border transition-all hover:shadow-sm" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{skill.name}</span>
          {skill.verified && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'hsl(148,60%,42%)' }} />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: verificationColors[skill.source], color: verificationTextColors[skill.source] }}>
            {skill.source.replace('_', ' ')}
          </span>
          <span className="text-xs font-bold" style={{ color: getColor(skill.level) }}>{skill.level}/100</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-inset)' }}>
        <motion.div className="h-full rounded-full" style={{ background: getColor(skill.level) }}
                    initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{skill.label}</span>
        <span className="text-xs font-medium flex items-center gap-1" style={{ color: demandColors[skill.industry_demand] }}>
          <TrendingUp className="w-3 h-3" /> {skill.industry_demand} demand
        </span>
      </div>
    </div>
  )
}

export default function SkillIntelligence() {
  const navigate = useNavigate()
  const { skills: userSkills, badges } = useBadgeStore()
  const [catalogSkills, setCatalogSkills] = useState<SkillItem[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')

  useEffect(() => {
    skillApi.getSkills()
      .then(res => setCatalogSkills(res))
      .catch(err => console.error('Failed to load skills catalog:', err))
  }, [])

  // Dynamic statistics
  const verifiedCount = userSkills.filter(s => s.verified).length
  const assessedCount = badges.length
  const avgScore = userSkills.length > 0
    ? Math.round(userSkills.reduce((acc, s) => acc + s.level, 0) / userSkills.length)
    : 70

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Skill Intelligence</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Assess your skills, close curriculum gaps, and earn verifiable badges.
          </p>
        </div>
        <button
          onClick={() => navigate('/student/assessment')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-md hover:shadow-lg transition-all"
        >
          <Award className="w-4 h-4" /> Take Assessment <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Score summary cards */}
      <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Competency Index', value: `${avgScore}/100`, icon: Zap, color: 'var(--color-brand-500)' },
          { label: 'Verified Skills', value: `${verifiedCount} / ${userSkills.length}`, icon: CheckCircle, color: 'hsl(148,60%,42%)' },
          { label: 'Verifiable Badges Earned', value: `${assessedCount}`, icon: Award, color: 'hsl(38,92%,48%)' },
          { label: 'Market Demand Level', value: 'VERY HIGH', icon: TrendingUp, color: 'hsl(4,78%,53%)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
          </div>
        ))}
      </motion.div>

      {/* Interactive Skill Competency Graph */}
      <motion.div variants={fadeUp} custom={2}>
        <SkillGraphVisualizer />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills list */}
        <motion.div variants={fadeUp} custom={2} className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold font-display text-base" style={{ color: 'var(--text-primary)' }}>
              Your Skill Profile ({userSkills.length})
            </h2>
            <button
              onClick={() => navigate('/student/assessment')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Verify More Skills <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {userSkills.map(skill => <SkillBar key={skill.name} skill={skill} />)}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-1.5 hover:bg-blue-50/50"
            style={{ borderColor: 'var(--border-default)', color: 'var(--color-brand-600)', background: 'var(--surface-card)' }}
          >
            <Plus className="w-4 h-4" /> Add or Declare New Skill
          </button>
        </motion.div>

        {/* Right panel */}
        <motion.div variants={fadeUp} custom={3} className="space-y-4">
          {/* Live Catalog High Demand Skills */}
          <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h2 className="font-semibold text-sm font-display" style={{ color: 'var(--text-primary)' }}>
                High-Demand Tech Skills
              </h2>
            </div>
            <p className="text-xs mb-3 text-slate-500">Live taxonomy from national industry hiring standards.</p>
            <div className="flex flex-wrap gap-1.5">
              {catalogSkills.map(s => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
                >
                  {s.name}
                  {s.industryDemand === 'HIGH' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="High Demand" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Gap analysis */}
          <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" style={{ color: 'var(--color-brand-500)' }} />
              <h2 className="font-semibold text-sm font-display" style={{ color: 'var(--text-primary)' }}>Gap Analysis</h2>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Target Role: Full Stack Software Engineer</p>
            <div className="space-y-3">
              {[
                { skill: 'Docker & Kubernetes', gap: 35, priority: 'HIGH' },
                { skill: 'Microservices & Redis', gap: 25, priority: 'HIGH' },
                { skill: 'GraphQL / gRPC', gap: 15, priority: 'MEDIUM' },
              ].map(({ skill, priority }) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold" style={{ color: priority === 'HIGH' ? 'var(--color-error)' : 'var(--color-warning)' }}>{priority}</span>
                    <AlertCircle className="w-3.5 h-3.5" style={{ color: priority === 'HIGH' ? 'var(--color-error)' : 'var(--color-warning)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning roadmap CTA */}
          <div className="p-5 rounded-2xl border gradient-brand text-white shadow-sm">
            <BookOpen className="w-6 h-6 mb-3 opacity-90" />
            <h3 className="font-semibold font-display mb-1 text-base">Personalized Learning Roadmap</h3>
            <p className="text-xs opacity-85 mb-4 leading-relaxed">
              AI-tailored 12-week roadmap to bridge your competency gaps and unlock Tier-1 company applications.
            </p>
            <button
              onClick={() => navigate('/student/copilot')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-white text-blue-600 transition-opacity hover:opacity-95 shadow-sm"
            >
              Generate With AI Copilot
            </button>
          </div>

          {/* Verification guide */}
          <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <h2 className="font-semibold text-sm font-display mb-3" style={{ color: 'var(--text-primary)' }}>Skill Verification Guide</h2>
            {[
              { status: 'ASSESSED', desc: 'Verified through platform coding challenge', color: 'hsl(148,60%,42%)' },
              { status: 'PROJECT VERIFIED', desc: 'Validated in inspected git repository', color: 'var(--color-brand-500)' },
              { status: 'SELF DECLARED', desc: 'Declared by student, pending evaluation', color: 'var(--text-muted)' },
            ].map(({ status, desc, color }) => (
              <div key={status} className="flex items-center gap-2.5 mb-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{status}: </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6 border shadow-xl space-y-4"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Add or Declare Skill</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Skill Name or Keyword
                </label>
                <input
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js, Redis, GraphQL"
                  className="w-full p-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                />
              </div>

              <p className="text-xs text-slate-500">
                Newly declared skills will be marked as <strong className="text-amber-600">SELF DECLARED</strong>. Complete a skill assessment to verify and mint an immutable badge.
              </p>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newSkillName.trim()) {
                      useBadgeStore.setState((st) => ({
                        skills: [
                          ...st.skills,
                          {
                            name: newSkillName.trim(),
                            category: 'Technical',
                            level: 50,
                            label: 'INTERMEDIATE',
                            verified: false,
                            source: 'SELF_DECLARED',
                            industry_demand: 'HIGH'
                          }
                        ]
                      }))
                      setNewSkillName('')
                      setIsAddModalOpen(false)
                    }
                  }}
                  disabled={!newSkillName.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-brand disabled:opacity-50"
                >
                  Save Skill
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
