import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Building2, TrendingUp, Briefcase, BarChart3,
  Users, Award, Calendar, CheckCircle, ShieldCheck, Download,
  Plus, X, Check, MapPin, Clock, Sparkles
} from 'lucide-react'

interface Drive {
  id: string
  company: string
  role: string
  date: string
  package: string
  eligibleStudents: number
  mode: 'ON_CAMPUS' | 'VIRTUAL'
  status: 'UPCOMING' | 'COMPLETED' | 'IN_PROGRESS'
}

const initialDrives: Drive[] = [
  { id: '1', company: 'TechCorp India', role: 'Full Stack AI Engineer Intern', date: '2026-09-20', package: '₹6.5 - 9.0 LPA', eligibleStudents: 85, mode: 'ON_CAMPUS', status: 'UPCOMING' },
  { id: '2', company: 'InnovateSoft Solutions', role: 'Cloud DevOps Associate', date: '2026-09-28', package: '₹8.0 - 12.0 LPA', eligibleStudents: 64, mode: 'VIRTUAL', status: 'UPCOMING' },
  { id: '3', company: 'Cognitive Matrix Labs', role: 'Data Scientist & ML Intern', date: '2026-09-12', package: '₹7.5 - 10.5 LPA', eligibleStudents: 52, mode: 'ON_CAMPUS', status: 'IN_PROGRESS' },
  { id: '4', company: 'FinTech Dynamics', role: 'Backend Java Developer', date: '2026-08-25', package: '₹9.0 - 14.0 LPA', eligibleStudents: 98, mode: 'ON_CAMPUS', status: 'COMPLETED' },
]

