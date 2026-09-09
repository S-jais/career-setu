import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GraduationCap, Briefcase, Building2, Sparkles } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[var(--mist)] text-[var(--slate)] font-sans antialiased selection:bg-[var(--marigold)] selection:text-[var(--ink)]">
      {/* Left — Brand panel (Solid --ink, Fraunces typography, per design system spec) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-14 relative bg-[var(--ink)] text-[var(--mist)] border-r border-[var(--line)]"
      >
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-14 group">
            <svg className="w-[30px] h-[30px] shrink-0" viewBox="0 0 26 26" fill="none">
              <path d="M2 19C6 12 9 9 13 9C17 9 20 12 24 19" stroke="#EFF2EE" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="2" cy="19" r="2" fill="#1C7C72" />
              <circle cx="24" cy="19" r="2" fill="#E2963A" />
            </svg>
            <span className="font-display font-medium text-2xl text-[var(--paper)] tracking-tight">
              CareerSetu
            </span>
          </Link>

          <div className="space-y-9">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--marigold)] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--marigold)]" />
                Academia–Industry Collaboration OS
              </div>
              <h1 className="text-[2.2rem] lg:text-[2.6rem] font-medium font-display leading-[1.12] mb-3" style={{ color: 'var(--paper)' }}>
                Skills to Opportunities.<br />Campus to <em className="italic font-normal text-[var(--marigold)]">career</em>.
              </h1>
              <p className="text-[#B9C4D4] text-[1.05rem] leading-[1.6] max-w-[42ch]">
                The verified platform connecting ambitious students, accredited institutions, and forward-looking hiring partners across India.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: GraduationCap, text: 'Verified Career Passport for every student' },
                { icon: Briefcase, text: 'Matched opportunities with explainable fit scores' },
                { icon: Building2, text: 'Structured internships with mentor guidance' },
                { icon: Sparkles, text: 'AI career intelligence with clear benchmark evidence' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5 text-[#DCE3EC]">
                  <div className="w-7 h-7 rounded-[3px] bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[var(--teal)]" />
                  </div>
                  <span className="text-[0.92rem] font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10">
          <p className="text-[#8FA0B8] text-xs leading-relaxed">
            Enterprise-grade data protection and verified credentials. Bridging campus curriculum directly with national industry standards.
          </p>
        </div>
      </motion.div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[var(--mist)]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 26 26" fill="none">
                <path d="M2 19C6 12 9 9 13 9C17 9 20 12 24 19" stroke="#132A46" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="2" cy="19" r="2" fill="#1C7C72" />
                <circle cx="24" cy="19" r="2" fill="#E2963A" />
              </svg>
              <span className="font-display font-medium text-xl text-[var(--ink)]">
                CareerSetu
              </span>
            </Link>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
