import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Building2, Plus, Calendar, Award,
  Users, CheckCircle, Search, Filter, X, ArrowRight, ExternalLink, Radio, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { institutionApi } from '@/api/institutionApi'
import type { CampusPlacementDrive } from '@/api/institutionApi'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

const fallbackDrives: CampusPlacementDrive[] = [
  {
    id: 'd-1',
    companyName: 'TechCorp India',
    roleTitle: 'Cloud Native & Distributed Systems Engineer',
    ctcPackage: '₹18.5 - ₹24.0 LPA',
    stipend: '₹65,000/month',
    minCgpa: 8.0,
    eligibleBranches: 'CSE, IT, AI & DS',
    driveDate: 'March 18, 2026',
    roundsSummary: 'Online Coding Sandbox, System Architecture, Technical Panel, HR Discussion',
    status: 'IN_PROGRESS',
    applicantsCount: 148,
    offersCount: 12
  },
  {
    id: 'd-2',
    companyName: 'Razorpay',
    roleTitle: 'Software Development Engineer - Payments',
    ctcPackage: '₹22.0 - ₹28.0 LPA',
    stipend: '₹85,000/month',
    minCgpa: 8.25,
    eligibleBranches: 'CSE, IT',
    driveDate: 'March 25, 2026',
    roundsSummary: 'Algorithmic Assessment, System Design Round, Culture Fit',
    status: 'UPCOMING',
    applicantsCount: 210,
    offersCount: 0
  }
]

export default function PlacementDrives() {
  const [drives, setDrives] = useState<CampusPlacementDrive[]>(fallbackDrives)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    companyName: 'Google Cloud India',
    roleTitle: 'Cloud Engineering Specialist',
    ctcPackage: '₹24.0 - ₹32.0 LPA',
    stipend: '₹90,000/month',
    minCgpa: '8.0',
    eligibleBranches: 'CSE, IT, AI & DS',
    driveDate: 'April 15, 2026',
    roundsSummary: 'Proctored Coding, Technical Architecture, HR Round'
  })

  const loadDrives = async () => {
    setIsLoading(true)
    try {
      const data = await institutionApi.getDrives()
      if (data && data.length > 0) {
        setDrives(data)
      }
    } catch (err) {
      console.warn('Using fallback drives data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDrives()
  }, [])

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const created = await institutionApi.createDrive({
        companyName: form.companyName,
        roleTitle: form.roleTitle,
        ctcPackage: form.ctcPackage,
        stipend: form.stipend,
        minCgpa: parseFloat(form.minCgpa),
        eligibleBranches: form.eligibleBranches,
        driveDate: form.driveDate,
        roundsSummary: form.roundsSummary,
        status: 'UPCOMING',
        applicantsCount: 0,
        offersCount: 0
      })
      setDrives([created, ...drives])
      setCreateModalOpen(false)
      toast.success(`Placement drive for ${form.companyName} scheduled successfully in backend!`)
    } catch (err: any) {
      toast.error('Failed to schedule drive')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBroadcast = async (driveId: string, companyName: string) => {
    setBroadcastingId(driveId)
    try {
      const res = await institutionApi.broadcastDrive(driveId)
      toast.success(res.message || `Broadcast notification dispatched for ${companyName}!`)
    } catch (err) {
      toast.error('Failed to broadcast drive announcement')
    } finally {
      setBroadcastingId(null)
    }
  }

  const handleStatusChange = async (driveId: string, status: string) => {
    try {
      const updated = await institutionApi.updateDriveStatus(driveId, status)
      setDrives(drives.map(d => d.id === driveId ? updated : d))
      toast.success(`Drive status updated to ${status}`)
    } catch (err) {
      toast.error('Failed to update drive status')
    }
  }

  const filteredDrives = drives.filter(d =>
    d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Campus Drives & Placements
            </span>
            <span className="text-xs text-slate-400">• Institutional Industry Collaboration</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Placement Drives & Industry Engagements
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Coordinate corporate recruitment schedules, eligibility criteria, and batch notifications.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Schedule New Drive
        </button>
      </motion.div>

      {/* Drives Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDrives.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-2xl border flex flex-col justify-between transition hover:shadow-md"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {d.companyName}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{d.roleTitle}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  d.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  d.status === 'OFFERS_RELEASED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {d.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-slate-400">CTC Offered:</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{d.ctcPackage}</p>
                </div>
                <div>
                  <span className="text-slate-400">Min CGPA:</span>
                  <p className="font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{d.minCgpa} CGPA</p>
                </div>
                <div>
                  <span className="text-slate-400">Drive Date:</span>
                  <p className="font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{d.driveDate}</p>
                </div>
                <div>
                  <span className="text-slate-400">Eligible:</span>
                  <p className="font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{d.eligibleBranches}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                <strong className="text-slate-700 dark:text-slate-300">Rounds:</strong> {d.roundsSummary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t gap-2" style={{ borderColor: 'var(--border-light)' }}>
              <span className="text-xs text-slate-400 font-medium">
                {d.applicantsCount} Applicants {d.offersCount ? `• ${d.offersCount} Offers` : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBroadcast(d.id, d.companyName)}
                  disabled={broadcastingId === d.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition"
                >
                  {broadcastingId === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Radio className="w-3 h-3" />}
                  Broadcast Alert
                </button>
                {d.status === 'UPCOMING' && (
                  <button
                    onClick={() => handleStatusChange(d.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-50 transition"
                  >
                    Start Drive
                  </button>
                )}
                {d.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleStatusChange(d.id, 'OFFERS_RELEASED')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-50 transition text-purple-600"
                  >
                    Release Offers
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <button onClick={() => setCreateModalOpen(false)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Schedule Campus Recruitment Drive
              </h2>

              <form onSubmit={handleCreateDrive} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Company Legal / Brand Name</label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Role Title</label>
                    <input
                      type="text"
                      value={form.roleTitle}
                      onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border bg-transparent focus:outline-none"
                      style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">CTC Bracket (LPA)</label>
                    <input
                      type="text"
                      value={form.ctcPackage}
                      onChange={(e) => setForm({ ...form, ctcPackage: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border bg-transparent focus:outline-none"
                      style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Drive Date</label>
                    <input
                      type="text"
                      value={form.driveDate}
                      onChange={(e) => setForm({ ...form, driveDate: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border bg-transparent focus:outline-none"
                      style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Minimum CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.minCgpa}
                      onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border bg-transparent focus:outline-none"
                      style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Eligible Departments</label>
                  <input
                    type="text"
                    value={form.eligibleBranches}
                    onChange={(e) => setForm({ ...form, eligibleBranches: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border bg-transparent focus:outline-none"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Schedule & Broadcast
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
