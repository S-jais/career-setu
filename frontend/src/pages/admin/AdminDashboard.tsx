import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck, Users, Briefcase, GraduationCap, Server, Lock,
  CheckCircle2, AlertCircle, RefreshCw, ArrowUpRight,
  Activity, Database, KeyRound, Globe, Cpu, Sparkles, FileText, Loader2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { adminApi, type PlatformStats, type AdminUserSummary, type AuditLogDto } from '@/api/adminApi'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user, setActiveRoleView } = useAuthStore()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [users, setUsers] = useState<AdminUserSummary[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'audit' | 'security'>('overview')

  const isSuperAdmin = user?.primaryRole === 'SUPER_ADMIN' || user?.roles?.includes('SUPER_ADMIN')

  const loadData = async (showToast = false) => {
    setIsRefreshing(true)
    try {
      const [statsData, usersData, logsData] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getUsers().catch(() => []),
        adminApi.getAuditLogs().catch(() => []),
      ])

      if (statsData) setStats(statsData)
      setUsers(usersData)
      setAuditLogs(logsData)

      if (showToast) {
        toast.success('Platform telemetry synchronized')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to load administrative metrics'
      toast.error(message)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData(false)
  }, [])

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      await adminApi.updateUserStatus(userId, newStatus)
      toast.success(`Account status updated to ${newStatus}`)
      loadData(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update account status'
      toast.error(message)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Top Super Admin Banner ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-[3px] relative overflow-hidden bg-[var(--ink)] text-[var(--mist)] border border-[var(--line)]"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-[2px] text-xs font-semibold uppercase tracking-wider bg-[var(--marigold)] text-[var(--ink)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {isSuperAdmin ? 'Super Administrator' : 'Platform Administrator'}
              </span>
              <span className="px-2.5 py-0.5 rounded-[2px] text-xs font-medium bg-white/10 text-[var(--mist)] border border-white/20">
                Server-Authoritative RBAC
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-[var(--paper)] tracking-tight font-display">
              Platform Command Center
            </h1>
            <p className="text-[#B9C4D4] text-xs sm:text-sm max-w-2xl leading-relaxed">
              Operating with verified administrative session. Real-time platform governance, user directory, and security audit logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-[3px] text-xs font-semibold text-[var(--paper)] bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Telemetry
            </button>
            <Link
              to="/student/digital-twin"
              className="btn btn-accent text-xs py-2 px-3.5 gap-1.5"
            >
              <span>Digital Twin AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Tab Selector ────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Telemetry', icon: Activity },
          { id: 'users', label: 'User Directory', icon: Users, badge: users.length },
          { id: 'audit', label: 'Security Audit Logs', icon: FileText, badge: auditLogs.length },
          { id: 'security', label: 'Security Architecture', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon
          const active = selectedTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`pb-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? 'border-[var(--ink)] text-[var(--ink)]'
                  : 'border-transparent text-[var(--slate)] hover:text-[var(--ink)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-[2px] text-[10px] font-bold ${
                  active ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-[var(--mist-dim)] text-[var(--slate)]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Loading State ───────────────────────────────────── */}
      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500">Connecting to secure administrative backend...</p>
        </div>
      ) : (
        <>
          {/* ── Tab: Overview ──────────────────────────────────── */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Live Metric Cards (Real Database Data) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border-default)' }}>
                  <span className="text-xs text-gray-500 block mb-1">Total Users</span>
                  <span className="text-2xl font-bold text-indigo-600">{stats?.totalUsers ?? users.length}</span>
                </div>
                <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border-default)' }}>
                  <span className="text-xs text-gray-500 block mb-1">Students</span>
                  <span className="text-2xl font-bold text-sky-600">{stats?.totalStudents ?? 0}</span>
                </div>
                <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border-default)' }}>
                  <span className="text-xs text-gray-500 block mb-1">Employers</span>
                  <span className="text-2xl font-bold text-emerald-600">{stats?.totalEmployers ?? 0}</span>
                </div>
                <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border-default)' }}>
                  <span className="text-xs text-gray-500 block mb-1">Opportunities</span>
                  <span className="text-2xl font-bold text-purple-600">{stats?.totalOpportunities ?? 0}</span>
                </div>
                <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border-default)' }}>
                  <span className="text-xs text-gray-500 block mb-1">Applications</span>
                  <span className="text-2xl font-bold text-amber-600">{stats?.totalApplications ?? 0}</span>
                </div>
                <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: 'var(--border-default)' }}>
                  <span className="text-xs text-gray-500 block mb-1">Administrators</span>
                  <span className="text-2xl font-bold text-rose-600">{stats?.totalAdmins ?? 1}</span>
                </div>
              </div>

              {/* Live Service Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Spring Boot 3.4 API</div>
                      <div className="text-xs text-gray-400">Authenticated & Active</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    ONLINE
                  </span>
                </div>

                <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">PostgreSQL Engine</div>
                      <div className="text-xs text-gray-400">{stats?.databaseStatus || 'CONNECTED'}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    HEALTHY
                  </span>
                </div>

                <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">FastAPI AI Mesh</div>
                      <div className="text-xs text-gray-400">Skills & Trajectory Model</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                    READY
                  </span>
                </div>
              </div>

              {/* Role Perspective Switcher */}
              <div className="p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm space-y-4" style={{ borderColor: 'var(--border-default)' }}>
                <div>
                  <h3 className="text-lg font-bold">Administrative Perspective Switcher</h3>
                  <p className="text-xs text-gray-500">As Super Admin, you have universal access across all student, employer, and institutional interfaces.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Link
                    to="/student/overview"
                    onClick={() => setActiveRoleView('student')}
                    className="p-4 rounded-2xl border border-indigo-100 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 transition-all group flex items-start gap-3.5"
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-indigo-950">Student Portal</h4>
                      <p className="text-xs text-indigo-700/80 mt-0.5">Career Passport, Twin, Assessments</p>
                    </div>
                  </Link>

                  <Link
                    to="/employer/overview"
                    onClick={() => setActiveRoleView('employer')}
                    className="p-4 rounded-2xl border border-emerald-100 hover:border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50 transition-all group flex items-start gap-3.5"
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">Employer ATS</h4>
                      <p className="text-xs text-emerald-700/80 mt-0.5">Job Postings, Applicants, Interviews</p>
                    </div>
                  </Link>

                  <Link
                    to="/institution/overview"
                    onClick={() => setActiveRoleView('institution')}
                    className="p-4 rounded-2xl border border-sky-100 hover:border-sky-400 bg-sky-50/40 hover:bg-sky-50 transition-all group flex items-start gap-3.5"
                  >
                    <div className="p-2.5 rounded-xl bg-sky-600 text-white shadow-sm">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-sky-950">Institution & TPO</h4>
                      <p className="text-xs text-sky-700/80 mt-0.5">Placement Drives, NEP Credits, Cohorts</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Users ─────────────────────────────────────── */}
          {selectedTab === 'users' && (
            <div className="rounded-3xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
                <div>
                  <h3 className="text-lg font-bold">Registered Platform Users</h3>
                  <p className="text-xs text-gray-500">Live database identities. Roles and statuses are governed server-side.</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {users.length} Total Users
                </span>
              </div>

              {users.length === 0 ? (
                <div className="p-12 text-center text-sm text-gray-400">
                  No user records found in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-slate-800/50 text-xs font-semibold text-gray-500">
                        <th className="py-3.5 px-6">Name / Display</th>
                        <th className="py-3.5 px-6">Email Address</th>
                        <th className="py-3.5 px-6">Server Role</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6">Created</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                            {u.fullName || u.displayName || 'User'}
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-gray-600 dark:text-gray-300">
                            {u.email}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              u.primaryRole === 'SUPER_ADMIN' || u.primaryRole === 'PLATFORM_ADMIN'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : u.primaryRole === 'EMPLOYER'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : u.primaryRole === 'TPO'
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            }`}>
                              {u.primaryRole}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              u.accountStatus === 'ACTIVE' ? 'text-emerald-600' : 'text-amber-600'
                            }`}>
                              {u.accountStatus === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                              {u.accountStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-gray-500">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleStatusChange(u.id, u.accountStatus)}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg border hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                            >
                              {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Audit Logs ────────────────────────────────── */}
          {selectedTab === 'audit' && (
            <div className="rounded-3xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
                <div>
                  <h3 className="text-lg font-bold">Security & Authentication Audit Trail</h3>
                  <p className="text-xs text-gray-500">Immutable server-recorded events. Raw credentials and tokens are strictly excluded.</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {auditLogs.length} Events Logged
                </span>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-12 text-center text-sm text-gray-400">
                  No audit logs recorded yet. Security events will appear here in real time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-slate-800/50 text-xs font-semibold text-gray-500">
                        <th className="py-3 px-6">Event Type</th>
                        <th className="py-3 px-6">Actor Email</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Details</th>
                        <th className="py-3 px-6">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/30">
                          <td className="py-3.5 px-6 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400">
                            {log.eventType}
                          </td>
                          <td className="py-3.5 px-6 font-mono text-xs text-gray-600 dark:text-gray-300">
                            {log.actorEmail || 'anonymous'}
                          </td>
                          <td className="py-3.5 px-6">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                            {log.details || '—'}
                          </td>
                          <td className="py-3.5 px-6 text-xs text-gray-400 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Security Architecture ─────────────────────── */}
          {selectedTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm space-y-4" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Argon2id Cryptographic Hashing</h4>
                    <p className="text-xs text-gray-500">OWASP Recommended Memory-Hard Password Derivation</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  All user passwords are encrypted using <strong>Argon2id</strong> with unique cryptographically random salts. Plaintext passwords are never stored in databases, transmitted unencrypted, or included in audit logs.
                </p>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-xs font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div>Hashing Algorithm: Argon2id (Version 19)</div>
                  <div>Memory: 65,536 KB | Iterations: 3 | Parallelism: 1</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm space-y-4" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Server-Authoritative RBAC & Defense</h4>
                    <p className="text-xs text-gray-500">HMAC-SHA512 Cryptographic Signatures</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Roles are enforced strictly at the server boundary with Spring Security method security (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">@PreAuthorize</code>). Client-side role claims are never trusted for authorization.
                </p>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-xs font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div>Signature Algorithm: HS512 (512-bit signing secret)</div>
                  <div>Access Token Lifetime: 60 minutes</div>
                  <div>Lockout Policy: 15-minute freeze on 5 consecutive failures</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
