import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, MapPin, Clock, DollarSign, Users, Eye, CheckCircle,
  Briefcase, Search, X, Loader2, RefreshCw, AlertCircle, ArrowRight,
  Sparkles, Check, Building2
} from 'lucide-react'
import { opportunityApi, type Opportunity, type CreateOpportunityPayload } from '@/api/opportunityApi'

export default function EmployerJobs() {
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'INTERNSHIP' | 'FULL_TIME' | 'CONTRACT' | 'APPRENTICESHIP'>('INTERNSHIP')
  const [workMode, setWorkMode] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>('HYBRID')
  const [locationCity, setLocationCity] = useState('Bengaluru')
  const [locationState, setLocationState] = useState('Karnataka')
  const [stipendMin, setStipendMin] = useState<number>(30000)
  const [stipendMax, setStipendMax] = useState<number>(45000)
  const [salaryMin, setSalaryMin] = useState<number>(800000)
  const [salaryMax, setSalaryMax] = useState<number>(1200000)
  const [durationWeeks, setDurationWeeks] = useState<number>(24)
  const [openings, setOpenings] = useState<number>(3)
  const [minCgpa, setMinCgpa] = useState<number>(7.5)
  const [description, setDescription] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const loadOpportunities = async () => {
    setLoading(true)
    try {
      const data = await opportunityApi.searchOpportunities()
      setOpportunities(data)
    } catch (err) {
      console.error('Failed to load employer opportunities:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOpportunities()
  }, [])

  // Apply Quick Template
  const loadTemplate = (templateType: 'frontend' | 'backend' | 'ai') => {
    if (templateType === 'backend') {
      setTitle('Junior Microservices & Cloud Engineer')
      setType('FULL_TIME')
      setWorkMode('HYBRID')
      setLocationCity('Bengaluru')
      setLocationState('Karnataka')
      setSalaryMin(900000)
      setSalaryMax(1400000)
      setMinCgpa(7.5)
      setOpenings(2)
      setDescription('Design, deploy, and monitor high-throughput REST APIs and distributed microservices with Java, Spring Boot, Docker, and PostgreSQL.')
    } else if (templateType === 'frontend') {
      setTitle('Frontend React & Design Systems Intern')
      setType('INTERNSHIP')
      setWorkMode('REMOTE')
      setLocationCity('Remote')
      setLocationState('India')
      setStipendMin(25000)
      setStipendMax(35000)
      setDurationWeeks(16)
      setMinCgpa(7.0)
      setOpenings(3)
      setDescription('Build responsive modern user interfaces with React 19, TypeScript, and Tailwind CSS. Collaborate closely with product and UX design.')
    } else {
      setTitle('Generative AI & LLM Systems Trainee')
      setType('INTERNSHIP')
      setWorkMode('HYBRID')
      setLocationCity('Hyderabad')
      setLocationState('Telangana')
      setStipendMin(40000)
      setStipendMax(55000)
      setDurationWeeks(24)
      setMinCgpa(8.0)
      setOpenings(2)
      setDescription('Develop semantic vector pipelines, RAG systems, and AI-driven automation using Python, PyTorch, LangChain, and FastAPI.')
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in title and description')
      return
    }

    setIsSubmitting(true)
    const payload: CreateOpportunityPayload = {
      title: title.trim(),
      type,
      workMode,
      locationCity: locationCity.trim(),
      locationState: locationState.trim(),
      stipendMin: type === 'INTERNSHIP' ? Number(stipendMin) : undefined,
      stipendMax: type === 'INTERNSHIP' ? Number(stipendMax) : undefined,
      salaryMin: type === 'FULL_TIME' ? Number(salaryMin) : undefined,
      salaryMax: type === 'FULL_TIME' ? Number(salaryMax) : undefined,
      durationWeeks: type === 'INTERNSHIP' ? Number(durationWeeks) : undefined,
      openings: Number(openings),
      minCgpa: Number(minCgpa),
      description: description.trim(),
    }

    try {
      const created = await opportunityApi.createOpportunity(payload)
      setOpportunities(prev => [created, ...prev])
      setIsCreateModalOpen(false)
      showToast('Opportunity published live on marketplace!')
      // Reset form
      setTitle('')
      setDescription('')
    } catch (err) {
      console.error('Failed to create opportunity:', err)
      showToast('Failed to publish opportunity. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseOpportunity = async (id: string) => {
    try {
      await opportunityApi.closeOpportunity(id)
      setOpportunities(prev =>
        prev.map(opp => (opp.id === id ? { ...opp, status: 'CLOSED' } : opp))
      )
      showToast('Opportunity marked as CLOSED')
    } catch (err) {
      console.error('Failed to close opportunity:', err)
      showToast('Failed to close opportunity')
    }
  }

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = !searchQuery.trim() ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.locationCity && opp.locationCity.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = typeFilter === 'ALL' || opp.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [opportunities, searchQuery, typeFilter])

  const totalOpenings = opportunities.reduce((acc, o) => acc + (o.openings || 1), 0)
  const publishedCount = opportunities.filter(o => o.status === 'PUBLISHED').length

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
            Jobs & Opportunities Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Publish roles, manage active candidate pipelines, and review applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOpportunities}
            disabled={loading}
            className="p-2.5 rounded-xl border hover:bg-slate-50 transition"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setIsCreateModalOpen(true)
              loadTemplate('backend')
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Post New Opportunity
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Postings', value: opportunities.length, icon: Briefcase, color: 'var(--color-brand-500)' },
          { label: 'Active / Published', value: publishedCount, icon: CheckCircle, color: 'hsl(148,60%,42%)' },
          { label: 'Total Open Vacancies', value: totalOpenings, icon: Users, color: 'hsl(38,92%,48%)' },
          { label: 'Partner Company', value: 'TechCorp India', icon: Building2, color: 'hsl(262,70%,52%)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search your postings by role title or city..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'INTERNSHIP', 'FULL_TIME'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
                typeFilter === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border hover:bg-slate-50 text-slate-600'
              }`}
              style={typeFilter !== t ? { borderColor: 'var(--border-default)', background: 'var(--surface-card)' } : {}}
            >
              {t === 'ALL' ? 'All Types' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading opportunities catalog...</p>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border bg-slate-50/50 dark:bg-slate-900/30" style={{ borderColor: 'var(--border-default)' }}>
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>No postings match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Post New Opportunity" above to publish a new job or internship opening.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOpportunities.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border transition-all hover:shadow-md"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-base font-display truncate" style={{ color: 'var(--text-primary)' }}>
                      {job.title}
                    </h3>
                    <span
                      className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{
                        background: job.status === 'PUBLISHED' ? 'hsl(148,60%,92%)' : 'var(--surface-inset)',
                        color: job.status === 'PUBLISHED' ? 'hsl(148,60%,32%)' : 'var(--text-muted)'
                      }}
                    >
                      {job.status}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {job.type.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs line-clamp-2 text-slate-500 max-w-3xl">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs pt-1" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      {job.locationCity || 'India'} · <strong className="text-slate-700 dark:text-slate-200">{job.workMode}</strong>
                    </span>

                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.type === 'INTERNSHIP'
                        ? `₹${job.stipendMin ? job.stipendMin.toLocaleString() : '30,000'} - ₹${job.stipendMax ? job.stipendMax.toLocaleString() : '45,000'}/mo`
                        : `₹${job.salaryMin ? (job.salaryMin/100000).toFixed(1) : '8'} - ₹${job.salaryMax ? (job.salaryMax/100000).toFixed(1) : '12'} LPA`}
                    </span>

                    <span className="flex items-center gap-1 text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      <strong>{job.openings || 1}</strong> vacancies
                    </span>

                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
                  <button
                    onClick={() => navigate('/employer/applicants')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white gradient-brand shadow-sm hover:opacity-95 transition"
                  >
                    <Users className="w-3.5 h-3.5" /> View in ATS <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {job.status === 'PUBLISHED' && (
                    <button
                      onClick={() => handleCloseOpportunity(job.id)}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 transition"
                      style={{ borderColor: 'var(--border-default)' }}
                      title="Close this opening"
                    >
                      Close Opening
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post Opportunity Modal Wizard */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              {/* Header */}
              <div className="p-6 border-b flex items-start justify-between" style={{ borderColor: 'var(--border-light)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                      Post a New Opportunity
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Publish openings directly to verified candidates across Indian technical institutes.
                  </p>
                </div>

                <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Template Quick Loader */}
              <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b flex items-center gap-2 text-xs" style={{ borderColor: 'var(--border-light)' }}>
                <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Quick Templates:</span>
                <button
                  type="button"
                  onClick={() => loadTemplate('backend')}
                  className="px-2.5 py-1 rounded-lg border bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100"
                >
                  Cloud/Backend
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate('frontend')}
                  className="px-2.5 py-1 rounded-lg border bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100"
                >
                  Frontend React
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate('ai')}
                  className="px-2.5 py-1 rounded-lg border bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100"
                >
                  Generative AI
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Opportunity Title *</label>
                  <input
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Full Stack AI Software Engineer Intern"
                    className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Role Type & Work Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Opportunity Type</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      <option value="INTERNSHIP">Internship</option>
                      <option value="FULL_TIME">Full Time Job</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="APPRENTICESHIP">Apprenticeship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Work Mode</label>
                    <select
                      value={workMode}
                      onChange={e => setWorkMode(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      <option value="HYBRID">Hybrid</option>
                      <option value="REMOTE">Remote</option>
                      <option value="ONSITE">On-Site</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Location City</label>
                    <input
                      value={locationCity}
                      onChange={e => setLocationCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Location State</label>
                    <input
                      value={locationState}
                      onChange={e => setLocationState(e.target.value)}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                {/* Compensation */}
                {type === 'INTERNSHIP' ? (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-500">Monthly Stipend Min (₹)</label>
                      <input
                        type="number"
                        value={stipendMin}
                        onChange={e => setStipendMin(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border outline-none font-medium"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-500">Monthly Stipend Max (₹)</label>
                      <input
                        type="number"
                        value={stipendMax}
                        onChange={e => setStipendMax(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border outline-none font-medium"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-500">Annual CTC Min (₹)</label>
                      <input
                        type="number"
                        value={salaryMin}
                        onChange={e => setSalaryMin(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border outline-none font-medium"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-500">Annual CTC Max (₹)</label>
                      <input
                        type="number"
                        value={salaryMax}
                        onChange={e => setSalaryMax(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border outline-none font-medium"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                )}

                {/* Vacancies & CGPA */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Open Vacancies</label>
                    <input
                      type="number"
                      min={1}
                      value={openings}
                      onChange={e => setOpenings(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Min CGPA Required</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={10}
                      value={minCgpa}
                      onChange={e => setMinCgpa(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  {type === 'INTERNSHIP' && (
                    <div>
                      <label className="block font-semibold mb-1 text-slate-500">Duration (Weeks)</label>
                      <input
                        type="number"
                        value={durationWeeks}
                        onChange={e => setDurationWeeks(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border outline-none font-medium"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Description & Role Responsibilities *</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe role responsibilities, required skills, and key perks..."
                    className="w-full p-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border text-slate-600 hover:bg-slate-50"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" /> Publish Opportunity Live
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
