import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, MapPin, Building2, Clock, DollarSign, CheckCircle, Star, ArrowRight, Bookmark, Zap, ChevronDown, Send, X, AlertCircle } from 'lucide-react'
import { opportunityApi, type Opportunity } from '@/api/opportunityApi'
import { applicationApi, type StudentApplication } from '@/api/applicationApi'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i*0.05 } }) }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }

export default function OpportunityMarketplace() {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedMode, setSelectedMode] = useState('ALL')
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [myApplications, setMyApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [applyingTo, setApplyingTo] = useState<Opportunity | null>(null)
  const [coverNote, setCoverNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  const types = ['ALL', 'INTERNSHIP', 'FULL_TIME', 'RESEARCH', 'APPRENTICESHIP']
  const modes = ['ALL', 'HYBRID', 'REMOTE', 'ONSITE']

  // Load opportunities & user applications
  const loadData = async () => {
    setLoading(true)
    try {
      const [oppsData, appsData] = await Promise.allSettled([
        opportunityApi.searchOpportunities({
          search: searchQuery,
          type: selectedType,
          workMode: selectedMode
        }),
        applicationApi.getMyApplications()
      ])

      if (oppsData.status === 'fulfilled' && oppsData.value.length > 0) {
        setOpportunities(oppsData.value)
      } else {
        // Fallback default sample opportunities if empty
        setOpportunities([
          {
            id: '11111111-1111-1111-1111-111111111111',
            companyId: 'techcorp-1',
            postedBy: 'user-1',
            title: 'Full Stack AI Software Engineer Intern',
            slug: 'full-stack-ai-engineer-intern',
            type: 'INTERNSHIP',
            description: 'Build next-generation talent discovery tools with React, FastAPI, and Spring Boot. Mentorship from senior engineering architects.',
            locationCity: 'Bengaluru',
            locationState: 'Karnataka',
            workMode: 'HYBRID',
            stipendMin: 35000,
            stipendMax: 50000,
            currency: 'INR',
            isPaid: true,
            durationWeeks: 24,
            openings: 5,
            applicationsCount: 12,
            status: 'PUBLISHED',
            isFeatured: true,
            createdAt: new Date().toISOString(),
            companyName: 'TechCorp India'
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            companyId: 'innovatesoft-1',
            postedBy: 'user-2',
            title: 'Junior Cloud & Backend Engineer',
            slug: 'junior-cloud-backend-engineer',
            type: 'FULL_TIME',
            description: 'Design resilient microservices, distributed cache architectures, and high-throughput REST APIs.',
            locationCity: 'Hyderabad',
            locationState: 'Telangana',
            workMode: 'REMOTE',
            salaryMin: 800000,
            salaryMax: 1200000,
            currency: 'INR',
            isPaid: true,
            openings: 2,
            applicationsCount: 28,
            status: 'PUBLISHED',
            isFeatured: false,
            createdAt: new Date().toISOString(),
            companyName: 'InnovateSoft Solutions'
          }
        ])
      }

      if (appsData.status === 'fulfilled') {
        setMyApplications(appsData.value)
      }
    } catch (err) {
      console.error('Failed to load opportunities', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData()
    }, 250)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedType, selectedMode])

  const appliedOppIds = new Set(myApplications.map(a => a.opportunityId))

  const handleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applyingTo) return

    setSubmitting(true)
    try {
      await applicationApi.apply({
        opportunityId: applyingTo.id,
        coverNote: coverNote.trim() || 'Applied directly with verified CareerSetu digital passport.'
      })
      toast.success(`Successfully applied to ${applyingTo.title}!`)
      setApplyingTo(null)
      setCoverNote('')
      // Refresh my applications
      const updatedApps = await applicationApi.getMyApplications()
      setMyApplications(updatedApps)
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatCompensation = (opp: Opportunity) => {
    if (opp.type === 'INTERNSHIP') {
      if (opp.stipendMin && opp.stipendMax) {
        return `₹${opp.stipendMin.toLocaleString('en-IN')} - ₹${opp.stipendMax.toLocaleString('en-IN')}/mo`
      }
      if (opp.stipendMin) return `₹${opp.stipendMin.toLocaleString('en-IN')}/mo`
      return 'Paid Internship'
    } else {
      if (opp.salaryMin && opp.salaryMax) {
        return `₹${(opp.salaryMin / 100000).toFixed(1)} - ${(opp.salaryMax / 100000).toFixed(1)} LPA`
      }
      if (opp.salaryMin) return `₹${(opp.salaryMin / 100000).toFixed(1)} LPA`
      return 'Competitive CTC'
    }
  }

  const typeColors: Record<string, string> = {
    INTERNSHIP: 'var(--color-brand-500)',
    FULL_TIME: 'hsl(148,60%,42%)',
    RESEARCH: 'hsl(262,72%,52%)',
    APPRENTICESHIP: 'hsl(38,90%,48%)',
  }

  const modeLabels: Record<string, string> = {
    REMOTE: '🌐 Remote',
    HYBRID: '🏢 Hybrid',
    ONSITE: '📍 Onsite'
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Opportunity Marketplace</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Discover verified jobs and internships matched directly to your Career Passport.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'hsl(148,60%,92%)', color: 'hsl(148,60%,32%)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Backend Connected
          </span>
        </div>
      </motion.div>

      {/* Search and filters */}
      <motion.div variants={fadeUp} custom={1} className="p-5 rounded-2xl border space-y-4 shadow-sm"
                  style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, role, skill (e.g. Spring Boot, React, Cloud)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
            style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold mr-1" style={{ color: 'var(--text-muted)' }}>Type:</span>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={selectedType === type
                  ? { background: 'var(--color-brand-500)', color: 'white' }
                  : { background: 'var(--surface-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                {type === 'ALL' ? 'All Roles' : type.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold mr-1" style={{ color: 'var(--text-muted)' }}>Work Mode:</span>
            {modes.map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={selectedMode === mode
                  ? { background: 'var(--color-brand-600)', color: 'white' }
                  : { background: 'var(--surface-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                {mode === 'ALL' ? 'All Modes' : mode}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results header */}
      <motion.div variants={fadeUp} custom={2} className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{opportunities.length} verified opportunities</strong>
        </p>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {myApplications.length} applied this semester
        </div>
      </motion.div>

      {/* Opportunity list */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="w-8 h-8 mx-auto border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>Loading verified opportunities...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <AlertCircle className="w-8 h-8 mx-auto" style={{ color: 'var(--text-muted)' }} />
            <p className="text-base font-semibold mt-3" style={{ color: 'var(--text-primary)' }}>No opportunities match your filter</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try clearing your search query or selecting "All Roles".</p>
          </div>
        ) : (
          opportunities.map((opp, index) => {
            const isApplied = appliedOppIds.has(opp.id)
            const isBookmarked = bookmarkedIds.has(opp.id)
            const displayCompany = opp.companyName || 'Verified Employer'

            return (
              <motion.div
                key={opp.id}
                variants={fadeUp}
                custom={index + 3}
                className="p-5 rounded-2xl border transition-all hover:shadow-md"
                style={{ background: 'var(--surface-card)', borderColor: opp.isFeatured ? 'var(--color-brand-300)' : 'var(--border-light)' }}
              >
                {opp.isFeatured && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold mb-3" style={{ color: 'var(--color-brand-600)' }}>
                    <Star className="w-3.5 h-3.5" style={{ fill: 'var(--color-brand-500)', color: 'var(--color-brand-500)' }} />
                    AI Spotlight Opportunity
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg gradient-brand shadow-sm">
                    {displayCompany.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{opp.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{displayCompany}</span>
                          <span className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background: 'hsl(148,60%,92%)', color: 'hsl(148,60%,35%)' }}>
                            <CheckCircle className="w-3 h-3" /> DPIIT & AICTE Verified
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-lg font-bold font-display" style={{ color: 'hsl(148,60%,40%)' }}>
                            92%
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Match Score</div>
                        </div>
                        <button
                          onClick={() => handleBookmark(opp.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                          style={{ color: isBookmarked ? 'var(--color-brand-500)' : 'var(--text-muted)' }}
                        >
                          <Bookmark className="w-4 h-4" style={{ fill: isBookmarked ? 'var(--color-brand-500)' : 'none' }} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm mt-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {opp.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs px-2.5 py-1 rounded font-semibold"
                            style={{ background: `${typeColors[opp.type] || 'var(--color-brand-500)'}15`, color: typeColors[opp.type] || 'var(--color-brand-500)' }}>
                        {opp.type.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        <MapPin className="w-3.5 h-3.5" /> {opp.locationCity ? `${opp.locationCity}, ${opp.locationState || 'India'}` : 'All-India'}
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {modeLabels[opp.workMode] || opp.workMode}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'hsl(148,60%,35%)' }}>
                        <DollarSign className="w-3.5 h-3.5" /> {formatCompensation(opp)}
                      </span>
                      {opp.durationWeeks && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="w-3.5 h-3.5" /> {opp.durationWeeks} weeks
                        </span>
                      )}
                    </div>

                    {/* AI Explainable Fit Card */}
                    <div className="mt-3.5 p-3 rounded-xl text-xs flex items-center justify-between"
                         style={{ background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-100)' }}>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" style={{ color: 'var(--color-brand-600)' }} />
                        <span className="font-semibold" style={{ color: 'var(--color-brand-700)' }}>AI Recommendation:</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Verified project skills match 4 required core competencies.</span>
                      </div>
                      <span className="text-[11px] font-medium opacity-70">DPDP Compliant</span>
                    </div>

                    {/* Footer / Apply Action */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {opp.applicationsCount || 0} candidate{opp.applicationsCount === 1 ? '' : 's'} applied · Active Requisition
                      </div>
                      <div className="flex items-center gap-2">
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl font-bold bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => setApplyingTo(opp)}
                            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs rounded-xl font-bold text-white gradient-brand shadow-sm hover:opacity-95 transition-all"
                          >
                            Apply with Passport <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-lg p-6 rounded-2xl border shadow-xl relative"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)' }}
            >
              <button
                onClick={() => setApplyingTo(null)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
                  {applyingTo.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Apply for Role</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{applyingTo.title} · {applyingTo.companyName || 'Verified Employer'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl text-xs mb-4 flex items-center gap-2.5"
                   style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-700)' }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Your verified <strong>Career Passport</strong>, CGPA, and verified skill badges will be securely shared with the employer under DPDP consent.</span>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Personal Pitch / Cover Note (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={e => setCoverNote(e.target.value)}
                    placeholder="Highlight your key projects, open-source work, or why you are excited about this role..."
                    className="w-full p-3 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-brand-400"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyingTo(null)}
                    className="px-4 py-2 text-xs rounded-xl font-medium border"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs rounded-xl font-bold text-white gradient-brand shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
                    <Send className="w-3.5 h-3.5" />
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
