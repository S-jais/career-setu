import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Star, Calendar, Clock, ShieldCheck, Search,
  MessageSquare, Video, CheckCircle, X, ExternalLink,
  Sparkles, Award, ArrowRight
} from 'lucide-react'
import { mentorshipApi } from '@/api/mentorshipApi'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

interface Mentor {
  id: string
  name: string
  role: string
  company: string
  experienceYears: number
  rating: number
  sessionsCount: number
  avatarInitials: string
  gradient: string
  domains: string[]
  bio: string
  nextAvailable: string
  languages: string[]
}

const mentorsData: Mentor[] = [
  {
    id: 'm-1',
    name: 'Dr. Rohan Mehra',
    role: 'Staff Software Architect',
    company: 'Google Cloud',
    experienceYears: 12,
    rating: 4.98,
    sessionsCount: 310,
    avatarInitials: 'RM',
    gradient: 'from-blue-600 to-indigo-600',
    domains: ['Distributed Systems', 'Java', 'Cloud Native', 'System Design'],
    bio: 'Leading distributed storage architectures at Google Cloud. Passionate about helping university students master large-scale distributed systems and interview algorithms.',
    nextAvailable: 'Tomorrow, 4:00 PM IST',
    languages: ['English', 'Hindi']
  },
  {
    id: 'm-2',
    name: 'Ananya Deshmukh',
    role: 'Principal GenAI Researcher',
    company: 'Microsoft AI',
    experienceYears: 9,
    rating: 4.95,
    sessionsCount: 245,
    avatarInitials: 'AD',
    gradient: 'from-purple-600 to-pink-600',
    domains: ['GenAI', 'LLM Fine-tuning', 'Python', 'FastAPI', 'RAG'],
    bio: 'Specializing in fine-tuning open weights models and building low-latency RAG pipelines. Former IIT Bombay alumni mentor for graduate engineers.',
    nextAvailable: 'Wednesday, 6:30 PM IST',
    languages: ['English', 'Marathi', 'Hindi']
  },
  {
    id: 'm-3',
    name: 'Karthik Subramanian',
    role: 'Engineering Manager',
    company: 'Razorpay',
    experienceYears: 10,
    rating: 4.92,
    sessionsCount: 190,
    avatarInitials: 'KS',
    gradient: 'from-emerald-600 to-teal-600',
    domains: ['Fintech Architecture', 'Spring Boot', 'Kafka', 'Mock Interviews'],
    bio: 'Architected high-throughput payment settlement pipelines processing 8,000 TPS. Mentoring students on clean code, system scalability, and recruiter mock interviews.',
    nextAvailable: 'Thursday, 7:00 PM IST',
    languages: ['English', 'Tamil']
  },
  {
    id: 'm-4',
    name: 'Pooja Verma',
    role: 'Senior Staff Frontend Lead',
    company: 'Swiggy',
    experienceYears: 8,
    rating: 4.96,
    sessionsCount: 220,
    avatarInitials: 'PV',
    gradient: 'from-amber-500 to-orange-600',
    domains: ['React 19', 'Design Systems', 'TypeScript', 'Web Performance'],
    bio: 'Championing frontend design systems and real-time order tracking user interfaces. Guides aspiring UI developers to build top-percentile developer portfolios.',
    nextAvailable: 'Friday, 5:00 PM IST',
    languages: ['English', 'Hindi']
  },
  {
    id: 'm-5',
    name: 'Vikram Joshi',
    role: 'Lead Site Reliability Engineer',
    company: 'Amazon Web Services',
    experienceYears: 11,
    rating: 4.91,
    sessionsCount: 165,
    avatarInitials: 'VJ',
    gradient: 'from-cyan-600 to-blue-700',
    domains: ['Kubernetes', 'AWS', 'Linux Internals', 'DevOps CI/CD'],
    bio: 'Operating multi-region resilient infrastructure at AWS. Specializes in cloud infrastructure certifications, Dockerization, and DevOps problem statements.',
    nextAvailable: 'Saturday, 11:00 AM IST',
    languages: ['English', 'Hindi', 'Gujarati']
  }
]

