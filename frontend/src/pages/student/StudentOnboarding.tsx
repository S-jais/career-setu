import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, ArrowRight, ArrowLeft, User, GraduationCap,
  Sparkles, Code, Globe, Shield, Star, Rocket
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeOut' as const } }
}

const steps = [
  { id: 1, title: 'Personal Profile', icon: User, desc: 'Your identity and bio' },
  { id: 2, title: 'Academics', icon: GraduationCap, desc: 'College and scores' },
  { id: 3, title: 'Skills & Aspirations', icon: Code, desc: 'What you know & want' },
  { id: 4, title: 'Portfolio & Links', icon: Globe, desc: 'GitHub and projects' },
  { id: 5, title: 'Privacy & Sovereignty', icon: Shield, desc: 'Control who sees you' }
]

const popularSkills = [
  'Java', 'Spring Boot', 'Python', 'React', 'TypeScript',
  'PostgreSQL', 'Docker', 'Redis', 'Node.js', 'Machine Learning',
  'SQL', 'Data Structures', 'REST APIs', 'Git', 'AWS'
]

const roles = [
  'Backend Developer Intern', 'Frontend Developer Intern',
  'Full Stack Engineer', 'Data Science Fellow', 'Cloud/DevOps Engineer'
]

export default function StudentOnboarding() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    headline: 'Computer Science Student | Aspiring Backend Architect',
    bio: 'Passionate about distributed systems, clean architecture, and building resilient platforms.',
    city: 'Bengaluru',
    state: 'Karnataka',
    institutionName: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    cgpa: '8.7',
    graduationYear: '2026',
    selectedSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    targetRole: 'Backend Developer Intern',
    githubUrl: 'https://github.com/',
    linkedinUrl: 'https://linkedin.com/in/',
    portfolioUrl: 'https://',
    visibility: 'VERIFIED_EMPLOYERS'
  })

  const [isCompleted, setIsCompleted] = useState(false)

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.selectedSkills.includes(skill)
      return {
        ...prev,
        selectedSkills: exists
          ? prev.selectedSkills.filter(s => s !== skill)
          : [...prev.selectedSkills, skill]
      }
    })
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--surface-base)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl border text-center space-y-6 shadow-2xl"
          style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
        >
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-lg"
               style={{ background: 'linear-gradient(135deg, hsl(142, 70%, 45%), hsl(160, 84%, 39%))' }}>
            🎉
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading mb-2" style={{ color: 'var(--text-primary)' }}>
              Profile Fully Activated!
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Your Career Passport is now 92% complete and indexed for AI match discovery by verified employers.
            </p>
          </div>

          <div className="p-4 rounded-2xl border text-left flex items-center gap-3"
               style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
                Next Recommended Action:
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Complete your first verified skill assessment to earn a badge.
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/student')}
            className="w-full py-3 px-6 rounded-xl font-medium text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition"
            style={{ background: 'var(--color-brand-500)' }}
          >
            Go to Student Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--surface-base)' }}>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border inline-block"
                style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-500)', borderColor: 'var(--border-light)' }}>
            Step {currentStep} of 5
          </span>
          <h1 className="text-3xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Complete Your Career Passport
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Help our AI match engine highlight your best strengths to tier-1 companies.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map(step => {
            const isDone = currentStep > step.id
            const isCurrent = currentStep === step.id
            const Icon = step.icon
            return (
              <div key={step.id} className="text-center">
                <div
                  className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-sm font-semibold transition-all mb-1 ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'border-2 text-white shadow-md'
                      : 'border text-slate-400'
                  }`}
                  style={{
                    background: isDone
                      ? '#10b981'
                      : isCurrent
                      ? 'var(--color-brand-500)'
                      : 'var(--surface-card)',
                    borderColor: isCurrent ? 'var(--color-brand-500)' : 'var(--border-default)'
                  }}
                >
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <p className="text-[11px] font-medium hidden sm:block truncate" style={{ color: isCurrent ? 'var(--color-brand-500)' : 'var(--text-muted)' }}>
                  {step.title}
                </p>
              </div>
            )
          })}
        </div>

        {/* Step Body */}
        <div className="p-8 rounded-3xl border shadow-xl" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Personal Information & Headline
                </h3>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    Shown at the top of your profile and recruiter search results.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Short Bio
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none resize-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Academic Credentials & Standing
                </h3>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>College / University Name</label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Branch</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Degree</label>
                    <select
                      value={formData.degree}
                      onChange={e => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    >
                      <option>B.Tech</option>
                      <option>M.Tech</option>
                      <option>MCA</option>
                      <option>BCA</option>
                      <option>MBA</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Current CGPA (out of 10)</label>
                    <input
                      type="number"
                      step="0.1"
                      max="10"
                      value={formData.cgpa}
                      onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Graduation Year</label>
                    <input
                      type="number"
                      value={formData.graduationYear}
                      onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Skills & Target Roles
                </h3>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Select Your Core Technical Competencies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.map(skill => {
                      const selected = formData.selectedSkills.includes(skill)
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            selected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'text-slate-600 hover:border-slate-400'
                          }`}
                          style={{
                            background: selected ? 'var(--color-brand-500)' : 'var(--surface-inset)',
                            borderColor: selected ? 'var(--color-brand-500)' : 'var(--border-default)',
                            color: selected ? '#ffffff' : 'var(--text-primary)'
                          }}
                        >
                          {skill} {selected && '✓'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Primary Career Target
                  </label>
                  <div className="space-y-2">
                    {roles.map(r => (
                      <label
                        key={r}
                        className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                        style={{
                          background: formData.targetRole === r ? 'var(--color-brand-50)' : 'var(--surface-inset)',
                          borderColor: formData.targetRole === r ? 'var(--color-brand-500)' : 'var(--border-light)'
                        }}
                      >
                        <input
                          type="radio"
                          name="targetRole"
                          checked={formData.targetRole === r}
                          onChange={() => setFormData({ ...formData, targetRole: r })}
                          className="accent-blue-600"
                        />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{r}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Proof of Work & Profiles
                </h3>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>GitHub Profile URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Portfolio / Personal Website</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="step5" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Privacy & Sovereign Visibility Settings
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  In compliance with DPDP Act 2023, you retain absolute ownership and visibility governance over your educational and performance records.
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'VERIFIED_EMPLOYERS', title: 'Verified Employers & TPO (Recommended)', desc: 'Only vetted companies with verified CIN/GST and your college placement cell can discover you.' },
                    { id: 'INSTITUTION_ONLY', title: 'Institution Only', desc: 'Visible only to your college TPO and department faculty coordinators.' },
                    { id: 'PUBLIC_PORTFOLIO', title: 'Public Portfolio', desc: 'Creates a shareable public URL with your verified credentials and projects.' }
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition"
                      style={{
                        background: formData.visibility === opt.id ? 'var(--color-brand-50)' : 'var(--surface-inset)',
                        borderColor: formData.visibility === opt.id ? 'var(--color-brand-500)' : 'var(--border-light)'
                      }}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        checked={formData.visibility === opt.id}
                        onChange={() => setFormData({ ...formData, visibility: opt.id })}
                        className="mt-1 accent-blue-600"
                      />
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{opt.title}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
                currentStep === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
              }`}
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-md transition hover:opacity-95"
              style={{ background: 'var(--color-brand-500)' }}
            >
              {currentStep === 5 ? 'Finish & Activate' : 'Continue'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
