import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ChevronRight, Clock, CheckCircle, XCircle, ArrowRight, Briefcase, Building2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { applicationApi, type StudentApplication } from '@/api/applicationApi'

const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Offered']

const statusConfig: Record<string, { color: string; bg: string; label: string; stage: number }> = {
  APPLIED: { color: 'var(--text-muted)', bg: 'var(--surface-inset)', label: 'Applied', stage: 1 },
  UNDER_REVIEW: { color: 'var(--color-brand-600)', bg: 'var(--color-brand-50)', label: 'Under Review', stage: 2 },
  SHORTLISTED: { color: 'hsl(38,90%,40%)', bg: 'hsl(38,92%,95%)', label: 'Shortlisted', stage: 3 },
  INTERVIEW: { color: 'hsl(262,72%,52%)', bg: 'hsl(262,72%,97%)', label: 'Interview', stage: 4 },
  SELECTED: { color: 'hsl(148,60%,42%)', bg: 'hsl(148,60%,95%)', label: 'Selected', stage: 5 },
  OFFERED: { color: 'hsl(148,60%,42%)', bg: 'hsl(148,60%,95%)', label: 'Offered', stage: 5 },
  REJECTED: { color: 'var(--color-error)', bg: 'hsl(4,78%,97%)', label: 'Rejected', stage: 0 },
  WITHDRAWN: { color: 'var(--text-muted)', bg: 'var(--surface-inset)', label: 'Withdrawn', stage: 0 },
}

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)

  const loadApplications = async () => {
    setLoading(true)
    try {
      const data = await applicationApi.getMyApplications()
      if (data && data.length > 0) {
        setApplications(data)
      } else {
        // Fallback default sample if freshly registered user
        setApplications([
          {
            id: 'demo-app-1',
            opportunityId: 'demo-opp-1',
            opportunityTitle: 'Full Stack AI Software Engineer Intern',
            companyName: 'TechCorp India Private Limited',
            companyBrandName: 'TechCorp India',
            type: 'INTERNSHIP',
            workMode: 'HYBRID',
            locationCity: 'Bengaluru',
            locationState: 'Karnataka',
            stipendMin: 35000,
            stipendMax: 50000,
            status: 'INTERVIEW',
            coverNote: 'Excited to contribute to generative AI tools and modern distributed backend architectures.',
            matchScore: 92.0,
            aiExplanation: '92% compatibility: Candidate demonstrates verified skills in Java, React, and Python.',
            appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            lastActivityAt: new Date(Date.now() - 3600000 * 4).toISOString()
          }
        ])
      }
    } catch (err) {
      console.error('Failed to load applications', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>My Applications</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track your verified applications across the academia-industry hiring funnel.
          </p>
        </div>
        <Link
          to="/student/opportunities"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white gradient-brand shadow-sm hover:opacity-95"
        >
          <Briefcase className="w-3.5 h-3.5" /> Browse More Opportunities
        </Link>
      </div>

      {/* Pipeline stage summary */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {stages.map((stage, i) => {
          const targetStage = i + 1
          const count = applications.filter(a => {
            const conf = statusConfig[a.status] || statusConfig.APPLIED
            return conf.stage === targetStage
          }).length

          return (
            <div key={stage} className="flex items-center">
              <div
                className="text-center px-6 py-3.5 rounded-2xl border flex-shrink-0 transition-all shadow-xs"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
              >
                <p className="text-2xl font-bold font-display" style={{ color: count > 0 ? 'var(--color-brand-500)' : 'var(--text-muted)' }}>
                  {count}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stage}</p>
              </div>
              {i < stages.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" style={{ color: 'var(--border-default)' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Applications list */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="w-8 h-8 mx-auto border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <AlertCircle className="w-8 h-8 mx-auto" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-base font-bold mt-3" style={{ color: 'var(--text-primary)' }}>No applications submitted yet</h3>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-secondary)' }}>
              Explore the Opportunity Marketplace and apply with your verified Career Passport.
            </p>
            <Link
              to="/student/opportunities"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white gradient-brand rounded-xl shadow-sm"
            >
              Discover Opportunities <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          applications.map((app, i) => {
            const config = statusConfig[app.status] || statusConfig.APPLIED
            const companyName = app.companyBrandName || app.companyName || 'Verified Employer'

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border transition-all hover:shadow-sm"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base gradient-brand shadow-xs">
                    {companyName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {app.opportunityTitle}
                        </h3>
                        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {companyName} · {app.locationCity || 'Remote'} · {app.type.replace('_', ' ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.matchScore && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ background: 'hsl(148,60%,92%)', color: 'hsl(148,60%,32%)' }}>
                            {app.matchScore}% Match
                          </span>
                        )}
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0"
                          style={{ background: config.bg, color: config.color }}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {config.stage > 0 && (
                      <div className="flex items-center gap-1.5 mt-3.5">
                        {stages.map((s, idx) => (
                          <div key={s} className="flex-1 flex items-center">
                            <div
                              className="h-1.5 w-full rounded-full transition-all"
                              style={{ background: idx < config.stage ? 'var(--color-brand-500)' : 'var(--surface-inset)' }}
                            />
                          </div>
                        ))}
                        <span className="ml-2 text-[11px] font-semibold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                          Step {config.stage} of 5
                        </span>
                      </div>
                    )}

                    {/* AI Feedback / explanation */}
                    {app.aiExplanation && (
                      <div className="mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2"
                           style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-800)' }}>
                        <span className="font-bold">AI Note:</span>
                        <span>{app.aiExplanation}</span>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t text-xs" style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Applied {formatDate(app.appliedAt)}
                      </span>
                      <span className="font-medium text-brand-600">
                        Active in Recruitment Drive
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}
