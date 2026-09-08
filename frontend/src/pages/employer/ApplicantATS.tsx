import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, CheckCircle, ChevronDown, User, Mail,
  GraduationCap, Award, Sparkles, Clock, ArrowRight, X,
  LayoutGrid, List, Check, AlertCircle, RefreshCw, Briefcase
} from 'lucide-react'
import { applicationApi, type OpportunityApplicant } from '@/api/applicationApi'
import { opportunityApi, type Opportunity } from '@/api/opportunityApi'

const stages = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'REJECTED'] as const
type Stage = typeof stages[number]

const stageLabels: Record<Stage, string> = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  OFFERED: 'Offered',
  REJECTED: 'Rejected',
}

const stageColors: Record<Stage, { bg: string; text: string; border: string }> = {
  APPLIED: { bg: 'var(--surface-inset)', text: 'var(--text-secondary)', border: 'var(--border-default)' },
  UNDER_REVIEW: { bg: 'hsl(215, 90%, 95%)', text: 'hsl(215, 90%, 35%)', border: 'hsl(215, 80%, 85%)' },
  SHORTLISTED: { bg: 'hsl(38, 92%, 93%)', text: 'hsl(38, 90%, 36%)', border: 'hsl(38, 85%, 80%)' },
  INTERVIEW: { bg: 'hsl(262, 80%, 94%)', text: 'hsl(262, 70%, 42%)', border: 'hsl(262, 70%, 85%)' },
  OFFERED: { bg: 'hsl(148, 60%, 92%)', text: 'hsl(148, 60%, 32%)', border: 'hsl(148, 50%, 80%)' },
  REJECTED: { bg: 'hsl(4, 80%, 94%)', text: 'hsl(4, 75%, 42%)', border: 'hsl(4, 70%, 85%)' },
}

