import { motion, type Variants } from 'framer-motion'
import {
  TrendingUp, Target, Zap, Briefcase, CheckCircle, ArrowRight,
  Brain, BookOpen, Calendar, Bell, Star, Clock, ChevronRight,
  Building2, MapPin, DollarSign, Award
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' as const } })
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

// Stat card
function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string
}) {
  return (
    <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
  )
}

// Opportunity mini card
function OpportunityMini({ company, role, type, match, deadline }: {
  company: string; role: string; type: string; match: number; deadline: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer group"
         style={{ borderColor: 'var(--border-light)', background: 'var(--surface-card)' }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
           style={{ background: 'var(--color-brand-50)' }}>
        <Building2 className="w-4 h-4" style={{ color: 'var(--color-brand-500)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{role}</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{company} · {type}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-bold" style={{ color: 'var(--color-success)' }}>{match}%</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{deadline}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text-muted)' }} />
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const firstName = user?.fullName?.split(' ')[0] || 'Student'

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
              Good morning, {firstName} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Here's your career intelligence overview for today.
            </p>
          </div>
          <Link to="/student/opportunities"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white gradient-brand">
            Find Opportunities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Next Best Action — AI */}
      <motion.div variants={fadeUp} custom={1}
                  className="p-5 rounded-2xl border-2 flex items-start gap-4"
                  style={{ borderColor: 'var(--color-brand-200)', background: 'var(--color-brand-50)' }}>
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-brand-700)' }}>AI Career Copilot — Next Best Action</p>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-brand-100)', color: 'var(--color-brand-600)' }}>
              AI-Assisted
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-brand-600)' }}>
            Complete <strong>Docker fundamentals</strong> to improve your backend-role readiness from 72% to 85%. This will unlock 14 additional matched opportunities.
          </p>
        </div>
        <Link to="/student/copilot"
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-white gradient-brand">
          View Plan
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Career Readiness" value="72%" sub="+8 this month" icon={TrendingUp} color="var(--color-brand-500)" />
        <StatCard label="Profile Complete" value="68%" sub="5 sections remaining" icon={Target} color="hsl(38, 92%, 48%)" />
        <StatCard label="Skills Verified" value="12" sub="of 23 declared" icon={Zap} color="hsl(148, 60%, 42%)" />
        <StatCard label="Applications" value="8" sub="3 in review" icon={Briefcase} color="hsl(262, 72%, 52%)" />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended opportunities */}
        <motion.div variants={fadeUp} custom={3} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold font-display" style={{ color: 'var(--text-primary)' }}>Top Matches for You</h2>
            <Link to="/student/opportunities" className="text-xs font-medium" style={{ color: 'var(--color-brand-500)' }}>
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { company: 'TechCorp India', role: 'Backend Developer Intern', type: 'INTERNSHIP', match: 87, deadline: '12 Sep' },
              { company: 'DataVision Analytics', role: 'Data Science Intern', type: 'INTERNSHIP', match: 79, deadline: '15 Sep' },
              { company: 'InnovateSoft', role: 'Full Stack Developer', type: 'JOB', match: 74, deadline: '20 Sep' },
              { company: 'FinTech Solutions', role: 'Java Developer Intern', type: 'INTERNSHIP', match: 71, deadline: '25 Sep' },
            ].map((opp) => (
              <OpportunityMini key={opp.role} {...opp} />
            ))}
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div variants={fadeUp} custom={4} className="space-y-4">
          {/* Skill gaps */}
          <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold font-display text-sm" style={{ color: 'var(--text-primary)' }}>Top Skill Gaps</h2>
              <Link to="/student/skills" className="text-xs" style={{ color: 'var(--color-brand-500)' }}>View all</Link>
            </div>
            <div className="space-y-3">
              {[
                { skill: 'Spring Boot', current: 45, required: 80, priority: 'HIGH' },
                { skill: 'Docker', current: 25, required: 65, priority: 'HIGH' },
                { skill: 'REST APIs', current: 65, required: 75, priority: 'MED' },
              ].map(({ skill, current, required, priority }) => (
                <div key={skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold"
                            style={{ color: priority === 'HIGH' ? 'var(--color-error)' : 'var(--color-warning)' }}>
                        {priority}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{current}→{required}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-inset)' }}>
                    <div className="h-full rounded-full" style={{ background: 'var(--color-brand-500)', width: `${current}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/student/assessment"
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-colors"
                  style={{ color: 'var(--color-brand-600)', borderColor: 'var(--color-brand-200)', background: 'var(--color-brand-50)' }}>
              Take Assessment <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Upcoming deadlines */}
          <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <h2 className="font-semibold font-display text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines</h2>
            <div className="space-y-3">
              {[
                { title: 'TechCorp Application', date: 'Sep 12', type: 'deadline', urgent: true },
                { title: 'DataVision Application', date: 'Sep 15', type: 'deadline', urgent: false },
                { title: 'Career Fair Registration', date: 'Sep 18', type: 'event', urgent: false },
              ].map(({ title, date, type, urgent }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${urgent ? '' : ''}`}
                       style={{ background: urgent ? 'var(--color-error)' : 'var(--color-brand-400)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{type}</p>
                  </div>
                  <span className={`text-xs font-semibold`}
                        style={{ color: urgent ? 'var(--color-error)' : 'var(--text-secondary)' }}>
                    {date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Application pipeline */}
      <motion.div variants={fadeUp} custom={5} className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold font-display" style={{ color: 'var(--text-primary)' }}>Application Pipeline</h2>
          <Link to="/student/applications" className="text-xs font-medium" style={{ color: 'var(--color-brand-500)' }}>View all →</Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { stage: 'Applied', count: 8, color: 'var(--text-muted)' },
            { stage: 'Under Review', count: 3, color: 'var(--color-brand-500)' },
            { stage: 'Shortlisted', count: 2, color: 'hsl(38, 92%, 48%)' },
            { stage: 'Interview', count: 1, color: 'hsl(262, 72%, 52%)' },
            { stage: 'Offered', count: 0, color: 'hsl(148, 60%, 42%)' },
          ].map(({ stage, count, color }, i) => (
            <div key={stage} className="flex items-center">
              <div className="text-center px-4 py-3 rounded-xl border flex-shrink-0"
                   style={{ borderColor: 'var(--border-light)', background: 'var(--surface-inset)' }}>
                <p className="text-xl font-bold font-display" style={{ color }}>{count}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stage}</p>
              </div>
              {i < 4 && <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" style={{ color: 'var(--border-default)' }} />}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
