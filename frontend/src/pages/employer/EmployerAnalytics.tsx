import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, Users, Award, Clock, ArrowUpRight,
  Filter, Calendar, Download, Sparkles, Building2, CheckCircle2
} from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

export default function EmployerAnalytics() {
  const [timeRange, setTimeRange] = useState('This Semester')

  const handleExportReport = () => {
    toast.success('Hiring analytics report (CSV & PDF) generated and downloaded.')
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Talent Intelligence
            </span>
            <span className="text-xs text-slate-400">• Real-Time Hiring Funnel Metrics</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Recruitment Analytics & Insights
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Deep analytics into candidate conversion funnels, skill match distributions, and hiring velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl border text-xs font-semibold outline-none"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            <option>Last 30 Days</option>
            <option>This Semester</option>
            <option>Annual Batch 2026</option>
          </select>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl text-xs font-bold border hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applicants', val: '48', trend: '+24%', desc: 'vs last month', col: 'text-blue-600' },
          { label: 'Shortlist Rate', val: '28.4%', trend: '+4.2%', desc: 'higher qualification', col: 'text-emerald-600' },
          { label: 'Avg Time to Offer', val: '8.5 Days', trend: '-3.1d', desc: 'accelerated cycle', col: 'text-purple-600' },
          { label: 'Offer Acceptance', val: '87.5%', trend: '+5.0%', desc: '7 of 8 offers', col: 'text-amber-600' }
        ].map((kpi) => (
          <div key={kpi.label} className="p-5 rounded-2xl border shadow-sm" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <span className="text-xs font-semibold text-slate-400">{kpi.label}</span>
            <div className="flex items-baseline justify-between mt-1">
              <p className={`text-2xl font-bold font-display ${kpi.col}`}>{kpi.val}</p>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{kpi.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Funnel Pipeline & Skill Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-light)' }}>
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Candidate Conversion Funnel
            </h3>
            <span className="text-xs text-slate-400">Total Pipeline: 48 Candidates</span>
          </div>

          <div className="space-y-3">
            {[
              { stage: '1. Applied (Career Passport)', count: 48, pct: 100, color: 'bg-blue-600' },
              { stage: '2. Profile Verified & Screened', count: 32, pct: 67, color: 'bg-indigo-600' },
              { stage: '3. Technical Sandbox Passed', count: 21, pct: 44, color: 'bg-purple-600' },
              { stage: '4. Live Interviews Scheduled', count: 12, pct: 25, color: 'bg-amber-600' },
              { stage: '5. Offers Extended', count: 7, pct: 15, color: 'bg-emerald-600' },
              { stage: '6. Offers Accepted & Joined', count: 5, pct: 10, color: 'bg-teal-600' },
            ].map((st) => (
              <div key={st.stage} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--text-primary)' }}>{st.stage}</span>
                  <span className="text-slate-500 font-mono">{st.count} ({st.pct}%)</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${st.color} transition-all duration-700`} style={{ width: `${st.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-blue-600 inline mr-1" />
            <strong>AI Funnel Intelligence:</strong> Candidates with verified cryptographic assessment badges showed an <strong>82% higher completion rate</strong> in technical interview rounds.
          </div>
        </div>

        {/* Top Feeder Institutions (1 Col) */}
        <div className="p-6 rounded-2xl border shadow-sm space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <h3 className="font-bold text-base pb-2 border-b" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}>
            Top Feeder Institutions
          </h3>

          <div className="space-y-3.5 text-xs">
            {[
              { name: 'PICT Pune', count: 18, avgCgpa: '8.82', verifiedPct: '94%' },
              { name: 'COEP Technological Univ', count: 12, avgCgpa: '8.76', verifiedPct: '91%' },
              { name: 'VJTI Mumbai', count: 9, avgCgpa: '8.65', verifiedPct: '89%' },
              { name: 'SPIT Mumbai', count: 6, avgCgpa: '8.54', verifiedPct: '86%' },
              { name: 'Pune University (CS)', count: 3, avgCgpa: '8.40', verifiedPct: '80%' }
            ].map((inst) => (
              <div key={inst.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border" style={{ borderColor: 'var(--border-light)' }}>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{inst.name}</p>
                  <p className="text-[10px] text-slate-400">Avg CGPA: {inst.avgCgpa} • {inst.verifiedPct} verified</p>
                </div>
                <span className="font-bold text-sm text-blue-600">{inst.count}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t text-[11px] text-slate-400" style={{ borderColor: 'var(--border-light)' }}>
            NEP 2020 14-credit internship verification active across all institutions.
          </div>
        </div>
      </div>
    </motion.div>
  )
}