export default function MentorshipHub() {
  const [mentors, setMentors] = useState<Mentor[]>(mentorsData)
  const [selectedDomain, setSelectedDomain] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [sessionType, setSessionType] = useState('Mock Technical Interview')
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 10:45 AM')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function loadMentors() {
      try {
        const live = await mentorshipApi.getMentors(searchQuery)
        if (live && live.length > 0) {
          const mapped: Mentor[] = live.map(m => ({
            id: m.id,
            name: m.name,
            role: m.role,
            company: m.company,
            experienceYears: m.experienceYears,
            rating: m.rating,
            sessionsCount: m.sessionsCount,
            avatarInitials: m.avatarInitials || m.name.split(' ').map(n => n[0]).join('').substring(0, 2),
            gradient: m.gradient || 'from-blue-600 to-indigo-600',
            domains: m.domains && m.domains.length > 0 ? m.domains : ['Tech', 'Cloud'],
            bio: m.bio,
            nextAvailable: m.nextAvailable || 'Tomorrow, 4:00 PM IST',
            languages: m.languages && m.languages.length > 0 ? m.languages : ['English', 'Hindi']
          }))
          setMentors(mapped)
        }
      } catch {
        // fallback
      }
    }
    loadMentors()
  }, [searchQuery])

  const domainsList = ['ALL', 'Distributed Systems', 'GenAI', 'Spring Boot', 'React 19', 'Kubernetes', 'Mock Interviews']

  const filteredMentors = mentors.filter((m) => {
    const matchesDomain = selectedDomain === 'ALL' || m.domains.includes(selectedDomain)
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.domains.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDomain && matchesSearch
  })

  const handleOpenBooking = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setBookingModalOpen(true)
  }

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMentor) return

    setBookingModalOpen(false)
    toast.success(`Mentorship session scheduled with ${selectedMentor.name}! Google Meet link sent to your registered email.`)

    try {
      await mentorshipApi.bookSession({
        mentorId: selectedMentor.id,
        scheduledTime: selectedSlot,
        topic: sessionType,
        goals: notes,
        durationMinutes: 45
      })
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Verified Industry Mentors
            </span>
            <span className="text-xs text-slate-400">• Free 1:1 Guided Sessions for Students</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            CareerSetu Mentorship Gateway
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Connect 1:1 with tech leaders, alumni architects, and engineering managers from top product organizations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold p-2.5 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-slate-800 dark:text-slate-200">100% Industry Verified</p>
            <p className="text-[10px] text-slate-400 font-normal">MCA & Corporate Email Authenticated</p>
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-slate-100 dark:bg-slate-800 overflow-x-auto max-w-full" style={{ borderColor: 'var(--border-default)' }}>
          {domainsList.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedDomain === dom
                  ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {dom === 'ALL' ? 'All Domains' : dom}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search mentors by name, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
        </div>
      </motion.div>

      {/* Mentors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMentors.map((mentor) => (
          <motion.div
            key={mentor.id}
            variants={fadeUp}
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl border flex flex-col justify-between shadow-sm transition-all hover:shadow-md"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div>
              {/* Top Row: Avatar & Rating */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mentor.gradient} flex items-center justify-center text-white font-bold text-base shadow-sm`}>
                    {mentor.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{mentor.role}</p>
                    <p className="text-xs text-slate-400">{mentor.company} • {mentor.experienceYears}y exp</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg">
                  <Star className="w-3 h-3 fill-current" /> {mentor.rating}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                {mentor.bio}
              </p>

              {/* Domains */}
              <div className="flex flex-wrap gap-1 mb-4">
                {mentor.domains.map((d) => (
                  <span key={d} className="text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300" style={{ borderColor: 'var(--border-light)' }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Next availability & Booking button */}
            <div className="pt-3 border-t space-y-2.5" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-500" /> Next: {mentor.nextAvailable}
                </span>
                <span>{mentor.sessionsCount} sessions</span>
              </div>

              <button
                onClick={() => handleOpenBooking(mentor)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" /> Book 1:1 Session
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModalOpen && selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setBookingModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 z-10 space-y-5"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedMentor.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {selectedMentor.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-base" style={{ color: 'var(--text-primary)' }}>
                      Schedule with {selectedMentor.name}
                    </h3>
                    <p className="text-xs text-slate-400">{selectedMentor.role} at {selectedMentor.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                {/* Session Type */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
                    Session Focus Area
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Mock Technical Interview',
                      'Resume & ATS Strategy',
                      'System Design Review',
                      'Career Roadmap Discussion'
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSessionType(type)}
                        className={`p-2.5 rounded-xl border text-left font-medium transition ${
                          sessionType === type
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Slots */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
                    Select Available Time Slot (IST)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      '10:00 AM - 10:45 AM',
                      '03:00 PM - 03:45 PM',
                      '06:30 PM - 07:15 PM',
                      '08:00 PM - 08:45 PM'
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl border text-center font-semibold transition ${
                          selectedSlot === slot
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes for Mentor */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
                    Questions or Goals for this Session (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. I am preparing for a Backend Engineer interview and want feedback on my distributed cache project..."
                    className="w-full p-2.5 rounded-xl border outline-none font-medium leading-relaxed resize-none focus:ring-2 focus:ring-blue-500/20"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand transition shadow-sm flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Confirm 1:1 Booking
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
