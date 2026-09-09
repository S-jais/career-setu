import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Users, Briefcase, Building2, BarChart3,
  Zap, CheckCircle, ArrowRight, RefreshCw, Sparkles, MapPin
} from 'lucide-react'
import { applicationApi, type OpportunityApplicant } from '@/api/applicationApi'
import { opportunityApi, type Opportunity } from '@/api/opportunityApi'

export default function EmployerDashboard() {
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [applicants, setApplicants] = useState<OpportunityApplicant[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [opps, apps] = await Promise.all([
        opportunityApi.searchOpportunities(),
        applicationApi.getAllApplications()
      ])
      setOpportunities(opps)
      setApplicants(apps)
    } catch (err) {
      console.error('Failed to load employer dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const activeJobsCount = opportunities.filter(o => o.status === 'PUBLISHED').length
  const shortlistedCount = applicants.filter(a => a.status === 'SHORTLISTED').length
  const interviewCount = applicants.filter(a => a.status === 'INTERVIEW').length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Employer Intelligence Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Monitor active opportunities, screening velocity, and candidate pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/employer/jobs')}
            className="btn btn-primary gap-2"
          >
            <Briefcase className="w-4 h-4" /> Manage Opportunities
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Openings', value: activeJobsCount, icon: Briefcase, color: 'var(--color-brand-500)', link: '/employer/jobs' },
          { label: 'Total Applicants', value: applicants.length, icon: Users, color: 'var(--ink-soft)', link: '/employer/applicants' },
          { label: 'Shortlisted Candidates', value: shortlistedCount, icon: CheckCircle, color: 'var(--teal)', link: '/employer/applicants' },
          { label: 'Interviews Scheduled', value: interviewCount, icon: BarChart3, color: 'var(--marigold-deep)', link: '/employer/applicants' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <div
            key={label}
            onClick={() => navigate(link)}
            className="p-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] cursor-pointer hover:border-[var(--ink)] transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[3px] flex items-center justify-center border border-[var(--line)] bg-[var(--mist)]">
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--slate)] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-medium font-display text-[var(--ink)]">{value}</p>
            <p className="text-xs uppercase tracking-wider font-semibold mt-1 text-[var(--slate)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Applicants & Active Openings Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applicants */}
        <div className="lg:col-span-2 p-6 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-base font-display text-[var(--ink)]">
                Recent Candidate Submissions
              </h2>
              <p className="text-xs text-[var(--slate)] opacity-80">Live candidates applying through Career Passport verified profiles.</p>
            </div>
            <button
              onClick={() => navigate('/employer/applicants')}
              className="text-xs font-semibold text-[var(--marigold-deep)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Open ATS Kanban <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {applicants.slice(0, 5).map(app => (
              <div
                key={app.id}
                onClick={() => navigate('/employer/applicants')}
                className="flex items-center gap-4 p-3.5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[3px] bg-[var(--ink)] flex items-center justify-center text-[var(--paper)] text-xs font-semibold shrink-0">
                  {app.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-xs sm:text-sm text-[var(--ink)] truncate">{app.studentName}</p>
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--teal)] shrink-0" />
                  </div>
                  <p className="text-xs truncate text-[var(--slate)] opacity-70">{app.opportunityTitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-[var(--teal)] font-bold text-xs sm:text-sm justify-end">
                    <Sparkles className="w-3 h-3 text-[var(--marigold)]" /> {app.matchScore ?? 85}%
                  </div>
                  <p className="text-[10px] text-[var(--slate)] opacity-60">Match</p>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-[2px] font-semibold uppercase tracking-wider shrink-0 border border-[var(--line)] bg-[var(--mist-dim)] text-[var(--ink)]"
                >
                  {app.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Openings List */}
        <div className="p-6 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm font-display text-[var(--ink)]">
              Active Openings ({opportunities.length})
            </h3>
            <button
              onClick={() => navigate('/employer/jobs')}
              className="text-xs font-semibold text-[var(--marigold-deep)] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.slice(0, 3).map(opp => (
              <div
                key={opp.id}
                onClick={() => navigate('/employer/jobs')}
                className="p-3.5 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-[var(--ink)] line-clamp-1">{opp.title}</h4>
                  <span className="text-[10px] font-semibold text-[var(--teal)]">{opp.type}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--slate)] opacity-80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--ink)]" /> {opp.locationCity || 'India'}
                  </span>
                  <span>{opp.openings || 1} openings</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/employer/jobs')}
            className="btn btn-ghost w-full py-2 text-xs"
          >
            + Post Another Role
          </button>
        </div>
      </div>
    </motion.div>
  )
}
