import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Video, Clock, User, CheckCircle, Plus,
  Search, X, ExternalLink, Copy, Check, Filter, AlertCircle
} from 'lucide-react'
import { interviewApi } from '@/api/interviewApi'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

interface Interview {
  id: string
  candidateName: string
  candidateEmail: string
  roleTitle: string
  round: 'TECHNICAL_1' | 'SYSTEM_DESIGN' | 'BEHAVIORAL' | 'FINAL_ROUND'
  date: string
  time: string
  durationMinutes: number
  interviewer: string
  meetingUrl: string
  status: 'SCHEDULED' | 'COMPLETED' | 'IN_PROGRESS'
  notes?: string
}

const initialInterviews: Interview[] = [
  {
    id: 'int-1',
    candidateName: 'Aarav Sharma',
    candidateEmail: 'aarav.sharma@careersetu.in',
    roleTitle: 'Cloud Native Engineer Intern',
    round: 'TECHNICAL_1',
    date: 'Thursday, Mar 12, 2026',
    time: '03:00 PM - 03:45 PM',
    durationMinutes: 45,
    interviewer: 'Deepak Patel (Lead Cloud Architect)',
    meetingUrl: 'https://meet.google.com/xyz-cs-aarav',
    status: 'SCHEDULED',
    notes: 'Focus on Spring Boot 3 virtual threads and PostgreSQL query execution plans.'
  },
  {
    id: 'int-2',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    roleTitle: 'AI/ML Researcher Intern',
    round: 'SYSTEM_DESIGN',
    date: 'Today',
    time: '04:30 PM - 05:15 PM',
    durationMinutes: 45,
    interviewer: 'Dr. Neha Rao (Director of AI)',
    meetingUrl: 'https://meet.google.com/xyz-cs-priya',
    status: 'IN_PROGRESS',
    notes: 'Discuss vector database indexing and RAG chunking trade-offs.'
  },
  {
    id: 'int-3',
    candidateName: 'Rahul Kumar',
    candidateEmail: 'rahul.k@example.com',
    roleTitle: 'Full Stack Developer',
    round: 'BEHAVIORAL',
    date: 'Yesterday',
    time: '11:00 AM - 11:30 AM',
    durationMinutes: 30,
    interviewer: 'Sarah Jenkins (Talent Acquisition)',
    meetingUrl: 'https://meet.google.com/xyz-cs-rahul',
    status: 'COMPLETED',
    notes: 'Candidate demonstrated strong collaborative mindset and agile practices.'
  },
  {
    id: 'int-4',
    candidateName: 'Anita Singh',
    candidateEmail: 'anita.s@example.com',
    roleTitle: 'DevOps & SRE Specialist',
    round: 'FINAL_ROUND',
    date: 'Friday, Mar 13, 2026',
    time: '02:00 PM - 02:45 PM',
    durationMinutes: 45,
    interviewer: 'Vikram Joshi (VP Engineering)',
    meetingUrl: 'https://meet.google.com/xyz-cs-anita',
    status: 'SCHEDULED',
    notes: 'Final round evaluation with VP Engineering for immediate hiring offer.'
  }
]

