import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, GraduationCap, Code, Award, Briefcase, Globe,
  CheckCircle, Plus, Edit3, ArrowRight, ShieldCheck, Sparkles, Hash,
  X, Loader2, ExternalLink
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBadgeStore } from '@/store/badgeStore'
import { studentApi, type StudentProfileData } from '@/api/studentApi'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i*0.07 } }) }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function Section({ title, icon: Icon, children, onAdd, addLabel }: { title: string; icon: React.ElementType; children: React.ReactNode; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="p-6 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-brand-50)' }}>
            <Icon className="w-4 h-4" style={{ color: 'var(--color-brand-500)' }} />
          </div>
          <h2 className="font-semibold font-display" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        </div>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                  style={{ color: 'var(--color-brand-600)', borderColor: 'var(--color-brand-200)', background: 'var(--color-brand-50)' }}>
            <Plus className="w-3 h-3" /> {addLabel || 'Add'}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function SkillBadge({ name, level, verified }: { name: string; level: string; verified: boolean }) {
  const colors: Record<string,string> = { BEGINNER: 'var(--color-brand-100)', INTERMEDIATE: 'hsl(38,92%,90%)', ADVANCED: 'hsl(148,60%,90%)', EXPERT: 'hsl(262,72%,92%)' }
  const textColors: Record<string,string> = { BEGINNER: 'var(--color-brand-700)', INTERMEDIATE: 'hsl(38,90%,40%)', ADVANCED: 'hsl(148,60%,34%)', EXPERT: 'hsl(262,72%,44%)' }
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: colors[level] || 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
      <span className="text-sm font-medium" style={{ color: textColors[level] || 'var(--text-primary)' }}>{name}</span>
      {verified && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'hsl(148,60%,42%)' }} />}
      <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{level}</span>
    </div>
  )
}

