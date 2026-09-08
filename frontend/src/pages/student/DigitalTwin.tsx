import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, TrendingUp, Target, Zap, BookOpen, Users, Calendar,
  CheckCircle, AlertCircle, ArrowRight, Shield, Award, Brain,
  ChevronRight, Star, Briefcase, BarChart3, Layers, Clock,
  ArrowUpRight, ArrowDownRight, Minus, Filter, RefreshCw, Loader2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBadgeStore } from '@/store/badgeStore'
import { digitalTwinApi, type DigitalTwinResponse, type DigitalTwinRequest } from '@/api/digitalTwinApi'

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }) }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

// ── CRI Gauge ────────────────────────────────────────────────
function CRIGauge({ score, grade }: { score: number; grade: string }) {
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  const getGradientId = () => {
    if (score >= 80) return 'gaugeGreen'
    if (score >= 60) return 'gaugeBlue'
    if (score >= 40) return 'gaugeAmber'
    return 'gaugeRed'
  }

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="gaugeGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(148, 60%, 42%)" />
            <stop offset="100%" stopColor="hsl(168, 70%, 45%)" />
          </linearGradient>
          <linearGradient id="gaugeBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(224, 75%, 55%)" />
            <stop offset="100%" stopColor="hsl(200, 80%, 50%)" />
          </linearGradient>
          <linearGradient id="gaugeAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(38, 92%, 48%)" />
            <stop offset="100%" stopColor="hsl(28, 90%, 55%)" />
          </linearGradient>
          <linearGradient id="gaugeRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(4, 78%, 53%)" />
            <stop offset="100%" stopColor="hsl(15, 80%, 55%)" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--surface-inset)" strokeWidth="12" />
        {/* Progress arc */}
        <motion.circle
          cx="100" cy="100" r={radius} fill="none"
          stroke={`url(#${getGradientId()})`}
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black font-display"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Grade {grade}
        </span>
      </div>
    </div>
  )
}

// ── Radar Chart (Pentagon) ───────────────────────────────────
function RadarChart({ dimensions }: { dimensions: { name: string; score: number }[] }) {
  const cx = 120, cy = 120, r = 90
  const n = dimensions.length
  const angleStep = (2 * Math.PI) / n

  const getPoint = (i: number, value: number) => {
    const angle = (i * angleStep) - (Math.PI / 2)
    const x = cx + (r * (value / 100)) * Math.cos(angle)
    const y = cy + (r * (value / 100)) * Math.sin(angle)
    return { x, y }
  }

  const polygonPoints = dimensions.map((d, i) => {
    const p = getPoint(i, d.score)
    return `${p.x},${p.y}`
  }).join(' ')

  const gridLevels = [25, 50, 75, 100]

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[260px] mx-auto">
      {/* Grid lines */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={dimensions.map((_, i) => {
            const p = getPoint(i, level)
            return `${p.x},${p.y}`
          }).join(' ')}
          fill="none"
          stroke="var(--border-light)"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}
      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const p = getPoint(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--border-light)" strokeWidth="1" opacity={0.3} />
      })}
      {/* Data polygon */}
      <motion.polygon
        points={polygonPoints}
        fill="hsla(224, 75%, 55%, 0.15)"
        stroke="hsl(224, 75%, 55%)"
        strokeWidth="2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      {/* Data points */}
      {dimensions.map((d, i) => {
        const p = getPoint(i, d.score)
        return (
          <motion.circle
            key={i} cx={p.x} cy={p.y} r="4"
            fill="hsl(224, 75%, 55%)" stroke="white" strokeWidth="2"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
          />
        )
      })}
      {/* Labels */}
      {dimensions.map((d, i) => {
        const p = getPoint(i, 125)
        return (
          <text
            key={i} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] font-semibold"
            fill="var(--text-secondary)"
          >
            {d.name}
          </text>
        )
      })}
    </svg>
  )
}