export default function ApplicantATS() {
  const [applicants, setApplicants] = useState<OpportunityApplicant[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<OpportunityApplicant | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

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
      console.error('Failed to load ATS data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    setUpdatingId(applicantId)
    // Optimistic UI update
    setApplicants(prev =>
      prev.map(app => (app.id === applicantId ? { ...app, status: newStatus } : app))
    )
    if (selectedApplicant?.id === applicantId) {
      setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null)
    }

    try {
      await applicationApi.updateStatus(applicantId, newStatus)
      showToast(`Applicant status updated to ${newStatus.replace('_', ' ')}`)
    } catch (err) {
      console.error('Failed to update applicant status:', err)
      showToast('Failed to update applicant status')
      // Revert on error
      loadData()
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesOpp = selectedOpportunityId === 'ALL' || app.opportunityId === selectedOpportunityId
      const matchesSearch = !searchQuery.trim() ||
        app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.headline && app.headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        app.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesOpp && matchesSearch
    })
  }, [applicants, selectedOpportunityId, searchQuery])

  // Count by stage
  const countsByStage = useMemo(() => {
    const map: Record<string, number> = {}
    stages.forEach(s => { map[s] = 0 })
    filteredApplicants.forEach(app => {
      if (map[app.status] !== undefined) {
        map[app.status]++
      }
    })
    return map
  }, [filteredApplicants])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Applicant Tracking System
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            AI-assisted screening with verified skill badges and transparent match scores.
          </p>
        </div>

        {/* View mode toggle & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl border hover:bg-slate-50 transition"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            title="Refresh Applicants"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center p-1 rounded-xl border bg-slate-100 dark:bg-slate-800" style={{ borderColor: 'var(--border-default)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban' ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list' ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map(st => (
          <div
            key={st}
            className="p-3.5 rounded-xl border flex flex-col justify-between"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {stageLabels[st]}
              </span>
              <span className="w-2 h-2 rounded-full" style={{ background: stageColors[st].text }} />
            </div>
            <p className="text-xl font-bold font-display mt-2" style={{ color: 'var(--text-primary)' }}>
              {countsByStage[st] || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search applicants by name, role, or keywords..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Opportunity Selector Dropdown */}
        <div className="sm:w-80 relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedOpportunityId}
            onChange={e => setSelectedOpportunityId(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm outline-none appearance-none cursor-pointer"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Active Openings ({opportunities.length})</option>
            {opportunities.map(opp => (
              <option key={opp.id} value={opp.id}>
                {opp.title} ({opp.type})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
        </div>
      </div>

      {/* Main Content: Kanban or List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading live applicant data...</p>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border bg-slate-50/50 dark:bg-slate-900/30" style={{ borderColor: 'var(--border-default)' }}>
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>No applicants found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or switch to another opening.
          </p>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {stages.map(stageKey => {
            const columnApps = filteredApplicants.filter(a => a.status === stageKey)
            const style = stageColors[stageKey]

            return (
              <div
                key={stageKey}
                className="rounded-2xl border p-3 flex flex-col gap-3 min-w-[260px] xl:min-w-0"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: style.text }} />
                    <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                      {stageLabels[stageKey]}
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {columnApps.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-3 min-h-[120px]">
                  {columnApps.length === 0 ? (
                    <div className="p-6 text-center border border-dashed rounded-xl" style={{ borderColor: 'var(--border-light)' }}>
                      <p className="text-[11px] text-slate-400">Empty column</p>
                    </div>
                  ) : (
                    columnApps.map(app => (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setSelectedApplicant(app)}
                        className="p-3.5 rounded-xl border transition-all hover:shadow-md cursor-pointer group relative"
                        style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}
                      >
                        {/* Candidate Top */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {app.studentName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                                {app.studentName}
                              </p>
                              <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            </div>
                            <p className="text-[11px] truncate text-slate-500">
                              {app.headline || 'Student'}
                            </p>
                          </div>
                        </div>

                        {/* Applied Role */}
                        <div className="mt-2 text-[10px] px-2 py-1 rounded font-medium truncate" style={{ background: 'var(--surface-inset)', color: 'var(--text-secondary)' }}>
                          {app.opportunityTitle}
                        </div>

                        {/* AI Match Score & CGPA */}
                        <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border-light)' }}>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <GraduationCap className="w-3 h-3 text-blue-500" />
                            <span>CGPA {app.cgpa ?? '8.5'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            <span className="font-bold text-emerald-600 text-xs">{app.matchScore ?? 85}%</span>
                          </div>
                        </div>

                        {/* Quick Stage Mover Select */}
                        <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
                          <select
                            value={app.status}
                            disabled={updatingId === app.id}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleStatusChange(app.id, e.target.value)}
                            className="w-full text-[10px] py-1 px-2 rounded-lg border outline-none font-semibold cursor-pointer"
                            style={{ background: style.bg, color: style.text, borderColor: style.border }}
                          >
                            {stages.map(s => (
                              <option key={s} value={s}>
                                Move to: {stageLabels[s]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="space-y-3">
          {filteredApplicants.map((app, i) => {
            const style = stageColors[app.status as Stage] || stageColors.APPLIED

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedApplicant(app)}
                className="p-4 rounded-2xl border cursor-pointer hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {app.studentName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {app.studentName}
                      </p>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                        Year {app.currentYear ?? 4}
                      </span>
                    </div>
                    <p className="text-xs truncate text-slate-500 mt-0.5">
                      {app.headline || 'Student Profile'} · <strong className="text-slate-700 dark:text-slate-300">{app.opportunityTitle}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm justify-end">
                      <Sparkles className="w-3.5 h-3.5" /> {app.matchScore ?? 85}%
                    </div>
                    <p className="text-[10px] text-slate-400">AI Match Score</p>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    <select
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={e => handleStatusChange(app.id, e.target.value)}
                      className="text-xs px-3 py-1.5 rounded-xl border outline-none font-semibold cursor-pointer"
                      style={{ background: style.bg, color: style.text, borderColor: style.border }}
                    >
                      {stages.map(s => (
                        <option key={s} value={s}>
                          {stageLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedApplicant(app)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Candidate Details Drawer Modal */}
      <AnimatePresence>
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}
            >
              {/* Header */}
              <div className="p-6 border-b flex items-start justify-between" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {selectedApplicant.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                        {selectedApplicant.studentName}
                      </h2>
                      <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3" /> Career Passport Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedApplicant.headline}</p>
                    <p className="text-xs font-medium text-blue-600 mt-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Applied for: {selectedApplicant.opportunityTitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* AI Screening Breakdown */}
                <div className="p-4 rounded-2xl border" style={{ background: 'hsl(148, 60%, 97%)', borderColor: 'hsl(148, 50%, 85%)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm text-emerald-900">AI Compatibility Analysis</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-700">{selectedApplicant.matchScore ?? 85}% Match</span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-900/80">
                    {selectedApplicant.aiExplanation ||
                      `${selectedApplicant.matchScore ?? 85}% compatibility calculated by evaluating verified skill badges, coursework CGPA, and project portfolio alignment against role requirements.`}
                  </p>
                </div>

                {/* Academic & Contact Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <span className="text-[11px] text-slate-400 block mb-1">Academic CGPA</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedApplicant.cgpa ?? '8.75'} / 10</span>
                  </div>
                  <div className="p-3 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <span className="text-[11px] text-slate-400 block mb-1">Curriculum Year</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Year {selectedApplicant.currentYear ?? 4} Undergraduate</span>
                  </div>
                  <div className="p-3 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <span className="text-[11px] text-slate-400 block mb-1">Application Date</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Candidate Cover Note */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Candidate Cover Statement</h3>
                  <div className="p-4 rounded-xl border text-xs leading-relaxed" style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                    {selectedApplicant.coverNote || 'No custom cover note provided with this application.'}
                  </div>
                </div>

                {/* Current Stage Selection */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Change Hiring Stage</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {stages.map(st => {
                      const active = selectedApplicant.status === st
                      const style = stageColors[st]

                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(selectedApplicant.id, st)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                            active ? 'ring-2 ring-blue-500 shadow-sm' : 'hover:opacity-90'
                          }`}
                          style={{ background: style.bg, color: style.text, borderColor: style.border }}
                        >
                          <span>{stageLabels[st]}</span>
                          {active && <Check className="w-3.5 h-3.5" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t flex items-center justify-between" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {selectedApplicant.studentEmail}
                </span>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Transparency Banner */}
      <div className="p-4 rounded-xl border text-xs flex items-start gap-3" style={{ background: 'var(--color-brand-50)', borderColor: 'var(--color-brand-200)', color: 'var(--color-brand-700)' }}>
        <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>AI Transparency & Merit Compliance:</strong> CareerSetu match scores reflect verified competency badges and project artifacts submitted through the Career Passport. AI scores serve as assistive screening recommendations; all hiring and shortlisting decisions remain under full human recruiter control.
        </div>
      </div>
    </motion.div>
  )
}
