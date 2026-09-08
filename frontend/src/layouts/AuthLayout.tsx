import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GraduationCap, Briefcase, Building2, Sparkles } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface-base)' }}>
      {/* Left — Brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, hsl(224, 75%, 52%), hsl(262, 72%, 48%))' }}>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-14 group">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/career-setu-logo.png" alt="CareerSetu Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl font-display text-white tracking-tight leading-tight">CareerSetu</span>
              <span className="text-[10px] text-white/80 font-semibold tracking-wider uppercase">Bridging Today to a Brighter Tomorrow</span>
            </div>
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold font-display text-white leading-snug mb-3">
                Skills to Opportunities.<br />Campus to Career.
              </h1>
              <p className="text-white/75 text-lg">
                India's first AI Career & Academia–Industry Collaboration OS.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: GraduationCap, text: 'Verified Career Passport for every student' },
                { icon: Briefcase, text: 'Matched opportunities with explainable AI scores' },
                { icon: Building2, text: 'Structured internships with mentor guidance' },
                { icon: Sparkles, text: 'AI career intelligence that you can understand' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-white/85">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-xs">
            Security controls tested against defined threat model.
            Compliance-ready architecture. Formal review required for production.
          </p>
        </div>
      </motion.div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 p-0.5 border shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden"
                 style={{ borderColor: 'var(--border-light)' }}>
              <img src="/career-setu-logo.png" alt="CareerSetu Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
                Career<span style={{ color: 'var(--color-brand-500)' }}>Setu</span>
              </span>
              <span className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>
                Skills to Opportunities
              </span>
            </div>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