export default function CareerPassport() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { skills, badges } = useBadgeStore()

  const [profile, setProfile] = useState<StudentProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editForm, setEditForm] = useState({
    headline: 'Aspiring Full Stack & AI Systems Engineer',
    bio: 'Computer Science undergraduate passionate about distributed systems, React, and generative AI platforms.',
    rollNumber: '22CSE041',
    currentYear: 4,
    currentSemester: 7,
    cgpa: 8.75,
    graduationYear: 2026,
    githubUrl: 'https://github.com/aaravsharma-dev',
    linkedinUrl: 'https://linkedin.com/in/aarav-sharma-demo',
    portfolioUrl: 'https://aaravsharma.dev',
    isActivelyLooking: true,
  })

  useEffect(() => {
    studentApi.getMyProfile()
      .then((res) => {
        setProfile(res)
        setEditForm({
          headline: res.headline || 'Aspiring Full Stack & AI Systems Engineer',
          bio: res.bio || 'Computer Science undergraduate passionate about distributed systems, React, and generative AI platforms.',
          rollNumber: res.rollNumber || '22CSE041',
          currentYear: res.currentYear || 4,
          currentSemester: res.currentSemester || 7,
          cgpa: res.cgpa ? Number(res.cgpa) : 8.75,
          graduationYear: res.graduationYear || 2026,
          githubUrl: res.githubUrl || 'https://github.com/aaravsharma-dev',
          linkedinUrl: res.linkedinUrl || 'https://linkedin.com/in/aarav-sharma-demo',
          portfolioUrl: res.portfolioUrl || 'https://aaravsharma.dev',
          isActivelyLooking: res.isActivelyLooking ?? true,
        })
      })
      .catch((err) => {
        console.warn('Failed to load live profile, using defaults:', err)
      })
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await studentApi.updateMyProfile(editForm)
      setProfile(updated)
      setIsEditing(false)
      toast.success('Career Passport updated successfully!')
    } catch (err: any) {
      console.error('Failed to update profile:', err)
      toast.error(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const verifiedSkillsCount = skills.filter(s => s.verified).length
  const completionPct = profile?.profileCompletionPct
    ? Math.min(100, Math.round(profile.profileCompletionPct))
    : Math.min(100, Math.round(50 + (verifiedSkillsCount * 5) + (badges.length * 6)))

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-4xl space-y-6 mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Career Passport</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Your verified, reusable professional profile. One profile, many opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Tamper-Proof Verified
          </div>
        </div>
      </motion.div>

      {/* Profile header card */}
      <motion.div variants={fadeUp} custom={1} className="p-6 rounded-2xl border relative overflow-hidden" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                    {user?.fullName || 'Aarav Sharma'}
                  </h2>
                  {(profile?.isActivelyLooking ?? editForm.isActivelyLooking) && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Actively Seeking Roles
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium mt-1 text-blue-600 dark:text-blue-400">
                  {profile?.headline || editForm.headline}
                </p>
                <p className="text-xs mt-1 leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl">
                  {profile?.bio || editForm.bio}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  <span>Roll: {profile?.rollNumber || editForm.rollNumber}</span>
                  <span>•</span>
                  <span>Year {profile?.currentYear || editForm.currentYear}, Sem {profile?.currentSemester || editForm.currentSemester}</span>
                  <span>•</span>
                  <span>Graduation: {profile?.graduationYear || editForm.graduationYear}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-600">CGPA: {profile?.cgpa || editForm.cgpa}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:bg-slate-50 dark:hover:bg-slate-800 transition flex-shrink-0"
                style={{ color: 'var(--color-brand-600)', borderColor: 'var(--color-brand-200)', background: 'var(--color-brand-50)' }}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
              {(profile?.githubUrl || editForm.githubUrl) && (
                <a
                  href={profile?.githubUrl || editForm.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
                >
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              {(profile?.linkedinUrl || editForm.linkedinUrl) && (
                <a
                  href={profile?.linkedinUrl || editForm.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 transition"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              {(profile?.portfolioUrl || editForm.portfolioUrl) && (
                <a
                  href={profile?.portfolioUrl || editForm.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition text-emerald-600"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <Globe className="w-3.5 h-3.5" /> Portfolio <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Profile completion */}
        <div className="mt-5 p-4 rounded-xl" style={{ background: 'var(--surface-inset)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Profile Strength & Verification Level</p>
            <span className="text-sm font-bold text-emerald-600">{completionPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            {badges.length} verified assessment badges & {verifiedSkillsCount} verified skills linked to your cryptographic passport.
          </p>
        </div>
      </motion.div>

      {/* Verifiable Badges Section */}
      <motion.div variants={fadeUp} custom={2}>
        <Section
          title={`Verifiable Skill Badges (${badges.length})`}
          icon={ShieldCheck}
          onAdd={() => navigate('/student/assessment')}
          addLabel="Earn New Badge"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border flex flex-col justify-between transition-all hover:shadow-sm"
                style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}
              >
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Score {b.score}/100
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-500">
                      {b.verificationHash}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {b.skillName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {b.assessmentName}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t text-[11px] text-slate-400" style={{ borderColor: 'var(--border-light)' }}>
                  <span>Verified: {new Date(b.earnedAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-emerald-600 uppercase tracking-wider">{b.level}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Skills */}
      <motion.div variants={fadeUp} custom={3}>
        <Section
          title="Skills & Competencies"
          icon={Code}
          onAdd={() => navigate('/student/skills')}
          addLabel="Manage Skills"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skills.map(s => (
              <SkillBadge key={s.name} name={s.name} level={s.label} verified={s.verified} />
            ))}
          </div>
          <button
            onClick={() => navigate('/student/assessment')}
            className="mt-3 text-xs font-semibold flex items-center gap-1 text-blue-600 hover:underline"
          >
            Take code assessment to verify more skills <ArrowRight className="w-3 h-3" />
          </button>
        </Section>
      </motion.div>

      {/* Education */}
      <motion.div variants={fadeUp} custom={4}>
        <Section title="Education" icon={GraduationCap} onAdd={() => {}}>
          <div className="space-y-4">
            {[
              { degree: 'B.Tech Computer Science & Engineering', institution: 'Pune Institute of Computer Technology', year: '2022 - 2026', cgpa: '8.75', current: true },
              { degree: 'Senior Secondary (Class XII CBSE)', institution: 'Delhi Public School', year: '2020 - 2022', cgpa: '94.2%', current: false },
            ].map(edu => (
              <div key={edu.degree} className="flex items-start gap-3 p-4 rounded-xl border" style={{ borderColor: 'var(--border-light)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-brand-50)' }}>
                  <GraduationCap className="w-5 h-5" style={{ color: 'var(--color-brand-500)' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{edu.degree}</p>
                    {edu.current && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'hsl(148,60%,92%)', color: 'hsl(148,60%,38%)' }}>Current</span>}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{edu.institution}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{edu.year}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-brand-600)' }}>CGPA: {edu.cgpa}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Projects */}
      <motion.div variants={fadeUp} custom={5}>
        <Section title="Projects" icon={FileText} onAdd={() => {}}>
          <div className="space-y-3">
            {[
              { name: 'Full-Stack Distributed Job Gateway', tech: ['Java', 'Spring Boot', 'React', 'PostgreSQL'], desc: 'High-performance career gateway featuring AI skill ranking, JWT stateless authentication, and microservices.', verified: true },
              { name: 'AI Skill Graph & Match Engine', tech: ['Python', 'FastAPI', 'PyTorch', 'Vector Embeddings'], desc: 'Semantic matching pipeline analyzing resumes, student verified badges, and employer opportunity requirements.', verified: true },
            ].map(p => (
              <div key={p.name} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  {p.verified && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Project Verified
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 mb-2" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {p.tech.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Certifications */}
      <motion.div variants={fadeUp} custom={6}>
        <Section title="Industry Certifications" icon={Award} onAdd={() => {}}>
          <div className="space-y-2">
            {[
              { name: 'Oracle Certified Professional: Java SE Developer', issuer: 'Oracle Corporation', date: 'May 2024', verified: true },
              { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Jan 2024', verified: true },
            ].map(cert => (
              <div key={cert.name} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: 'var(--border-light)' }}>
                <Award className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(38,92%,48%)' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cert.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cert.issuer} · {cert.date}</p>
                </div>
                {cert.verified && <CheckCircle className="w-4 h-4" style={{ color: 'hsl(148,60%,42%)' }} />}
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 z-10 space-y-5"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                    Edit Career Passport
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Headline */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.headline}
                    onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                    placeholder="e.g. Cloud & AI Systems Engineer"
                    className="w-full p-2.5 rounded-xl border outline-none font-medium transition focus:ring-2 focus:ring-blue-500/20"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Bio / Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Brief description of your technical passions and achievements..."
                    className="w-full p-2.5 rounded-xl border outline-none font-medium leading-relaxed resize-none transition focus:ring-2 focus:ring-blue-500/20"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Academic Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Roll No.</label>
                    <input
                      type="text"
                      value={editForm.rollNumber}
                      onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
                      className="w-full p-2 rounded-lg border outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Year / Sem</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editForm.currentYear}
                        onChange={(e) => setEditForm({ ...editForm, currentYear: Number(e.target.value) })}
                        className="w-1/2 p-2 rounded-lg border outline-none"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={editForm.currentSemester}
                        onChange={(e) => setEditForm({ ...editForm, currentSemester: Number(e.target.value) })}
                        className="w-1/2 p-2 rounded-lg border outline-none"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={10}
                      value={editForm.cgpa}
                      onChange={(e) => setEditForm({ ...editForm, cgpa: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border outline-none font-semibold text-emerald-600"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Grad Year</label>
                    <input
                      type="number"
                      min={2024}
                      max={2030}
                      value={editForm.graduationYear}
                      onChange={(e) => setEditForm({ ...editForm, graduationYear: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                {/* Social links */}
                <div className="space-y-2.5">
                  <span className="block font-semibold text-slate-600 dark:text-slate-300">Online Profiles & Portfolios</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400">GitHub URL</span>
                      <input
                        type="url"
                        value={editForm.githubUrl}
                        onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full p-2 rounded-lg border outline-none font-mono text-[11px]"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">LinkedIn URL</span>
                      <input
                        type="url"
                        value={editForm.linkedinUrl}
                        onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full p-2 rounded-lg border outline-none font-mono text-[11px]"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Portfolio Website</span>
                      <input
                        type="url"
                        value={editForm.portfolioUrl}
                        onChange={(e) => setEditForm({ ...editForm, portfolioUrl: e.target.value })}
                        placeholder="https://yourdomain.dev"
                        className="w-full p-2 rounded-lg border outline-none font-mono text-[11px]"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actively Looking Checkbox */}
                <label className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition" style={{ borderColor: 'var(--border-light)' }}>
                  <input
                    type="checkbox"
                    checked={editForm.isActivelyLooking}
                    onChange={(e) => setEditForm({ ...editForm, isActivelyLooking: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Actively Seeking Opportunities</span>
                    <p className="text-[11px] text-slate-400">Highlight profile to recruiters and activate instant marketplace matching</p>
                  </div>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand disabled:opacity-50 transition shadow-sm flex items-center gap-1.5"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Save Passport
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