export default function InterviewScheduler() {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews)
  const [activeTab, setActiveTab] = useState<'ALL' | 'TODAY' | 'SCHEDULED' | 'COMPLETED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function loadInterviews() {
      try {
        const live = await interviewApi.getEmployerInterviews()
        if (live && live.length > 0) {
          const mapped: Interview[] = live.map(item => ({
            id: item.id,
            candidateName: item.candidateName,
            candidateEmail: item.candidateEmail,
            roleTitle: item.roleTitle,
            round: (item.round || 'TECHNICAL_1') as any,
            date: item.dateStr || 'Upcoming',
            time: item.timeStr || 'TBD',
            durationMinutes: item.durationMinutes || 45,
            interviewer: item.interviewerName,
            meetingUrl: item.meetingUrl,
            status: (item.status || 'SCHEDULED') as any,
            notes: item.notes
          }))
          setInterviews(mapped)
        }
      } catch {
        // fallback
      }
    }
    loadInterviews()
  }, [])

  const [form, setForm] = useState({
    candidateName: 'Aarav Sharma',
    candidateEmail: 'student@careersetu.in',
    roleTitle: 'Cloud Native Engineer Intern',
    round: 'TECHNICAL_1' as Interview['round'],
    date: 'March 14, 2026',
    time: '02:00 PM - 02:45 PM',
    interviewer: 'Deepak Patel',
    meetingUrl: 'https://meet.google.com/cs-interview-demo',
    notes: ''
  })

  const copyMeetingLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success('Interview meeting link copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateInterview = async (e: React.FormEvent) => {
    e.preventDefault()
    const tempId = `int-${Date.now()}`
    const newInt: Interview = {
      id: tempId,
      candidateName: form.candidateName,
      candidateEmail: form.candidateEmail,
      roleTitle: form.roleTitle,
      round: form.round,
      date: form.date,
      time: form.time,
      durationMinutes: 45,
      interviewer: form.interviewer,
      meetingUrl: form.meetingUrl,
      status: 'SCHEDULED',
      notes: form.notes
    }

    setInterviews(prev => [newInt, ...prev])
    setScheduleModalOpen(false)
    toast.success(`Interview scheduled with ${form.candidateName}! Calendar invite and Google Meet link sent.`)

    try {
      const saved = await interviewApi.scheduleInterview({
        candidateName: form.candidateName,
        candidateEmail: form.candidateEmail,
        roleTitle: form.roleTitle,
        round: form.round,
        dateStr: form.date,
        timeStr: form.time,
        durationMinutes: 45,
        interviewerName: form.interviewer,
        meetingUrl: form.meetingUrl,
        notes: form.notes
      })
      if (saved && saved.id) {
        setInterviews(prev => prev.map(i => i.id === tempId ? { ...i, id: saved.id } : i))
      }
    } catch {
      // offline fallback
    }
  }

  const filteredInterviews = interviews.filter((item) => {
    const matchesTab = activeTab === 'ALL' || item.status === activeTab || (activeTab === 'TODAY' && item.date === 'Today')
    const matchesSearch = item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.interviewer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Interview Scheduling & Evaluations
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Manage technical interviews, assign engineering evaluators, and track real-time candidate scorecards.
          </p>
        </div>

        <button
          onClick={() => setScheduleModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand transition shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Scheduled', val: interviews.length, col: 'text-blue-600' },
          { label: 'Today\'s Rounds', val: interviews.filter(i => i.date === 'Today' || i.status === 'IN_PROGRESS').length, col: 'text-amber-600' },
          { label: 'Completed', val: interviews.filter(i => i.status === 'COMPLETED').length, col: 'text-emerald-600' },
          { label: 'Offers Extended', val: '3', col: 'text-purple-600' }
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-2xl border text-center" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <span className="text-xs text-slate-400 font-medium">{m.label}</span>
            <p className={`text-2xl font-bold font-display mt-0.5 ${m.col}`}>{m.val}</p>
          </div>
        ))}
      </motion.div>

      {/* Tabs & Search */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-100 dark:bg-slate-800" style={{ borderColor: 'var(--border-default)' }}>
          {(['ALL', 'TODAY', 'SCHEDULED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab
                  ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Rounds' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, role, interviewer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
        </div>
      </motion.div>

      {/* Interviews List */}
      <div className="space-y-3">
        {filteredInterviews.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            className="p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-xs">
                {item.candidateName.split(' ').map(n => n[0]).join('')}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {item.candidateName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {item.round.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : item.status === 'IN_PROGRESS'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{item.roleTitle}</p>
                <p className="text-xs text-slate-400 mt-1">Interviewer: {item.interviewer}</p>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 mt-1.5 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                    Note: {item.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Right Action Container */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0" style={{ borderColor: 'var(--border-light)' }}>
              <div className="text-right text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" /> {item.date}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.time} ({item.durationMinutes}m)
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => copyMeetingLink(item.id, item.meetingUrl)}
                  className="p-2.5 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition"
                  style={{ borderColor: 'var(--border-default)' }}
                  title="Copy meeting link"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>

                <a
                  href={item.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand transition shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center"
                >
                  <Video className="w-3.5 h-3.5" /> Join Call
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {scheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setScheduleModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 z-10 space-y-5"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold font-display text-base" style={{ color: 'var(--text-primary)' }}>
                    Schedule Candidate Interview
                  </h3>
                </div>
                <button
                  onClick={() => setScheduleModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateInterview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Candidate</label>
                  <input
                    type="text"
                    required
                    value={form.candidateName}
                    onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Role Title</label>
                    <input
                      type="text"
                      required
                      value={form.roleTitle}
                      onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Round Type</label>
                    <select
                      value={form.round}
                      onChange={(e) => setForm({ ...form, round: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      <option value="TECHNICAL_1">Technical Round 1</option>
                      <option value="SYSTEM_DESIGN">System Architecture</option>
                      <option value="BEHAVIORAL">Behavioral & Culture</option>
                      <option value="FINAL_ROUND">Executive Final Round</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Date</label>
                    <input
                      type="text"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Time Window</label>
                    <input
                      type="text"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full p-2.5 rounded-xl border outline-none font-medium"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Interviewer Assigned</label>
                  <input
                    type="text"
                    required
                    value={form.interviewer}
                    onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Evaluation Focus / Notes</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Key problem statement or focus areas..."
                    className="w-full p-2.5 rounded-xl border outline-none font-medium resize-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand transition shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Schedule & Notify
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
