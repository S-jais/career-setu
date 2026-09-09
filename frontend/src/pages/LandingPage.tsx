import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--ink)] font-sans antialiased selection:bg-[var(--marigold)] selection:text-[var(--ink)]">
      {/* ─── Header / Nav ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#EFF2EE]/86 backdrop-blur-md border-b border-[var(--line)] transition-all">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 h-[76px] flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-medium text-[1.28rem] text-[var(--ink)] tracking-tight">
            <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 26 26" fill="none">
              <path d="M2 19C6 12 9 9 13 9C17 9 20 12 24 19" stroke="#132A46" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="2" cy="19" r="2" fill="#1C7C72" />
              <circle cx="24" cy="19" r="2" fill="#E2963A" />
            </svg>
            <span>CareerSetu</span>
          </Link>

          {/* Desktop Navlinks */}
          <nav className="hidden md:flex items-center gap-9 text-[0.94rem] text-[var(--slate)]">
            <a href="#students" className="relative py-1.5 hover:text-[var(--ink)] transition-colors group">
              For Students
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[var(--marigold-deep)] transition-all duration-250 group-hover:w-full" />
            </a>
            <a href="#institutions" className="relative py-1.5 hover:text-[var(--ink)] transition-colors group">
              For Institutions
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[var(--marigold-deep)] transition-all duration-250 group-hover:w-full" />
            </a>
            <a href="#industry" className="relative py-1.5 hover:text-[var(--ink)] transition-colors group">
              For Industry
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[var(--marigold-deep)] transition-all duration-250 group-hover:w-full" />
            </a>
            <a href="#how" className="relative py-1.5 hover:text-[var(--ink)] transition-colors group">
              How it works
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[var(--marigold-deep)] transition-all duration-250 group-hover:w-full" />
            </a>
          </nav>

          {/* Nav CTA */}
          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn btn-primary text-[0.92rem] font-semibold gap-1.5"
              >
                <span>Dashboard ({user?.fullName ? user.fullName.split(' ')[0] : 'Portal'})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="text-[0.92rem] text-[var(--slate)] hover:text-[var(--ink)] transition-colors font-medium">
                  Sign in
                </Link>
                <Link to="/auth/register" className="btn btn-primary text-[0.92rem]">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-[var(--ink)] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--line)] bg-[var(--paper)] px-5 py-4 space-y-3">
            <a
              href="#students"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[0.95rem] text-[var(--slate)] font-medium py-1.5"
            >
              For Students
            </a>
            <a
              href="#institutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[0.95rem] text-[var(--slate)] font-medium py-1.5"
            >
              For Institutions
            </a>
            <a
              href="#industry"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[0.95rem] text-[var(--slate)] font-medium py-1.5"
            >
              For Industry
            </a>
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[0.95rem] text-[var(--slate)] font-medium py-1.5"
            >
              How it works
            </a>
            <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2.5">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary text-center w-full"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-ghost text-center w-full"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary text-center w-full"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-[72px] sm:pt-[88px] pb-10 overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">
          <div>
            <div className="flex items-center gap-2.5 text-[0.86rem] text-[var(--teal)] font-semibold mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />
              <span>India&apos;s first AI Career &amp; Academia–Industry Collaboration OS</span>
            </div>

            <h1 className="font-display font-medium text-[2.5rem] sm:text-[3.2rem] lg:text-[3.6rem] leading-[1.08] text-[var(--ink)] tracking-tight">
              Skills to opportunities.<br />
              Campus to <em className="italic font-normal text-[var(--marigold-deep)]">career</em>.
            </h1>

            <p className="mt-6 text-[1.12rem] leading-[1.6] text-[var(--slate)] max-w-[46ch]">
              CareerSetu is the bridge between what students learn and what industry needs — verified skills, AI-matched opportunities, and structured internships, in one place.
            </p>

            <div className="flex flex-wrap gap-3.5 mt-8 sm:mt-9">
              <Link to="/auth/register?role=student" className="btn btn-primary">
                Build my profile
              </Link>
              <Link to="/auth/register?role=institution" className="btn btn-ghost">
                Partner as an institution
              </Link>
            </div>

            <p className="mt-5 text-[0.86rem] text-[var(--slate)] opacity-85">
              Free for students. No spreadsheets, no cold applications.
            </p>
          </div>

          {/* Bridge SVG Illustration */}
          <div className="relative w-full aspect-[5/4]" aria-hidden="true">
            <svg viewBox="0 0 480 380" fill="none" className="w-full h-full">
              {/* Shore Labels */}
              <text x="34" y="46" className="font-display font-medium text-[0.95rem]" fill="#2C4363">
                Campus
              </text>
              <text x="358" y="46" className="font-display font-medium text-[0.95rem]" fill="#2C4363">
                Industry
              </text>

              {/* Towers */}
              <rect x="70" y="70" width="10" height="180" fill="#132A46" />
              <rect x="400" y="70" width="10" height="180" fill="#132A46" />

              {/* Animated Deck Path */}
              <path
                className="path-draw"
                d="M20 250 Q 240 150 460 250"
                stroke="#E2963A"
                strokeWidth="4"
                fill="none"
                style={{
                  strokeDasharray: 900,
                  strokeDashoffset: 0,
                  animation: 'draw 1.8s cubic-bezier(.4,0,.2,1) 0.3s forwards',
                }}
              />

              {/* Suspension Cables */}
              <g stroke="#8FA0B8" strokeWidth="1.4">
                <path d="M75 75 L 110 240" />
                <path d="M75 75 L 160 232" />
                <path d="M75 75 L 210 222" />
                <path d="M405 75 L 370 240" />
                <path d="M405 75 L 320 232" />
                <path d="M405 75 L 270 222" />
              </g>

              {/* Deck line */}
              <path d="M20 252 Q 240 152 460 252" stroke="#132A46" strokeWidth="3" fill="none" opacity="0.5" />

              {/* Travelling dot: student journey */}
              <circle
                cx="240"
                cy="150"
                r="6"
                fill="#1C7C72"
                style={{ animation: 'ai-orb-glow 2.5s ease-in-out infinite' }}
              />

              {/* Ground level lines */}
              <line x1="0" y1="252" x2="70" y2="252" stroke="#132A46" strokeWidth="2" />
              <line x1="410" y1="252" x2="480" y2="252" stroke="#132A46" strokeWidth="2" />

              {/* Water Texture */}
              <path d="M0 300 Q 120 288 240 300 T 480 300" stroke="#C7D0C6" strokeWidth="1.4" fill="none" />
              <path d="M0 320 Q 120 308 240 320 T 480 320" stroke="#C7D0C6" strokeWidth="1.4" fill="none" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ─────────────────────────────────────────── */}
      <div className="border-t border-b border-[var(--line)] py-7">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-6 sm:gap-9">
          <span className="text-[0.82rem] text-[var(--slate)] font-medium">
            Piloting with institutions and hiring partners across India
          </span>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-display text-[1.05rem] text-[var(--ink-soft)] opacity-60">
            <span>IIT Alumni Network</span>
            <span>NSDC</span>
            <span>State Skill Missions</span>
            <span>500+ Colleges</span>
          </div>
        </div>
      </div>

      {/* ─── Stats Grid (Hairline Dividers, Flat) ─────────────────── */}
      <section className="pt-16 pb-6">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[var(--line)]">
            <div className="py-8 pr-6 border-r border-b md:border-b-0 border-[var(--line)]">
              <div className="font-display font-medium text-[2.2rem] sm:text-[2.4rem] text-[var(--ink)] leading-none">
                2.4L+
              </div>
              <div className="text-[0.9rem] text-[var(--slate)] mt-2">
                Verified student profiles
              </div>
            </div>
            <div className="py-8 px-4 sm:px-6 border-b md:border-b-0 md:border-r border-[var(--line)]">
              <div className="font-display font-medium text-[2.2rem] sm:text-[2.4rem] text-[var(--ink)] leading-none">
                1,800+
              </div>
              <div className="text-[0.9rem] text-[var(--slate)] mt-2">
                Hiring &amp; internship partners
              </div>
            </div>
            <div className="py-8 pr-6 sm:px-6 border-r border-[var(--line)]">
              <div className="font-display font-medium text-[2.2rem] sm:text-[2.4rem] text-[var(--ink)] leading-none">
                92%
              </div>
              <div className="text-[0.9rem] text-[var(--slate)] mt-2">
                Skill-to-role match accuracy
              </div>
            </div>
            <div className="py-8 pl-4 sm:pl-6">
              <div className="font-display font-medium text-[2.2rem] sm:text-[2.4rem] text-[var(--ink)] leading-none">
                18 days
              </div>
              <div className="text-[0.9rem] text-[var(--slate)] mt-2">
                Avg. time to first offer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works (Sequential 01/02/03) ───────────────────── */}
      <section className="py-20 sm:py-24" id="how">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="max-w-[640px] mb-14 sm:mb-16">
            <div className="text-[0.9rem] font-semibold text-[var(--marigold-deep)] mb-3.5">
              How it works
            </div>
            <h2 className="font-display text-[1.9rem] sm:text-[2.4rem] lg:text-[2.6rem] text-[var(--ink)] font-medium leading-[1.1]">
              Three steps across the bridge
            </h2>
            <p className="mt-4 text-[1.06rem] text-[var(--slate)] leading-[1.6]">
              From a verified skill profile to a structured internship — CareerSetu handles the matching, the paperwork, and the follow-through.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--line)]">
            <div className="py-9 md:pr-8 border-b md:border-b-0 md:border-r border-[var(--line)]">
              <div className="font-display font-medium text-[0.95rem] text-[var(--marigold-deep)] mb-5">
                01
              </div>
              <h3 className="font-display font-medium text-[1.32rem] text-[var(--ink)] mb-3">
                Verify your skills
              </h3>
              <p className="text-[0.98rem] text-[var(--slate)] leading-[1.6]">
                Take assessments mapped to real industry benchmarks. Institutions and mentors validate your work, not just your grades.
              </p>
            </div>

            <div className="py-9 md:px-8 border-b md:border-b-0 md:border-r border-[var(--line)]">
              <div className="font-display font-medium text-[0.95rem] text-[var(--marigold-deep)] mb-5">
                02
              </div>
              <h3 className="font-display font-medium text-[1.32rem] text-[var(--ink)] mb-3">
                Get matched by AI
              </h3>
              <p className="text-[0.98rem] text-[var(--slate)] leading-[1.6]">
                Our matching engine reads your verified profile against live openings — ranked by fit, not by who applied first.
              </p>
            </div>

            <div className="py-9 md:pl-8">
              <div className="font-display font-medium text-[0.95rem] text-[var(--marigold-deep)] mb-5">
                03
              </div>
              <h3 className="font-display font-medium text-[1.32rem] text-[var(--ink)] mb-3">
                Start a structured internship
              </h3>
              <p className="text-[0.98rem] text-[var(--slate)] leading-[1.6]">
                Every placement comes with defined outcomes, mentor check-ins, and a credential you can show the next employer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tracks (3 Audiences — 3px Top Border Accents) ───────── */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="max-w-[640px] mb-12 sm:mb-14">
            <div className="text-[0.9rem] font-semibold text-[var(--marigold-deep)] mb-3.5">
              Built for three sides of one bridge
            </div>
            <h2 className="font-display text-[1.9rem] sm:text-[2.4rem] lg:text-[2.6rem] text-[var(--ink)] font-medium leading-[1.1]">
              Whoever you are, there&apos;s a lane for you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Track */}
            <div id="students" className="bg-[var(--paper)] border border-[var(--line)] border-t-[3px] border-t-[var(--teal)] p-8 sm:p-9 flex flex-col h-full rounded-[3px]">
              <svg className="w-[38px] h-[38px] mb-6" viewBox="0 0 38 38" fill="none">
                <path d="M4 15L19 8l15 7-15 7-15-7z" stroke="#1C7C72" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M11 19v7c0 2 4 4 8 4s8-2 8-4v-7" stroke="#1C7C72" strokeWidth="1.8" />
              </svg>
              <h3 className="font-display font-medium text-[1.3rem] text-[var(--ink)] mb-3">
                Students
              </h3>
              <p className="text-[0.97rem] text-[var(--slate)] leading-[1.6] grow">
                Turn coursework and side projects into a verified skill profile employers actually trust — then get matched to internships worth doing.
              </p>
              <Link
                to="/auth/register?role=student"
                className="mt-6 text-[0.9rem] font-semibold text-[var(--ink)] inline-flex items-center gap-2 border-b-[1.5px] border-[var(--marigold)] pb-0.5 w-fit hover:text-[var(--marigold-deep)] transition-colors"
              >
                Build your profile
              </Link>
            </div>

            {/* Institution Track */}
            <div id="institutions" className="bg-[var(--paper)] border border-[var(--line)] border-t-[3px] border-t-[var(--marigold)] p-8 sm:p-9 flex flex-col h-full rounded-[3px]">
              <svg className="w-[38px] h-[38px] mb-6" viewBox="0 0 38 38" fill="none">
                <rect x="6" y="14" width="26" height="18" stroke="#E2963A" strokeWidth="1.8" />
                <path d="M19 5L34 14H4L19 5z" stroke="#E2963A" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              <h3 className="font-display font-medium text-[1.3rem] text-[var(--ink)] mb-3">
                Institutions
              </h3>
              <p className="text-[0.97rem] text-[var(--slate)] leading-[1.6] grow">
                Track placement outcomes in real time, close the loop with industry on curriculum gaps, and give every student a fair shot at visibility.
              </p>
              <Link
                to="/auth/register?role=institution"
                className="mt-6 text-[0.9rem] font-semibold text-[var(--ink)] inline-flex items-center gap-2 border-b-[1.5px] border-[var(--marigold)] pb-0.5 w-fit hover:text-[var(--marigold-deep)] transition-colors"
              >
                See the dashboard
              </Link>
            </div>

            {/* Industry Track */}
            <div id="industry" className="bg-[var(--paper)] border border-[var(--line)] border-t-[3px] border-t-[var(--ink)] p-8 sm:p-9 flex flex-col h-full rounded-[3px]">
              <svg className="w-[38px] h-[38px] mb-6" viewBox="0 0 38 38" fill="none">
                <rect x="8" y="12" width="22" height="18" rx="1" stroke="#132A46" strokeWidth="1.8" />
                <path d="M14 12V9a5 5 0 0110 0v3" stroke="#132A46" strokeWidth="1.8" />
              </svg>
              <h3 className="font-display font-medium text-[1.3rem] text-[var(--ink)] mb-3">
                Industry
              </h3>
              <p className="text-[0.97rem] text-[var(--slate)] leading-[1.6] grow">
                Hire from a pool that&apos;s already been verified against the skills your roles actually need — and shape the pipeline earlier, not later.
              </p>
              <Link
                to="/auth/register?role=employer"
                className="mt-6 text-[0.9rem] font-semibold text-[var(--ink)] inline-flex items-center gap-2 border-b-[1.5px] border-[var(--marigold)] pb-0.5 w-fit hover:text-[var(--marigold-deep)] transition-colors"
              >
                Post an opening
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Verified Skills Feature (The One Dark Panel) ────────── */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="bg-[var(--ink)] text-[var(--mist)] rounded-[4px] p-8 sm:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <h2 className="font-display text-[1.7rem] sm:text-[2.2rem] font-medium leading-[1.15]" style={{ color: 'var(--paper)' }}>
                Skills, verified — not just claimed
              </h2>
              <p className="text-[#B9C4D4] mt-4 leading-[1.65] text-[1.02rem] max-w-[44ch]">
                A resume line says &quot;proficient in SQL.&quot; CareerSetu shows the assessment, the score, and who reviewed it.
              </p>
              <ul className="mt-7 space-y-3.5">
                <li className="flex items-start gap-3 text-[0.96rem] text-[#DCE3EC]">
                  <svg className="w-[18px] h-[18px] shrink-0 mt-0.5" viewBox="0 0 18 18">
                    <path d="M3 9l4 4 8-9" stroke="#E2963A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Industry-benchmarked assessments, not generic quizzes</span>
                </li>
                <li className="flex items-start gap-3 text-[0.96rem] text-[#DCE3EC]">
                  <svg className="w-[18px] h-[18px] shrink-0 mt-0.5" viewBox="0 0 18 18">
                    <path d="M3 9l4 4 8-9" stroke="#E2963A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Mentor and faculty sign-off on project work</span>
                </li>
                <li className="flex items-start gap-3 text-[0.96rem] text-[#DCE3EC]">
                  <svg className="w-[18px] h-[18px] shrink-0 mt-0.5" viewBox="0 0 18 18">
                    <path d="M3 9l4 4 8-9" stroke="#E2963A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>One shareable credential, recognised by every partner employer</span>
                </li>
              </ul>
            </div>

            {/* Badge Card */}
            <div className="bg-[#1E3557] border border-white/10 p-6 sm:p-7 rounded-[3px]">
              <div className="flex justify-between items-center py-3.5 border-b border-white/10">
                <span className="text-[0.95rem] text-[#EDF1F6]">Data Structures &amp; Algorithms</span>
                <span className="font-display font-medium text-[var(--marigold)] text-[1.1rem]">A</span>
              </div>
              <div className="flex justify-between items-center py-3.5 border-b border-white/10">
                <span className="text-[0.95rem] text-[#EDF1F6]">Applied SQL</span>
                <span className="font-display font-medium text-[var(--marigold)] text-[1.1rem]">A−</span>
              </div>
              <div className="flex justify-between items-center py-3.5 border-b border-white/10">
                <span className="text-[0.95rem] text-[#EDF1F6]">Product Thinking (project)</span>
                <span className="font-display font-medium text-[var(--marigold)] text-[1.1rem]">Verified</span>
              </div>
              <div className="flex justify-between items-center py-3.5">
                <span className="text-[0.95rem] text-[#EDF1F6]">Communication &amp; Collaboration</span>
                <span className="font-display font-medium text-[var(--marigold)] text-[1.1rem]">B+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quote Section ───────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 text-left">
          <div className="font-display text-[4rem] text-[var(--marigold)] leading-none mb-2">
            &ldquo;
          </div>
          <blockquote className="font-display text-[1.5rem] sm:text-[2.05rem] text-[var(--ink)] font-normal leading-[1.4] max-w-[840px]">
            We stopped screening resumes for keywords. CareerSetu shows us who can actually do the work — that changed how fast we hire.
          </blockquote>
          <div className="mt-6 text-[0.95rem] text-[var(--slate)]">
            <b className="text-[var(--ink)] font-semibold">Head of Campus Hiring</b> — mid-size product company, Bengaluru
          </div>
        </div>
      </section>

      {/* ─── CTA Band ────────────────────────────────────────────── */}
      <div className="bg-[var(--mist-dim)] py-20 border-t border-[var(--line)]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-8">
          <h2 className="font-display text-[1.7rem] sm:text-[2.3rem] text-[var(--ink)] font-medium max-w-[540px] leading-[1.15]">
            The bridge is open. Cross it.
          </h2>
          <div className="flex flex-wrap gap-3.5">
            <Link to="/auth/register?role=student" className="btn btn-primary">
              Get started as a student
            </Link>
            <Link to="/auth/register?role=employer" className="btn btn-ghost">
              Talk to us about hiring
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="pt-16 pb-10 border-t border-[var(--line)]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12">
            <div>
              <div className="flex items-center gap-2.5 font-display font-medium text-[1.28rem] text-[var(--ink)] tracking-tight">
                <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 26 26" fill="none">
                  <path d="M2 19C6 12 9 9 13 9C17 9 20 12 24 19" stroke="#132A46" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="2" cy="19" r="2" fill="#1C7C72" />
                  <circle cx="24" cy="19" r="2" fill="#E2963A" />
                </svg>
                <span>CareerSetu</span>
              </div>
              <p className="text-[0.92rem] text-[var(--slate)] mt-3.5 max-w-[32ch] leading-[1.55]">
                India&apos;s AI Career &amp; Academia–Industry Collaboration OS — verified skills, matched opportunities, structured internships.
              </p>
            </div>

            <div>
              <h4 className="text-[0.86rem] text-[var(--ink)] font-semibold mb-4 tracking-normal">
                Product
              </h4>
              <div className="space-y-2.5 text-[0.9rem] text-[var(--slate)]">
                <div><a href="#students" className="hover:text-[var(--ink)] transition-colors">For students</a></div>
                <div><a href="#institutions" className="hover:text-[var(--ink)] transition-colors">For institutions</a></div>
                <div><a href="#industry" className="hover:text-[var(--ink)] transition-colors">For industry</a></div>
                <div><a href="#how" className="hover:text-[var(--ink)] transition-colors">Verified skills</a></div>
              </div>
            </div>

            <div>
              <h4 className="text-[0.86rem] text-[var(--ink)] font-semibold mb-4 tracking-normal">
                Company
              </h4>
              <div className="space-y-2.5 text-[0.9rem] text-[var(--slate)]">
                <div><a href="#how" className="hover:text-[var(--ink)] transition-colors">About</a></div>
                <div><a href="#industry" className="hover:text-[var(--ink)] transition-colors">Careers</a></div>
                <div><a href="#students" className="hover:text-[var(--ink)] transition-colors">Press</a></div>
              </div>
            </div>

            <div>
              <h4 className="text-[0.86rem] text-[var(--ink)] font-semibold mb-4 tracking-normal">
                Resources
              </h4>
              <div className="space-y-2.5 text-[0.9rem] text-[var(--slate)]">
                <div><a href="#how" className="hover:text-[var(--ink)] transition-colors">Help centre</a></div>
                <div><a href="#institutions" className="hover:text-[var(--ink)] transition-colors">Partner guidelines</a></div>
                <div><a href="#industry" className="hover:text-[var(--ink)] transition-colors">Contact</a></div>
              </div>
            </div>
          </div>

          <div className="pt-7 border-t border-[var(--line)] flex flex-wrap justify-between items-center gap-3.5 text-[0.84rem] text-[var(--slate)]">
            <span>© 2026 CareerSetu. All rights reserved.</span>
            <span>Made for the campus-to-career journey.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
