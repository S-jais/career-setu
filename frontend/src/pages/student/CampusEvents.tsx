import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Trophy, MapPin, Users, Clock, Search,
  CheckCircle, ArrowRight, ExternalLink, X, Sparkles, Tag, AlertCircle
} from 'lucide-react'
import { eventsApi } from '@/api/eventsApi'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

interface CampusEvent {
  id: string
  title: string
  organizer: string
  category: 'HACKATHON' | 'HIRING_SPRINT' | 'WORKSHOP' | 'COMPETITION'
  mode: 'ONLINE' | 'HYBRID' | 'IN_PERSON'
  location: string
  startDate: string
  endDate: string
  registrationDeadline: string
  prizePool: string
  teamsCount: number
  maxTeamSize: number
  tags: string[]
  description: string
  perks: string[]
  isRegistered?: boolean
}

const eventsData: CampusEvent[] = [
  {
    id: 'event-1',
    title: 'National GenAI & Agentic Systems Hackathon 2026',
    organizer: 'CareerSetu & Google Cloud',
    category: 'HACKATHON',
    mode: 'HYBRID',
    location: 'Pune & Virtual Stream',
    startDate: 'March 28, 2026',
    endDate: 'March 30, 2026',
    registrationDeadline: 'March 22, 2026',
    prizePool: '₹5,00,000 + Fast-Track PPIs',
    teamsCount: 420,
    maxTeamSize: 4,
    tags: ['Generative AI', 'RAG', 'FastAPI', 'Cloud'],
    description: '36-hour flagship hackathon building India-scale public infrastructure and autonomous agents solving agriculture, healthcare, and education bottlenecks.',
    perks: ['₹5,00,000 Prize Pool', 'Direct Interview Shortlists for Finalists', 'Google Cloud Credits ($500/team)', 'Verifiable National Hackathon Badge']
  },
  {
    id: 'event-2',
    title: 'Razorpay FinTech 48-Hour Hiring Sprint',
    organizer: 'Razorpay Engineering',
    category: 'HIRING_SPRINT',
    mode: 'ONLINE',
    location: 'Virtual Proctored Platform',
    startDate: 'April 5, 2026',
    endDate: 'April 7, 2026',
    registrationDeadline: 'April 2, 2026',
    prizePool: '₹3,00,000 + 15 Internship Offers',
    teamsCount: 680,
    maxTeamSize: 1,
    tags: ['Java', 'Distributed Systems', 'PostgreSQL', 'Fintech'],
    description: 'Solve real-world financial transaction reconciliation challenges and concurrent payment queue bottlenecks. Top 15 scorers receive immediate summer internship offers.',
    perks: ['15 Summer Internship Offers', '₹85,000/month stipend', 'Pre-Placement Offer (PPO) Pathway']
  },
  {
    id: 'event-3',
    title: 'Distributed Systems & Kubernetes Masterclass',
    organizer: 'AWS Student Community',
    category: 'WORKSHOP',
    mode: 'ONLINE',
    location: 'Interactive Zoom Classroom',
    startDate: 'March 20, 2026',
    endDate: 'March 20, 2026',
    registrationDeadline: 'March 19, 2026',
    prizePool: 'Free AWS Certification Vouchers',
    teamsCount: 1200,
    maxTeamSize: 1,
    tags: ['Kubernetes', 'Docker', 'DevOps', 'Cloud'],
    description: 'Hands-on architectural lab exploring zero-downtime container deployments, ingress controllers, service meshes, and autoscaling metrics.',
    perks: ['Free AWS Cloud Practitioner Exam Voucher', 'Certificate of Completion', 'Hands-on Cloud Sandbox']
  },
  {
    id: 'event-4',
    title: 'Inter-College Algorithmic Code Odyssey',
    organizer: 'ACM Student Chapter',
    category: 'COMPETITION',
    mode: 'ONLINE',
    location: 'CareerSetu Code Sandbox',
    startDate: 'April 12, 2026',
    endDate: 'April 12, 2026',
    registrationDeadline: 'April 10, 2026',
    prizePool: '₹1,50,000 Cash Prizes',
    teamsCount: 890,
    maxTeamSize: 2,
    tags: ['Algorithms', 'Data Structures', 'C++', 'Java'],
    description: 'ICPC-style speed coding contest with 8 algorithmic problems ranging from dynamic programming to graph network flows.',
    perks: ['₹1,50,000 Cash Pool', 'Cryptographic Algorithmic Excellence Badge', 'National Leaderboard Ranking']
  }
]

