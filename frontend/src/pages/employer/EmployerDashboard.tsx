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
            className="p-2.5 rounded-xl border hover:bg-slate-50 transition"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/employer/jobs')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:shadow-md transition"
          >
            <Briefcase className="w-4 h-4" /> Manage Opportunities
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Openings', value: activeJobsCount, icon: Briefcase, color: 'var(--color-brand-500)', link: '/employer/jobs' },
          { label: 'Total Applicants', value: applicants.length, icon: Users, color: 'hsl(262,72%,52%)', link: '/employer/applicants' },
          { label: 'Shortlisted Candidates', value: shortlistedCount, icon: CheckCircle, color: 'hsl(148,60%,42%)', link: '/employer/applicants' },
          { label: 'Interviews Scheduled', value: interviewCount, icon: BarChart3, color: 'hsl(38,92%,48%)', link: '/employer/applicants' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <div
            key={label}
            onClick={() => navigate(link)}
            className="p-5 rounded-2xl border cursor-pointer hover:shadow-md transition-all group"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs mt-1 text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Applicants & Active Openings Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applicants */}
        <div className="lg:col-span-2 p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base font-display" style={{ color: 'var(--text-primary)' }}>
                Recent Candidate Submissions
              </h2>
              <p className="text-xs text-slate-500">Live candidates applying through Career Passport verified profiles.</p>
            </div>
            <button
              onClick={() => navigate('/employer/applicants')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Open ATS Kanban <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {applicants.slice(0, 5).map(app => (
              <div
                key={app.id}
                onClick={() => navigate('/employer/applicants')}
                className="flex items-center gap-4 p-3.5 rounded-xl border transition hover:shadow-sm cursor-pointer"
                style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}
              >
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {app.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{app.studentName}</p>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  </div>
                  <p className="text-xs truncate text-slate-500">{app.opportunityTitle}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm justify-end">
                    <Sparkles className="w-3 h-3" /> {app.matchScore ?? 85}%
                  </div>
                  <p className="text-[10px] text-slate-400">Match</p>
                </div>
                <span
                  className="text-[11px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider flex-shrink-0 border"
                  style={{
                    background: app.status === 'OFFERED' ? 'hsl(148,60%,92%)' : 'var(--surface-inset)',
                    color: app.status === 'OFFERED' ? 'hsl(148,60%,32%)' : 'var(--text-secondary)',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  {app.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Openings List */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>
              Active Openings ({opportunities.length})
            </h3>
            <button
              onClick={() => navigate('/employer/jobs')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.slice(0, 3).map(opp => (
              <div
                key={opp.id}
                onClick={() => navigate('/employer/jobs')}
                className="p-3.5 rounded-xl border transition hover:border-blue-300 cursor-pointer"
                style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{opp.title}</h4>
                  <span className="text-[10px] font-semibold text-emerald-600">{opp.type}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-500" /> {opp.locationCity || 'India'}
                  </span>
                  <span>{opp.openings || 1} openings</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/employer/jobs')}
            className="w-full py-2.5 rounded-xl border text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 transition"
          >
            + Post Another Role
          </button>
        </div>
      </div>
    </motion.div>
  )
}
