import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
  ArrowRight, Sparkles, Shield, Zap, Users, Building2,
  GraduationCap, Briefcase, Target, TrendingUp, CheckCircle,
  Star, ChevronRight, Globe, BookOpen, Award, MessageSquare,
  BarChart3, Layers, Brain, Code, Search, Bell, FileText
} from 'lucide-react'

// ── Animation Variants ─────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const }
  })
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

// ── Shared Components ──────────────────────────────────────────
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'accent' | 'success' }) {
  const styles = {
    default: 'bg-brand-50 text-brand-700 border-brand-200',
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
           style={{ background: 'var(--color-brand-50)', borderColor: 'var(--color-brand-200)' }}>
        <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-brand-500)' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-brand-600)' }}>
          {children}
        </span>
      </div>
    </div>
  )
}

// ── Navbar ─────────────────────────────────────────────────────
function Navbar() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
      style={{ borderBottomColor: 'var(--border-light)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 p-0.5 border shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform"
                 style={{ borderColor: 'var(--border-light)' }}>
              <img src="/career-setu-logo.png" alt="CareerSetu Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
                Career<span style={{ color: 'var(--color-brand-500)' }}>Setu</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                Skills · Opportunities · Careers
              </span>
            </div>
          </Link>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works"
               className="text-sm font-medium transition-colors hover:text-brand-500"
               style={{ color: 'var(--text-secondary)' }}>
              For Students
            </a>
            <Link to="/student/opportunities"
               className="text-sm font-medium transition-colors hover:text-brand-500"
               style={{ color: 'var(--text-secondary)' }}>
              Opportunities
            </Link>
            <a href="#journeys"
               className="text-sm font-medium transition-colors hover:text-brand-500"
               style={{ color: 'var(--text-secondary)' }}>
              For Employers
            </a>
            <a href="#journeys"
               className="text-sm font-medium transition-colors hover:text-brand-500"
               style={{ color: 'var(--text-secondary)' }}>
              For Institutions
            </a>
            <a href="#skill-ai"
               className="text-sm font-medium transition-colors hover:text-brand-500"
               style={{ color: 'var(--text-secondary)' }}>
              Skill AI
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard"
                    className="text-sm font-semibold px-4 py-2 rounded-lg text-white gradient-brand transition-opacity hover:opacity-90 shadow-sm flex items-center gap-1.5">
                <span>Dashboard ({user?.fullName ? user.fullName.split(' ')[0] : 'Portal'})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/auth/login"
                      className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      style={{ color: 'var(--text-secondary)' }}>
                  Sign In
                </Link>
                <Link to="/auth/register"
                      className="text-sm font-semibold px-4 py-2 rounded-lg text-white gradient-brand transition-opacity hover:opacity-90 shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

// ── Hero Section ───────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden"
             style={{ background: 'var(--surface-base)' }}>

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, hsl(224, 75%, 55%), transparent)' }} />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl"
             style={{ background: 'radial-gradient(circle, hsl(38, 92%, 48%), transparent)' }} />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, hsl(262, 72%, 52%), transparent)' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: 'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)',
               backgroundSize: '60px 60px'
             }} />
      </div>

      <motion.div className="relative z-10 max-w-5xl mx-auto px-4 text-center"
                  variants={stagger} initial="hidden" animate="visible">

        {/* Badge */}
        <motion.div variants={fadeUp} custom={0} className="mb-6">
          <Badge variant="accent">
            <Sparkles className="w-3 h-3" />
            India's First AI Career Intelligence Platform
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} custom={1}
                   className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.08] tracking-tight mb-6">
          <span style={{ color: 'var(--text-primary)' }}>Your Skills.</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Your Industry.</span>
          <br />
          <span className="gradient-text">Your Future.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p variants={fadeUp} custom={2}
                  className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}>
          Build verified skills. Discover opportunities that fit. Connect with
          industry. Navigate your career journey with AI-powered intelligence —
          from campus to career and beyond.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/auth/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white gradient-brand shadow-lg hover:opacity-90 transition-opacity text-base">
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/student/opportunities"
             id="hero-explore-opportunities-btn"
             className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:border-brand-400 hover:shadow-md cursor-pointer"
             style={{ color: 'var(--text-primary)', borderColor: 'var(--border-default)', background: 'var(--surface-card)' }}>
            Explore Opportunities
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div variants={fadeUp} custom={4}
                    className="flex flex-wrap items-center justify-center gap-6 text-sm"
                    style={{ color: 'var(--text-muted)' }}>
          {[
            { icon: Shield, text: 'Privacy-First Platform' },
            { icon: CheckCircle, text: 'Verified Opportunities' },
            { icon: Brain, text: 'AI Career Intelligence' },
            { icon: Globe, text: 'Pan-India Network' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="w-4 h-4" style={{ color: 'var(--color-brand-500)' }} />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Hero Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-16 max-w-5xl mx-auto px-4 w-full">
        <HeroDashboardPreview />
      </motion.div>
    </section>
  )
}

function HeroDashboardPreview() {
  return (
    <div className="relative">
      {/* Glow effect behind */}
      <div className="absolute inset-0 blur-2xl opacity-20 -z-10"
           style={{ background: 'linear-gradient(135deg, hsl(224, 75%, 55%), hsl(262, 72%, 52%))' }} />

      <div className="glass rounded-2xl border overflow-hidden shadow-2xl"
           style={{ borderColor: 'var(--border-default)' }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b"
             style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
          <div className="flex gap-1.5">
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md text-xs" style={{ background: 'var(--surface-card)', color: 'var(--text-muted)' }}>
              careersetu.in/student/overview
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6 grid grid-cols-12 gap-4" style={{ background: 'var(--surface-base)' }}>
          {/* Left sidebar */}
          <div className="col-span-2 space-y-1">
            {[
              { icon: Target, label: 'Overview', active: true },
              { icon: FileText, label: 'Passport' },
              { icon: Zap, label: 'Skills' },
              { icon: Search, label: 'Opportunities' },
              { icon: BarChart3, label: 'Applications' },
              { icon: Brain, label: 'AI Copilot' },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label}
                   className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${active ? 'text-white' : ''}`}
                   style={active ? { background: 'var(--color-brand-500)', color: 'white' } : { color: 'var(--text-secondary)' }}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden lg:block">{label}</span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="col-span-7 space-y-4">
            {/* Career readiness */}
            <div className="p-4 rounded-xl border"
                 style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Career Readiness Score</p>
                  <p className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>72<span className="text-sm font-normal">/100</span></p>
                </div>
                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                     style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
                  <TrendingUp className="w-3 h-3" />
                  <span>+8 this month</span>
                </div>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'var(--surface-inset)' }}>
                <motion.div className="h-full rounded-full" style={{ background: 'var(--color-brand-500)', width: '72%' }}
                            initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1, delay: 1 }} />
              </div>
            </div>

            {/* Opportunity matches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Top Matches for You</p>
                <Link to="/student/opportunities" className="text-xs font-medium hover:underline" style={{ color: 'var(--color-brand-500)' }}>
                  View all →
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { company: 'TechCorp India', role: 'Backend Developer Intern', match: 87, type: 'INTERNSHIP', verified: true },
                  { company: 'DataVision Analytics', role: 'Data Science Intern', match: 79, type: 'INTERNSHIP', verified: true },
                  { company: 'InnovateSoft', role: 'Full Stack Developer', match: 74, type: 'JOB', verified: true },
                ].map((opp) => (
                  <Link key={opp.role}
                       to="/student/opportunities"
                       className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer block"
                       style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'var(--color-brand-50)' }}>
                      <Building2 className="w-4 h-4" style={{ color: 'var(--color-brand-500)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{opp.role}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opp.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
                        {opp.type}
                      </span>
                      <div className="text-xs font-bold" style={{ color: 'var(--color-success)' }}>{opp.match}%</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — AI Copilot */}
          <div className="col-span-3 space-y-3">
            <div className="p-3 rounded-xl border"
                 style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI Career Copilot</p>
              </div>
              <div className="p-2 rounded-lg text-xs leading-relaxed"
                   style={{ background: 'var(--surface-inset)', color: 'var(--text-secondary)' }}>
                Your strongest skills are <strong>Java</strong> and <strong>SQL</strong>. To unlock backend roles, focus on <strong>Spring Boot</strong> and <strong>Docker</strong> next.
              </div>
              <div className="mt-2 text-xs px-2 py-1 rounded-full text-center font-medium"
                   style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
                AI-Assisted · Not a final decision
              </div>
            </div>

            {/* Skill gaps */}
            <div className="p-3 rounded-xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Top Skill Gaps</p>
              {[
                { skill: 'Docker', current: 25, required: 65 },
                { skill: 'Spring Boot', current: 45, required: 80 },
              ].map(({ skill, current, required }) => (
                <div key={skill} className="mb-2">
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    <span>{skill}</span>
                    <span>{current}→{required}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-inset)' }}>
                    <div className="h-full rounded-full" style={{ background: 'var(--color-brand-500)', width: `${current}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── How It Works ───────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', icon: GraduationCap, title: 'Build Your Career Passport', desc: 'Create a verified, reusable profile with skills, education, projects, and achievements. One profile, many applications.' },
    { num: '02', icon: Target, title: 'Assess & Map Your Skills', desc: 'Take AI-proctored assessments. Get a clear skill map with verification. Understand exactly where you stand versus industry standards.' },
    { num: '03', icon: TrendingUp, title: 'Identify & Close Gaps', desc: 'Our AI analyzes the gap between your current skills and target roles. Get a personalized learning roadmap to close the gap.' },
    { num: '04', icon: Briefcase, title: 'Discover & Apply', desc: 'Browse verified opportunities matched to your profile with explainable AI scores. Apply with one click using your Career Passport.' },
    { num: '05', icon: Award, title: 'Gain Verified Experience', desc: 'Complete internships with structured mentor guidance, milestone tracking, and verified certificates for your portfolio.' },
    { num: '06', icon: Users, title: 'Continue Growing', desc: 'Connect with mentors, collaborate on research, track your career journey, and build lasting industry connections.' },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-4xl font-bold font-display text-center mb-4" style={{ color: 'var(--text-primary)' }}>
              Your complete career journey,<br />all in one place
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: 'var(--text-secondary)' }}>
              From the first day on campus to your first role and beyond — CareerSetu supports every step of your career lifecycle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} custom={i}
                         className="relative p-6 rounded-2xl border transition-all hover:shadow-md group"
                         style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:bg-brand-500"
                         style={{ background: 'var(--color-brand-50)' }}>
                      <step.icon className="w-6 h-6 transition-colors group-hover:text-white"
                                  style={{ color: 'var(--color-brand-500)' }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold mb-1 block" style={{ color: 'var(--color-brand-400)' }}>{step.num}</span>
                    <h3 className="font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Role Journey Cards ──────────────────────────────────────────
function JourneysSection() {
  const journeys = [
    {
      role: 'Students & Alumni',
      icon: GraduationCap,
      color: 'var(--color-brand-500)',
      bgColor: 'var(--color-brand-50)',
      points: [
        'Build a verified Career Passport',
        'Take assessments & get skill scores',
        'Discover opportunities matched to your skills',
        'Apply with AI-generated match explanations',
        'Track applications & manage interviews',
        'Complete mentored internships & earn certificates',
        'Get AI career guidance & learning roadmaps',
      ],
    },
    {
      role: 'Industry & Employers',
      icon: Briefcase,
      color: 'hsl(148, 60%, 42%)',
      bgColor: 'hsl(148, 60%, 96%)',
      points: [
        'Post verified opportunities (jobs, internships, projects)',
        'Get matched with skill-verified candidates',
        'AI-powered candidate ranking with explainability',
        'Structured ATS with pipeline management',
        'Conduct mentored internship programs',
        'Collaborate on live projects with institutions',
        'Partner on research & faculty development',
      ],
    },
    {
      role: 'Institutions & TPOs',
      icon: Building2,
      color: 'hsl(262, 72%, 52%)',
      bgColor: 'hsl(262, 72%, 97%)',
      points: [
        'Centralized placement & internship management',
        'Student skill gap analytics by department',
        'Industry demand intelligence for curriculum',
        'Employer relationship management',
        'Policy engine for institutional rules',
        'Auditable workflows & compliance records',
        'Faculty–industry collaboration facilitation',
      ],
    },
  ]

  return (
    <section id="journeys" className="py-24 px-4" style={{ background: 'var(--surface-inset)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>Built for Everyone</SectionLabel>
            <h2 className="text-4xl font-bold font-display text-center mb-4" style={{ color: 'var(--text-primary)' }}>
              One platform, three powerful journeys
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: 'var(--text-secondary)' }}>
              CareerSetu serves students, industry, and institutions with purpose-built tools for each — all in a connected ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {journeys.map((journey, i) => (
              <motion.div key={journey.role} variants={fadeUp} custom={i}
                         className="p-6 rounded-2xl border"
                         style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                       style={{ background: journey.bgColor }}>
                    <journey.icon className="w-5 h-5" style={{ color: journey.color }} />
                  </div>
                  <h3 className="font-bold font-display" style={{ color: 'var(--text-primary)' }}>{journey.role}</h3>
                </div>
                <ul className="space-y-2.5">
                  {journey.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: journey.color }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Skill Intelligence Section ──────────────────────────────────
function SkillIntelligenceSection() {
  return (
    <section id="skill-ai" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp}>
              <SectionLabel>Skill Intelligence</SectionLabel>
              <h2 className="text-4xl font-bold font-display mb-5" style={{ color: 'var(--text-primary)' }}>
                Know exactly where you stand — and what to do next
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Our Skill Intelligence engine assesses your abilities, maps them against industry demand, identifies precise gaps, and generates personalized learning roadmaps. Every score is explainable and deterministic — not a black box.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Assess', desc: 'Technical, aptitude, domain, soft skills & coding tests', icon: CheckCircle },
                  { label: 'Map', desc: 'Your skill graph vs. target role requirements', icon: Layers },
                  { label: 'Gap', desc: 'Precise scores with confidence and priority rankings', icon: Target },
                  { label: 'Learn', desc: 'AI-generated roadmap with projects and milestones', icon: BookOpen },
                  { label: 'Prove', desc: 'Verified skill badges from projects, assessments & employers', icon: Award },
                ].map(({ label, desc, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                         style={{ background: 'var(--color-brand-50)' }}>
                      <Icon className="w-4 h-4" style={{ color: 'var(--color-brand-500)' }} />
                    </div>
                    <div>
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label} → </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skill Gap Visualization */}
            <motion.div variants={fadeUp} custom={2}>
              <div className="p-6 rounded-2xl border shadow-lg"
                   style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-semibold font-display" style={{ color: 'var(--text-primary)' }}>Skill Gap Analysis</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Target: Backend Developer</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
                    AI-Assisted
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { skill: 'Java', current: 78, required: 80, status: 'near' },
                    { skill: 'SQL', current: 72, required: 70, status: 'met' },
                    { skill: 'REST APIs', current: 65, required: 75, status: 'gap' },
                    { skill: 'Spring Boot', current: 45, required: 80, status: 'gap' },
                    { skill: 'Docker', current: 25, required: 65, status: 'critical' },
                    { skill: 'AWS Basics', current: 15, required: 50, status: 'critical' },
                  ].map(({ skill, current, required, status }) => {
                    const colors = {
                      met: 'hsl(148, 60%, 42%)',
                      near: 'hsl(38, 92%, 48%)',
                      gap: 'hsl(224, 75%, 55%)',
                      critical: 'hsl(4, 78%, 53%)'
                    }
                    const labels = { met: 'Met', near: 'Near', gap: 'Gap', critical: 'Priority' }
                    const color = colors[status as keyof typeof colors]
                    return (
                      <div key={skill}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{current} / {required}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                                  style={{ background: `${color}15`, color }}>
                              {labels[status as keyof typeof labels]}
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2 rounded-full" style={{ background: 'var(--surface-inset)' }}>
                          <motion.div className="h-full rounded-full"
                                      style={{ background: color, width: `${current}%` }}
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${current}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.8, delay: 0.1 }} />
                          {/* Required marker */}
                          <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                               style={{ left: `${required}%`, background: color, opacity: 0.5 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-5 p-3 rounded-xl text-sm"
                     style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-700)' }}>
                  <strong>AI Suggestion:</strong> Focus on Spring Boot and Docker to unlock 23 additional backend roles. Estimated 8-10 weeks with 8 hrs/week.
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── AI Copilot Section ─────────────────────────────────────────
function AICopilotSection() {
  const messages = [
    { role: 'user', content: "I'm interested in becoming a backend developer. What should I focus on?" },
    { role: 'ai', content: "Based on your profile, you have strong Java fundamentals (78/100) and SQL skills (72/100). Your biggest gaps for backend roles are Spring Boot (45/80) and Docker (25/65).\n\nHere's your 12-week roadmap:\n• Weeks 1-4: Spring Boot & REST APIs\n• Weeks 5-8: Docker & containerization\n• Weeks 9-12: AWS basics & CI/CD\n\nI also found 3 backend internships that match your current profile at 74-87% compatibility. Want me to show them?" },
    { role: 'user', content: "Yes! Show me the internships." },
  ]

  return (
    <section className="py-24 px-4" style={{ background: 'var(--surface-inset)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Chat UI */}
            <motion.div variants={fadeUp}>
              <div className="p-5 rounded-2xl border shadow-lg"
                   style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-2 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>AI Career Copilot</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by your verified profile data</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'hsl(148, 60%, 96%)', color: 'hsl(148, 60%, 38%)' }}>
                      ● Active
                    </span>
                  </div>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'ai' && (
                        <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-tr-sm text-white'
                          : 'rounded-tl-sm'
                      }`}
                           style={msg.role === 'user'
                             ? { background: 'var(--color-brand-500)' }
                             : { background: 'var(--surface-inset)', color: 'var(--text-primary)' }}>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input type="text" placeholder="Ask about your career..."
                         className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-400"
                         style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }} />
                  <button className="px-4 py-2.5 rounded-xl text-white text-sm font-medium gradient-brand">
                    Send
                  </button>
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
                  AI-assisted guidance • Not a final decision-maker
                </p>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div variants={fadeUp} custom={2}>
              <SectionLabel>AI Career Copilot</SectionLabel>
              <h2 className="text-4xl font-bold font-display mb-5" style={{ color: 'var(--text-primary)' }}>
                Your personal career intelligence companion
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                The AI Career Copilot understands your unique profile — skills, goals, experience, and gaps — to provide genuinely useful, personalized guidance. It uses only your authorized data and always explains its reasoning.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Career Guidance', desc: 'Personalized advice based on your verified skills and career goals' },
                  { title: 'Resume Analysis', desc: 'Detailed feedback on your resume with specific improvement suggestions' },
                  { title: 'Interview Coach', desc: 'Role-specific practice with adaptive questions and detailed feedback' },
                  { title: 'Learning Roadmap', desc: 'Custom week-by-week plans to close skill gaps for target roles' },
                  { title: 'Opportunity Matching', desc: 'Explained match scores showing exactly why an opportunity fits you' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--color-brand-500)' }} />
                    <div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{title}: </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Trust & Verification Section ───────────────────────────────
function TrustSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>Trust & Security</SectionLabel>
            <h2 className="text-4xl font-bold font-display text-center mb-4" style={{ color: 'var(--text-primary)' }}>
              Built on a foundation of trust
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: 'var(--text-secondary)' }}>
              Every interaction on CareerSetu is backed by verified identities, transparent AI, privacy controls, and auditable workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Employers',
                desc: 'All companies undergo domain verification and business review before posting opportunities.',
                badge: 'Platform Verified',
              },
              {
                icon: Brain,
                title: 'Explainable AI',
                desc: 'Every AI recommendation comes with a clear explanation. AI assists humans — it does not decide.',
                badge: 'AI-Assisted',
              },
              {
                icon: Globe,
                title: 'Privacy-First',
                desc: 'You control who sees your profile. Granular consent management aligned with DPDP Act 2023.',
                badge: 'Privacy Controls',
              },
              {
                icon: FileText,
                title: 'Auditable Records',
                desc: 'Every decision — shortlist, rejection, policy enforcement — is logged and auditable.',
                badge: 'Full Audit Trail',
              },
            ].map(({ icon: Icon, title, desc, badge }, i) => (
              <motion.div key={title} variants={fadeUp} custom={i}
                         className="p-6 rounded-2xl border text-center"
                         style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                     style={{ background: 'var(--color-brand-50)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--color-brand-500)' }} />
                </div>
                <h3 className="font-semibold font-display mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                <span className="text-xs font-semibold px-3 py-1 rounded-full border"
                      style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', borderColor: 'var(--color-brand-200)' }}>
                  {badge}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Testimonials ───────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'B.Tech CSE, Pune',
      quote: 'CareerSetu showed me exactly why I was getting rejected — my resume had skills but no evidence. The AI roadmap helped me land a backend internship in 3 months.',
      avatar: 'PS',
      outcome: 'Secured Backend Internship',
    },
    {
      name: 'Rahul Nair',
      role: 'HR Manager, TechCorp',
      quote: 'The skill-verified candidates are a game changer. We spend 40% less time in initial screening and the match quality is significantly better than other platforms.',
      avatar: 'RN',
      outcome: 'Hired 12 verified interns',
    },
    {
      name: 'Dr. Meena Joshi',
      role: 'TPO, Engineering College',
      quote: 'Finally a platform that gives us real analytics. We can see exactly which skills our students lack and align with industry before placement season starts.',
      avatar: 'MJ',
      outcome: '85% placement rate',
    },
  ]

  return (
    <section className="py-24 px-4" style={{ background: 'var(--surface-inset)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel>Stories</SectionLabel>
            <h2 className="text-4xl font-bold font-display text-center mb-16" style={{ color: 'var(--text-primary)' }}>
              Making careers happen across India
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i}
                         className="p-6 rounded-2xl border"
                         style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4" style={{ color: 'var(--color-accent-400)', fill: 'var(--color-accent-400)' }} />
                  ))}
                </div>
                <p className="text-sm mb-5 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white gradient-brand">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ background: 'hsl(148, 60%, 96%)', color: 'hsl(148, 60%, 38%)' }}>
                      {t.outcome}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── CTA Section ────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.div variants={fadeUp}
                      className="relative p-12 rounded-3xl overflow-hidden text-white gradient-hero">
            {/* Overlay pattern */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                   backgroundSize: '30px 30px'
                 }} />
            <div className="relative z-10">
              <p className="text-sm font-semibold mb-3 opacity-80 uppercase tracking-wider">Start Your Journey</p>
              <h2 className="text-4xl font-bold font-display mb-5">
                Ready to bridge the gap between<br />campus and career?
              </h2>
              <p className="text-lg opacity-85 mb-8 max-w-2xl mx-auto">
                Join students, institutions, and employers across India who are building smarter career connections with verified skills and AI-powered intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/register?role=STUDENT"
                      className="px-7 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-gray-50 transition-colors shadow-lg"
                      style={{ color: 'var(--color-brand-600)' }}>
                  I'm a Student
                </Link>
                <Link to="/auth/register?role=EMPLOYER"
                      className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/30 bg-white/10 hover:bg-white/20 transition-colors">
                  I'm an Employer
                </Link>
                <Link to="/auth/register?role=TPO"
                      className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/30 bg-white/10 hover:bg-white/20 transition-colors">
                  I'm a TPO / Institution
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-16 px-4" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-card)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-0.5 border shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden"
                   style={{ borderColor: 'var(--border-light)' }}>
                <img src="/career-setu-logo.png" alt="CareerSetu Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Career<span style={{ color: 'var(--color-brand-500)' }}>Setu</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
                  Bridging Today to a Brighter Tomorrow
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Skills to Opportunities. Campus to Career.<br />
              India's first AI Career & Academia–Industry Collaboration OS.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Compliance-ready architecture. Formal legal/compliance review required before production deployment.
            </p>
          </div>

          {[
            {
              title: 'Platform',
              links: ['For Students', 'For Employers', 'For Institutions', 'For Faculty', 'AI Copilot', 'Skill Assessments'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Press', 'Partners', 'Contact'],
            },
            {
              title: 'Legal & Trust',
              links: ['Privacy Policy', 'Terms of Service', 'Data Rights', 'Grievance Redressal', 'Responsible AI', 'Accessibility', 'Security'],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors hover:text-brand-500"
                       style={{ color: 'var(--text-secondary)' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
             style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 CareerSetu. Made with ❤️ for India.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 rounded"
                  style={{ background: 'var(--surface-inset)', color: 'var(--text-muted)' }}>
              Security controls tested against defined threat model
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main Landing Page ──────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ background: 'var(--surface-base)' }}>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <JourneysSection />
        <SkillIntelligenceSection />
        <AICopilotSection />
        <TrustSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