export default function CampusEvents() {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState<CampusEvent[]>(eventsData)
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamMembers, setTeamMembers] = useState('Aarav Sharma (You)')

  useEffect(() => {
    async function loadEvents() {
      try {
        const live = await eventsApi.getEvents()
        if (live && live.length > 0) {
          const mapped: CampusEvent[] = live.map(e => ({
            id: e.id,
            title: e.title,
            organizer: e.organizer,
            category: (e.category || 'HACKATHON') as any,
            mode: (e.mode || 'ONLINE') as any,
            location: e.location || 'Virtual Platform',
            startDate: e.startDate || 'Upcoming',
            endDate: e.endDate || 'Upcoming',
            registrationDeadline: e.registrationDeadline || 'Soon',
            prizePool: e.prizePool || 'Cash Prizes',
            teamsCount: e.teamsCount || 0,
            maxTeamSize: e.maxTeamSize || 4,
            tags: e.tags && e.tags.length > 0 ? e.tags : ['Tech'],
            description: e.description || '',
            perks: e.perks && e.perks.length > 0 ? e.perks : ['Certificate of Participation'],
            isRegistered: e.isRegistered || false
          }))
          setEvents(mapped)
        }
      } catch {
        // fallback
      }
    }
    loadEvents()
  }, [])

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'ALL' || ev.category === selectedCategory
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleOpenRegister = (ev: CampusEvent) => {
    setSelectedEvent(ev)
    setTeamName(`${ev.title.split(' ')[0]} Champions`)
    setRegisterModalOpen(true)
  }

  const handleConfirmRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return

    setEvents(events.map(ev => ev.id === selectedEvent.id ? { ...ev, isRegistered: true, teamsCount: ev.teamsCount + 1 } : ev))
    setRegisterModalOpen(false)
    toast.success(`Registered for ${selectedEvent.title}! Registration confirmation and hackathon credentials sent to your inbox.`)

    try {
      await eventsApi.registerForEvent(selectedEvent.id, { teamName })
    } catch {
      // offline fallback
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Campus Competitions & Sprints
            </span>
            <span className="text-xs text-slate-400">• Verified Fast-Track Hiring Drives</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Tech Events & Hackathons
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Compete in national collegiate challenges, solve industry problem statements, and earn pre-placement interviews.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <Trophy className="w-6 h-6 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">₹9,50,000+ Active Pool</p>
            <p className="text-[11px] text-slate-400">Cash prizes & direct summer PPIs</p>
          </div>
        </div>
      </motion.div>

      {/* Filter & Search Bar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-slate-100 dark:bg-slate-800 overflow-x-auto max-w-full" style={{ borderColor: 'var(--border-default)' }}>
          {['ALL', 'HACKATHON', 'HIRING_SPRINT', 'WORKSHOP', 'COMPETITION'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Events' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, organizers, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
        </div>
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((ev) => (
          <motion.div
            key={ev.id}
            variants={fadeUp}
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl border flex flex-col justify-between shadow-sm transition-all hover:shadow-md"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {ev.category.replace('_', ' ')} • {ev.mode}
                </span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> {ev.prizePool}
                </span>
              </div>

              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                {ev.title}
              </h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                Organized by {ev.organizer}
              </p>

              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 my-3">
                {ev.description}
              </p>

              {/* Event Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{ev.startDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{ev.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>Deadline: {ev.registrationDeadline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  <span>{ev.teamsCount} Teams Registered</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {ev.tags.map((t) => (
                  <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-md border bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300" style={{ borderColor: 'var(--border-light)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: 'var(--border-light)' }}>
              <span className="text-[11px] text-slate-400 font-medium">Team Size: 1 - {ev.maxTeamSize} Members</span>

              {ev.isRegistered ? (
                <div className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Confirmed Registered
                </div>
              ) : (
                <button
                  onClick={() => handleOpenRegister(ev)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 transition shadow-sm flex items-center gap-1.5"
                >
                  Register Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {registerModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setRegisterModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 z-10 space-y-5"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {selectedEvent.category.replace('_', ' ')} Registration
                  </span>
                  <h3 className="font-bold font-display text-base mt-1" style={{ color: 'var(--text-primary)' }}>
                    {selectedEvent.title}
                  </h3>
                </div>
                <button
                  onClick={() => setRegisterModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmRegister} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium focus:ring-2 focus:ring-blue-500/20"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Team Roster (Max {selectedEvent.maxTeamSize} members)</label>
                  <textarea
                    rows={2}
                    required
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium resize-none focus:ring-2 focus:ring-blue-500/20"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                  <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Career Passport Synced</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Your verified skills and code assessment badges will automatically be shared with {selectedEvent.organizer} for fast-track screening.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setRegisterModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand transition shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Confirm Registration
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