export default function InstitutionDashboard() {
  const [drives, setDrives] = useState<Drive[]>(initialDrives)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Drive form state
  const [companyName, setCompanyName] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [driveDate, setDriveDate] = useState('2026-10-10')
  const [ctcRange, setCtcRange] = useState('₹8 - 12 LPA')
  const [driveMode, setDriveMode] = useState<'ON_CAMPUS' | 'VIRTUAL'>('ON_CAMPUS')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleScheduleDrive = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !roleTitle.trim()) return

    const newDrive: Drive = {
      id: Date.now().toString(),
      company: companyName.trim(),
      role: roleTitle.trim(),
      date: driveDate,
      package: ctcRange,
      eligibleStudents: Math.floor(Math.random() * 40) + 40,
      mode: driveMode,
      status: 'UPCOMING'
    }

    setDrives(prev => [newDrive, ...prev])
    setIsScheduleModalOpen(false)
    setCompanyName('')
    setRoleTitle('')
    showToast('Campus recruitment drive scheduled successfully!')
  }

  const handleExportReport = () => {
    showToast('NAAC & NEP 2020 Compliance Report exported successfully!')
  }

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
            Institution Placement & NEP Intelligence
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Pune Institute of Computer Technology (PICT) · Placement Cell & Academic Oversight
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-slate-50 transition"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)', background: 'var(--surface-card)' }}
          >
            <Download className="w-3.5 h-3.5" /> Export NAAC / NEP Report
          </button>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-brand shadow-sm hover:shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Schedule Campus Drive
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrolled Students', value: '1,420', icon: GraduationCap, color: 'var(--color-brand-500)', sub: '2026 Graduating Batch' },
          { label: 'Overall Placement Rate', value: '88.4%', icon: TrendingUp, color: 'hsl(148,60%,42%)', sub: '+7.2% vs last academic year' },
          { label: 'Partner Recruiters', value: '74 Companies', icon: Building2, color: 'hsl(262,72%,52%)', sub: 'Active MOUs signed' },
          { label: 'Average Package (CTC)', value: '₹9.4 LPA', icon: Award, color: 'hsl(38,92%,48%)', sub: 'Highest: ₹44 LPA' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-2 border-t pt-2" style={{ borderColor: 'var(--border-light)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* NEP 2020 & AICTE Internship Credit Compliance Bar */}
      <div className="p-5 rounded-2xl border gradient-brand text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">NEP 2020 & AICTE Mandatory Internship Compliance</h3>
          </div>
          <p className="text-xs text-white/85 max-w-2xl leading-relaxed">
            1,248 out of 1,420 students (87.8%) have completed their mandatory 14-credit industry internship requirements verified via CareerSetu cryptographic digital logs.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <span className="text-2xl font-bold font-display">87.8%</span>
            <p className="text-[10px] text-white/70">Compliance Status</p>
          </div>
          <div className="h-10 w-24 bg-white/20 rounded-xl p-1 flex items-center">
            <div className="h-full bg-emerald-400 rounded-lg w-[88%]" />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Drives vs Department Skill Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drives List */}
        <div className="lg:col-span-2 p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base font-display" style={{ color: 'var(--text-primary)' }}>
                Campus Placement Drives ({drives.length})
              </h2>
              <p className="text-xs text-slate-500">Recruitment schedules and student eligibility screening.</p>
            </div>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              + Add Drive
            </button>
          </div>

          <div className="space-y-3">
            {drives.map(drive => (
              <div
                key={drive.id}
                className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:shadow-sm"
                style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{drive.company}</h3>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{
                        background: drive.status === 'UPCOMING' ? 'hsl(215,90%,94%)' : drive.status === 'IN_PROGRESS' ? 'hsl(38,92%,93%)' : 'hsl(148,60%,92%)',
                        color: drive.status === 'UPCOMING' ? 'hsl(215,90%,35%)' : drive.status === 'IN_PROGRESS' ? 'hsl(38,90%,35%)' : 'hsl(148,60%,32%)',
                      }}
                    >
                      {drive.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded border text-slate-500 font-medium">
                      {drive.mode.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{drive.role}</p>
                  <div className="flex items-center gap-3 text-xs pt-1" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Award className="w-3.5 h-3.5" /> {drive.package}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(drive.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Users className="w-3.5 h-3.5" /> <strong>{drive.eligibleStudents}</strong> eligible
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Opening drive details for ${drive.company}`)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-50 self-start sm:self-center"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Department Skill Intelligence */}
        <div className="p-6 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>
            Department Placement Metrics
          </h3>
          <p className="text-xs text-slate-500">Average competency scores and placement percentages.</p>

          <div className="space-y-4 pt-1">
            {[
              { dept: 'Computer Engineering (CSE)', avgScore: 82, placementRate: '94.2%', avgCtc: '₹11.2 LPA', color: 'var(--color-brand-500)' },
              { dept: 'Information Technology (IT)', avgScore: 78, placementRate: '91.8%', avgCtc: '₹10.5 LPA', color: 'hsl(215,90%,50%)' },
              { dept: 'Electronics & Telecom (E&TC)', avgScore: 71, placementRate: '84.0%', avgCtc: '₹8.4 LPA', color: 'hsl(262,72%,52%)' },
              { dept: 'Mechanical Engineering', avgScore: 64, placementRate: '72.5%', avgCtc: '₹6.8 LPA', color: 'hsl(38,92%,48%)' },
            ].map(({ dept, avgScore, placementRate, avgCtc, color }) => (
              <div key={dept} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-base)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{dept}</span>
                  <span className="text-xs font-bold text-emerald-600">{placementRate}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>Skill Index: {avgScore}/100</span>
                  <span>Avg CTC: {avgCtc}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-inset)' }}>
                  <div className="h-full rounded-full" style={{ background: color, width: `${avgScore}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border text-xs" style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
            <p className="font-semibold mb-1 text-slate-700 dark:text-slate-200">Accreditation Readiness</p>
            <p className="text-[11px] text-slate-500">
              NBA Criterion 5 & NAAC Key Indicator 5.2 compliant reporting logs are synchronized in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Campus Drive Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Schedule Campus Hiring Drive</h3>
                </div>
                <button onClick={() => setIsScheduleModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleDrive} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-500">Recruiter Company Name *</label>
                  <input
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Google India, Infosys, TechCorp"
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-500">Target Role Title *</label>
                  <input
                    required
                    value={roleTitle}
                    onChange={e => setRoleTitle(e.target.value)}
                    placeholder="e.g. Software Development Engineer - I"
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Drive Date</label>
                    <input
                      type="date"
                      value={driveDate}
                      onChange={e => setDriveDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-500">Mode</label>
                    <select
                      value={driveMode}
                      onChange={e => setDriveMode(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      <option value="ON_CAMPUS">On Campus</option>
                      <option value="VIRTUAL">Virtual / Remote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-500">CTC Package Range</label>
                  <input
                    value={ctcRange}
                    onChange={e => setCtcRange(e.target.value)}
                    placeholder="e.g. ₹7.5 - 11.0 LPA"
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border text-slate-600 hover:bg-slate-50"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm Schedule
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