// ── Section Container ────────────────────────────────────────
function GlassSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`p-6 rounded-2xl border backdrop-blur-sm ${className}`}
      style={{
        background: 'var(--surface-card)',
        borderColor: 'var(--border-light)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)'
      }}
    >
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle, badge }: {
  icon: React.ElementType; title: string; subtitle?: string; badge?: string
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-brand-50)' }}>
          <Icon className="w-4.5 h-4.5" style={{ color: 'var(--color-brand-500)' }} />
        </div>
        <div>
          <h2 className="font-bold font-display" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>
      {badge && (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
          {badge}
        </span>
      )}
    </div>
  )
}

// ── Skill Passport Filter Tabs ───────────────────────────────
type PassportFilter = 'all' | 'verified' | 'gaps' | 'high-demand'

// ── Main Component ───────────────────────────────────────────
export default function DigitalTwin() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { skills: userSkills, badges: userBadges } = useBadgeStore()

  const [twin, setTwin] = useState<DigitalTwinResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passportFilter, setPassportFilter] = useState<PassportFilter>('all')

  const fetchTwin = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload: DigitalTwinRequest = {
        student_name: user?.fullName || 'Student',
        target_role: 'Full Stack Developer',
        skills: userSkills.map(s => ({
          name: s.name,
          level: s.level,
          verified: s.verified,
          source: s.source
        })),
        badges: userBadges.map(b => ({
          skill_name: b.skillName,
          score: b.score,
          level: b.level
        })),
        cgpa: 8.75,
        current_year: 4,
        graduation_year: 2026,
        projects_count: 5,
        internships_count: 1,
        events_attended: 3,
        mentors_connected: 2,
      }
      const result = await digitalTwinApi.computeTwin(payload)
      setTwin(result)
    } catch (err: any) {
      console.error('Digital Twin computation failed:', err)
      setError(err?.message || 'Failed to compute Digital Twin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTwin() }, [])

  const filteredPassport = useMemo(() => {
    if (!twin) return []
    switch (passportFilter) {
      case 'verified': return twin.skill_passport.filter(s => s.verified)
      case 'gaps': return twin.skill_passport.filter(s => s.gap_delta < 0)
      case 'high-demand': return twin.skill_passport.filter(s => s.market_demand === 'HIGH')
      default: return twin.skill_passport
    }
  }, [twin, passportFilter])

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'SKILL': return Target
      case 'PROJECT': return Briefcase
      case 'NETWORKING': return Users
      case 'LEARNING': return BookOpen
      default: return Sparkles
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'SKILL': return 'hsl(224, 75%, 55%)'
      case 'PROJECT': return 'hsl(148, 60%, 42%)'
      case 'NETWORKING': return 'hsl(38, 92%, 48%)'
      case 'LEARNING': return 'hsl(262, 72%, 54%)'
      default: return 'var(--color-brand-500)'
    }
  }

  // ── Loading / Error states ─────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mb-4"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Computing your Career Digital Twin...
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Analyzing skills, benchmarks, and market data
        </p>
      </div>
    )
  }

  if (error || !twin) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertCircle className="w-10 h-10 mb-3" style={{ color: 'var(--color-error)' }} />
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {error || 'Something went wrong'}
        </p>
        <button onClick={fetchTwin} className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white gradient-brand flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    )
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-6">
      {/* ── Hero Header ─────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                Career Digital Twin
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1"
                    style={{ background: 'linear-gradient(135deg, hsl(224,75%,55%), hsl(262,72%,54%))', color: 'white' }}>
                <Sparkles className="w-3 h-3" /> AI-Powered
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Your continuously evolving digital representation of career readiness.
            </p>
          </div>
          <button onClick={fetchTwin} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:shadow-sm"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)', background: 'var(--surface-card)' }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Twin
          </button>
        </div>
      </motion.div>

      {/* ── Summary Banner ──────────────────────────────────── */}
      <motion.div variants={fadeUp} custom={1}>
        <div className="p-4 rounded-2xl border" style={{
          background: 'linear-gradient(135deg, hsla(224,75%,55%,0.05), hsla(262,72%,54%,0.05))',
          borderColor: 'var(--color-brand-200)'
        }}>
          <div className="flex items-start gap-2.5">
            <Brain className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-brand-500)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {twin.twin_summary}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Section 1: CRI Hero ─────────────────────────────── */}
      <motion.div variants={fadeUp} custom={2}>
        <GlassSection>
          <SectionHeader icon={BarChart3} title="Career Readiness Index" subtitle="Your composite career preparedness score" badge={`Grade ${twin.cri_grade}`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Gauge + velocity */}
            <div className="flex flex-col items-center gap-4">
              <CRIGauge score={twin.career_readiness_index} grade={twin.cri_grade} />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'var(--surface-inset)' }}>
                  {twin.growth_trend === 'ACCELERATING' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" style={{ color: 'hsl(148,60%,42%)' }} />
                  ) : twin.growth_trend === 'STEADY' ? (
                    <Minus className="w-3.5 h-3.5" style={{ color: 'hsl(38,92%,48%)' }} />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" style={{ color: 'hsl(4,78%,53%)' }} />
                  )}
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {twin.growth_velocity} skills/mo
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{
                    background: twin.growth_trend === 'ACCELERATING' ? 'hsl(148,60%,92%)' : twin.growth_trend === 'STEADY' ? 'hsl(38,92%,92%)' : 'hsl(4,78%,92%)',
                    color: twin.growth_trend === 'ACCELERATING' ? 'hsl(148,60%,38%)' : twin.growth_trend === 'STEADY' ? 'hsl(38,90%,38%)' : 'hsl(4,78%,45%)'
                  }}>
                    {twin.growth_trend.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Radar chart */}
            <div>
              <RadarChart dimensions={twin.dimensions.map(d => ({ name: d.name, score: d.score }))} />
            </div>
          </div>

          {/* Dimension details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
            {twin.dimensions.map((d, i) => (
              <motion.div key={d.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }}
                className="p-3 rounded-xl border text-center" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-inset)' }}>
                <p className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{d.score}</p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{d.name}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{Math.round(d.weight * 100)}% weight</p>
              </motion.div>
            ))}
          </div>
        </GlassSection>
      </motion.div>

      {/* ── Section 2: Career DNA ───────────────────────────── */}
      <motion.div variants={fadeUp} custom={3}>
        <GlassSection>
          <SectionHeader icon={Layers} title="Career DNA Helix" subtitle="Your top skill clusters and their strength" />
          <div className="space-y-3">
            {twin.career_dna.map((cluster, i) => (
              <motion.div key={cluster.cluster_name}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cluster.color }} />
                  <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>
                    {cluster.cluster_name}
                  </span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: cluster.color }}>
                    {cluster.strength}%
                  </span>
                </div>
                <div className="ml-6">
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-inset)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${cluster.color}, ${cluster.color}AA)` }}
                      initial={{ width: 0 }} animate={{ width: `${cluster.strength}%` }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cluster.skills.map(skill => (
                      <span key={skill} className="text-[11px] font-medium px-2 py-0.5 rounded-md border"
                            style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)', background: 'var(--surface-card)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassSection>
      </motion.div>

      {/* ── Section 3: AI Skill Passport ────────────────────── */}
      <motion.div variants={fadeUp} custom={4}>
        <GlassSection>
          <SectionHeader icon={Shield} title="AI Skill Passport" subtitle="Your verified skill credentials with market intelligence" badge={`${twin.skill_passport.length} Skills`} />

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            {([
              { key: 'all' as PassportFilter, label: 'All', count: twin.skill_passport.length },
              { key: 'verified' as PassportFilter, label: 'Verified', count: twin.skill_passport.filter(s => s.verified).length },
              { key: 'gaps' as PassportFilter, label: 'Gaps', count: twin.skill_passport.filter(s => s.gap_delta < 0).length },
              { key: 'high-demand' as PassportFilter, label: 'High Demand', count: twin.skill_passport.filter(s => s.market_demand === 'HIGH').length },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setPassportFilter(tab.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap"
                style={{
                  background: passportFilter === tab.key ? 'var(--color-brand-50)' : 'transparent',
                  borderColor: passportFilter === tab.key ? 'var(--color-brand-200)' : 'var(--border-light)',
                  color: passportFilter === tab.key ? 'var(--color-brand-600)' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{
                  background: passportFilter === tab.key ? 'var(--color-brand-500)' : 'var(--surface-inset)',
                  color: passportFilter === tab.key ? 'white' : 'var(--text-muted)'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Passport cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredPassport.map((entry, i) => (
                <motion.div
                  key={entry.skill_name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="p-4 rounded-xl border transition-all hover:shadow-sm"
                  style={{ borderColor: 'var(--border-light)', background: 'var(--surface-inset)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{entry.skill_name}</span>
                      {entry.verified && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'hsl(148,60%,42%)' }} />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
                      background: entry.market_demand === 'HIGH' ? 'hsl(148,60%,92%)' :
                                  entry.market_demand === 'EMERGING' ? 'hsl(262,72%,92%)' :
                                  entry.market_demand === 'MEDIUM' ? 'hsl(38,92%,92%)' : 'var(--surface-inset)',
                      color: entry.market_demand === 'HIGH' ? 'hsl(148,60%,38%)' :
                             entry.market_demand === 'EMERGING' ? 'hsl(262,72%,44%)' :
                             entry.market_demand === 'MEDIUM' ? 'hsl(38,90%,38%)' : 'var(--text-muted)'
                    }}>
                      {entry.market_demand}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--border-light)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{
                        background: entry.level >= 70 ? 'hsl(148,60%,42%)' :
                                    entry.level >= 50 ? 'var(--color-brand-500)' :
                                    entry.level >= 30 ? 'hsl(38,92%,48%)' : 'hsl(4,78%,53%)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${entry.level}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{entry.level}/100</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{
                        background: entry.verified ? 'hsl(148,60%,92%)' : 'var(--surface-inset)',
                        color: entry.verified ? 'hsl(148,60%,38%)' : 'var(--text-muted)'
                      }}>
                        {entry.source.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs font-bold flex items-center gap-0.5" style={{
                      color: entry.gap_delta >= 0 ? 'hsl(148,60%,42%)' : 'hsl(4,78%,53%)'
                    }}>
                      {entry.gap_delta >= 0 ? (
                        <><ArrowUpRight className="w-3 h-3" />+{entry.gap_delta}</>
                      ) : (
                        <><ArrowDownRight className="w-3 h-3" />{entry.gap_delta}</>
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassSection>
      </motion.div>

      {/* ── Section 4: Career Trajectory Predictor ──────────── */}
      <motion.div variants={fadeUp} custom={5}>
        <GlassSection>
          <SectionHeader icon={TrendingUp} title="Career Trajectory Predictor" subtitle="AI-predicted career paths based on your profile" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {twin.trajectories.map((traj, i) => (
              <motion.div
                key={traj.role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="p-5 rounded-xl border relative overflow-hidden group"
                style={{
                  borderColor: i === 0 ? 'var(--color-brand-200)' : 'var(--border-light)',
                  background: i === 0 ? 'linear-gradient(135deg, hsla(224,75%,55%,0.04), hsla(224,75%,55%,0.01))' : 'var(--surface-card)'
                }}
              >
                {i === 0 && (
                  <div className="absolute top-0 right-0 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl"
                       style={{ background: 'var(--color-brand-500)', color: 'white' }}>
                    Most Likely
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                       style={{ background: i === 0 ? 'var(--color-brand-50)' : 'var(--surface-inset)' }}>
                    <Briefcase className="w-4 h-4" style={{ color: i === 0 ? 'var(--color-brand-500)' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{traj.role}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{traj.timeline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Probability</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--color-brand-500)' }}>{traj.probability}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-inset)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: 'var(--color-brand-500)' }}
                        initial={{ width: 0 }} animate={{ width: `${traj.probability}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Readiness</span>
                      <span className="text-xs font-bold" style={{ color: 'hsl(148,60%,42%)' }}>{traj.current_readiness}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-inset)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: 'hsl(148,60%,42%)' }}
                        initial={{ width: 0 }} animate={{ width: `${traj.current_readiness}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }} />
                    </div>
                  </div>
                </div>

                {traj.required_skills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Skills to acquire:</p>
                    <div className="flex flex-wrap gap-1">
                      {traj.required_skills.slice(0, 4).map(skill => (
                        <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-md border"
                              style={{ borderColor: 'hsl(4,78%,85%)', color: 'hsl(4,78%,50%)', background: 'hsl(4,78%,96%)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassSection>
      </motion.div>

      {/* ── Section 5: Peer Benchmark ──────────────────────── */}
      <motion.div variants={fadeUp} custom={6}>
        <GlassSection>
          <SectionHeader icon={Users} title="Peer Benchmark Comparison" subtitle="Your ranking vs. peers in your institution & field" />
          <div className="space-y-3">
            {twin.peer_benchmarks.map((bench, i) => (
              <motion.div key={bench.dimension}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-xs font-semibold w-28 text-right" style={{ color: 'var(--text-secondary)' }}>
                  {bench.dimension}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 rounded-lg overflow-hidden relative" style={{ background: 'var(--surface-inset)' }}>
                    {/* Peer avg marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 z-10" style={{
                      left: `${bench.peer_avg}%`,
                      background: 'var(--text-muted)'
                    }} />
                    {/* Your bar */}
                    <motion.div
                      className="h-full rounded-lg"
                      style={{
                        background: bench.your_score >= bench.peer_avg
                          ? 'linear-gradient(90deg, hsl(224,75%,55%), hsl(200,80%,50%))'
                          : 'linear-gradient(90deg, hsl(38,92%,48%), hsl(28,90%,55%))'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${bench.your_score}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[70px]">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{bench.your_score}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{
                      background: bench.percentile >= 70 ? 'hsl(148,60%,92%)' : bench.percentile >= 40 ? 'hsl(38,92%,92%)' : 'hsl(4,78%,92%)',
                      color: bench.percentile >= 70 ? 'hsl(148,60%,38%)' : bench.percentile >= 40 ? 'hsl(38,90%,38%)' : 'hsl(4,78%,45%)'
                    }}>
                      P{bench.percentile}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="flex items-center gap-4 mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <span className="text-xs w-28 text-right" style={{ color: 'var(--text-muted)' }}></span>
              <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: 'var(--text-muted)' }} /> Peer Avg</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: 'hsl(224,75%,55%)' }} /> Your Score</span>
              </div>
            </div>
          </div>
        </GlassSection>
      </motion.div>

      {/* ── Section 6: AI Action Plan ──────────────────────── */}
      <motion.div variants={fadeUp} custom={7}>
        <GlassSection>
          <SectionHeader icon={Sparkles} title="AI Action Plan" subtitle="Personalized steps to accelerate your career readiness" badge="AI Generated" />
          <div className="space-y-3">
            {twin.action_items.map((item, i) => {
              const CatIcon = getCategoryIcon(item.category)
              const catColor = getCategoryColor(item.category)
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer group"
                  style={{ borderColor: 'var(--border-light)', background: 'var(--surface-card)' }}
                  onClick={() => navigate(item.link_to)}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: `${catColor}15` }}>
                    <CatIcon className="w-4.5 h-4.5" style={{ color: catColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                            style={{ background: `${catColor}15`, color: catColor }}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-medium flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3 h-3" /> ~{item.estimated_hours}h
                      </span>
                      <span className="text-[10px] font-medium flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Star className="w-3 h-3" /> Impact: {item.impact_score}/10
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-2"
                               style={{ color: 'var(--text-muted)' }} />
                </motion.div>
              )
            })}
          </div>
        </GlassSection>
      </motion.div>
    </motion.div>
  )
}
