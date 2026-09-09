import { motion, type Variants } from 'framer-motion'
import {
  TrendingUp, Target, Zap, Briefcase, ArrowRight,
  Brain, ChevronRight, Building2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' as const } })
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }

// Stat card (Flat, Fraunces number, hairline border, 3px radius)
function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string
}) {
  return (
    <div className="p-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)]">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-[3px] flex items-center justify-center border border-[var(--line)]" style={{ background: 'var(--mist)' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-medium font-display text-[var(--ink)]">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)] mt-1">{label}</p>
      {sub && <p className="text-xs text-[var(--slate)] opacity-70 mt-1">{sub}</p>}
    </div>
  )
}

// Opportunity mini card
function OpportunityMini({ company, role, type, match, deadline }: {
  company: string; role: string; type: string; match: number; deadline: string
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] transition-colors hover:border-[var(--ink)] cursor-pointer group">
      <div className="w-8 h-8 rounded-[3px] flex items-center justify-center shrink-0 border border-[var(--line)] bg-[var(--mist)]">
        <Building2 className="w-4 h-4 text-[var(--ink)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--ink)] truncate">{role}</p>
        <p className="text-[11px] text-[var(--slate)] opacity-80">{company} · {type}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-xs font-bold text-[var(--teal)]">{match}%</span>
        <span className="text-[11px] text-[var(--slate)] opacity-70">{deadline}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--slate)] opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <h1 className="text-2xl sm:text-3xl font-medium font-display text-[var(--ink)]">
              Good morning, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[var(--slate)] mt-1">
              Here is your career intelligence overview for today.
            </p>
          </div>
          <Link
            to="/student/opportunities"
            className="hidden sm:inline-flex btn btn-primary text-xs py-2 px-3.5 gap-1.5"
          >
            <span>Find Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Next Best Action — AI (Paper card with 3px teal border-left accent) */}
      <motion.div
        variants={fadeUp}
        custom={1}
        className="p-5 rounded-[3px] border border-[var(--line)] border-l-[3px] border-l-[var(--teal)] bg-[var(--paper)] flex items-start gap-4"
      >
        <div className="w-9 h-9 rounded-[3px] bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center shrink-0">
          <Brain className="w-4.5 h-4.5 text-[var(--marigold)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold text-[var(--ink)] uppercase tracking-wider">AI Career Copilot — Next Best Action</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[2px] bg-[var(--mist-dim)] text-[var(--ink)] border border-[var(--line)]">
              AI-Assisted
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--slate)] leading-relaxed">
            Complete <strong>Docker fundamentals</strong> to improve your backend-role readiness from 72% to 85%. This will unlock 14 additional matched opportunities.
          </p>
        </div>
        <Link
          to="/student/copilot"
          className="shrink-0 btn btn-primary text-xs py-1.5 px-3"
        >
          View Plan
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Career Readiness" value="72%" sub="+8 this month" icon={TrendingUp} color="var(--ink)" />
        <StatCard label="Profile Complete" value="68%" sub="5 sections remaining" icon={Target} color="var(--marigold-deep)" />
        <StatCard label="Skills Verified" value="12" sub="of 23 declared" icon={Zap} color="var(--teal)" />
        <StatCard label="Applications" value="8" sub="3 in review" icon={Briefcase} color="var(--ink-soft)" />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended opportunities */}
        <motion.div variants={fadeUp} custom={3} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-medium text-lg text-[var(--ink)]">Top Matches for You</h2>
            <Link to="/student/opportunities" className="text-xs font-semibold text-[var(--marigold-deep)] hover:underline">
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
          <div className="p-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-medium text-sm text-[var(--ink)]">Top Skill Gaps</h2>
              <Link to="/student/skills" className="text-xs font-semibold text-[var(--marigold-deep)] hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {[
                { skill: 'Spring Boot', current: 45, required: 80, priority: 'HIGH' },
                { skill: 'Docker', current: 25, required: 65, priority: 'HIGH' },
                { skill: 'REST APIs', current: 65, required: 75, priority: 'MED' },
              ].map(({ skill, current, required, priority }) => (
                <div key={skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[var(--ink)]">{skill}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold"
                            style={{ color: priority === 'HIGH' ? 'var(--color-error)' : 'var(--marigold-deep)' }}>
                        {priority}
                      </span>
                      <span className="text-[10px] text-[var(--slate)] opacity-70">{current}→{required}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-[1px] bg-[var(--mist-dim)] overflow-hidden">
                    <div className="h-full bg-[var(--ink)]" style={{ width: `${current}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/student/assessment"
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-[3px] text-xs font-semibold border border-[var(--line)] bg-[var(--mist-dim)] text-[var(--ink)] hover:bg-[var(--paper)] hover:border-[var(--ink)] transition-colors"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Upcoming deadlines */}
          <div className="p-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)]">
            <h2 className="font-display font-medium text-sm text-[var(--ink)] mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {[
                { title: 'TechCorp Application', date: 'Sep 12', type: 'deadline', urgent: true },
                { title: 'DataVision Application', date: 'Sep 15', type: 'deadline', urgent: false },
                { title: 'Career Fair Registration', date: 'Sep 18', type: 'event', urgent: false },
              ].map(({ title, date, type, urgent }) => (
                <div key={title} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: urgent ? 'var(--color-error)' : 'var(--teal)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--ink)] truncate">{title}</p>
                    <p className="text-[10px] text-[var(--slate)] opacity-70">{type}</p>
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: urgent ? 'var(--color-error)' : 'var(--slate)' }}
                  >
                    {date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Application pipeline */}
      <motion.div variants={fadeUp} custom={5} className="p-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-medium text-lg text-[var(--ink)]">Application Pipeline</h2>
          <Link to="/student/applications" className="text-xs font-semibold text-[var(--marigold-deep)] hover:underline">View all →</Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { stage: 'Applied', count: 8, color: 'var(--slate)' },
            { stage: 'Under Review', count: 3, color: 'var(--ink)' },
            { stage: 'Shortlisted', count: 2, color: 'var(--marigold-deep)' },
            { stage: 'Interview', count: 1, color: 'var(--teal)' },
            { stage: 'Offered', count: 0, color: 'var(--teal)' },
          ].map(({ stage, count, color }, i) => (
            <div key={stage} className="flex items-center">
              <div className="text-center px-4 py-3 rounded-[3px] border border-[var(--line)] bg-[var(--mist-dim)] shrink-0 min-w-[90px]">
                <p className="text-xl font-medium font-display" style={{ color }}>{count}</p>
                <p className="text-[11px] text-[var(--slate)] mt-0.5">{stage}</p>
              </div>
              {i < 4 && <ChevronRight className="w-4 h-4 mx-1.5 shrink-0 text-[var(--line)]" />}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
