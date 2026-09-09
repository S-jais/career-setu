import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Zap, Search, BarChart3, Brain, GraduationCap,
  Briefcase, Building2, Users, Bell, Settings, LogOut, Menu, X, ChevronRight,
  Target, Calendar, MessageSquare, Award, BookOpen, Layers, TrendingUp,
  Shield, Star, ChevronDown, Sparkles, Info, CheckCheck
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import toast from 'react-hot-toast'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string | number
}

const navConfig: Record<string, NavItem[]> = {
  student: [
    { label: 'Overview', href: '/student/overview', icon: LayoutDashboard },
    { label: 'Career Passport', href: '/student/passport', icon: FileText },
    { label: 'Digital Twin', href: '/student/digital-twin', icon: Sparkles, badge: 'NEW' },
    { label: 'Skill Intelligence', href: '/student/skills', icon: Zap },
    { label: 'Opportunities', href: '/student/opportunities', icon: Search },
    { label: 'Applications', href: '/student/applications', icon: BarChart3, badge: 3 },
    { label: 'Assessment', href: '/student/assessment', icon: Target },
    { label: 'AI Assistant', href: '/student/copilot', icon: Brain },
    { label: 'Learning', href: '/student/learning', icon: BookOpen },
    { label: 'Mentors', href: '/student/mentors', icon: Users },
    { label: 'Events', href: '/student/events', icon: Calendar },
    { label: 'Messages', href: '/student/messages', icon: MessageSquare, badge: 1 },
  ],
  employer: [
    { label: 'Overview', href: '/employer/overview', icon: LayoutDashboard },
    { label: 'Jobs', href: '/employer/jobs', icon: Briefcase },
    { label: 'Applicants', href: '/employer/applicants', icon: Users, badge: 12 },
    { label: 'Interviews', href: '/employer/interviews', icon: Calendar },
    { label: 'Analytics', href: '/employer/analytics', icon: BarChart3 },
    { label: 'Company Profile', href: '/employer/profile', icon: Building2 },
    { label: 'Messages', href: '/employer/messages', icon: MessageSquare, badge: 1 },
  ],
  institution: [
    { label: 'Overview', href: '/institution/overview', icon: LayoutDashboard },
    { label: 'Student Roster', href: '/institution/students', icon: GraduationCap },
    { label: 'Placement Drives', href: '/institution/drives', icon: TrendingUp },
  ],
  admin: [
    { label: 'Command Center', href: '/admin/overview', icon: Shield, badge: 'ADMIN' },
    { label: 'Student Directory', href: '/institution/students', icon: GraduationCap },
    { label: 'Opportunities & Jobs', href: '/employer/jobs', icon: Briefcase },
    { label: 'Applicant ATS', href: '/employer/applicants', icon: Users, badge: 12 },
    { label: 'Digital Twin AI', href: '/student/digital-twin', icon: Sparkles, badge: 'NEW' },
    { label: 'System Analytics', href: '/employer/analytics', icon: BarChart3 },
    { label: 'AI Copilot', href: '/student/copilot', icon: Brain },
  ],
}

export default function DashboardLayout({ role = 'student' }: { role?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearAuth, activeRoleView, setActiveRoleView } = useAuthStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotificationStore()
  const unread = unreadCount()

  const isAdmin = user?.primaryRole === 'PLATFORM_ADMIN' || user?.primaryRole === 'SUPER_ADMIN' || user?.roles?.includes('PLATFORM_ADMIN')
  const effectiveRole = isAdmin && activeRoleView ? activeRoleView : (isAdmin && role === 'student' && location.pathname.startsWith('/admin') ? 'admin' : role)
  const navItems = navConfig[effectiveRole] || navConfig[role] || navConfig.student

  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out successfully.')
    navigate('/')
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-base)' }}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-60 border-r transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <Link to="/" className="flex items-center gap-2.5 flex-1 group min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 p-0.5 border shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden"
                 style={{ borderColor: 'var(--border-light)' }}>
              <img src="/career-setu-mark.png" alt="CareerSetu Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base font-display leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                Career<span style={{ color: 'var(--color-brand-500)' }}>Setu</span>
              </span>
              <span className="text-[10px] font-medium tracking-tight truncate" style={{ color: 'var(--text-muted)' }}>
                Skills to Opportunities
              </span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.fullName}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.primaryRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link key={item.label} to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${active ? 'text-white' : ''}`}
                      style={active
                        ? { background: 'var(--color-brand-500)', color: 'white' }
                        : { color: 'var(--text-secondary)' }}
                      onClick={() => setSidebarOpen(false)}>
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : ''}`}
                              style={active ? {} : { color: 'var(--text-muted)' }} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${active ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="border-t p-3 space-y-0.5" style={{ borderColor: 'var(--border-light)' }}>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}>
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
                  style={{ color: 'var(--color-error)' }}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-3 border-b flex-shrink-0"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg"
                  style={{ color: 'var(--text-secondary)' }}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
              {navItems.find(n => isActive(n.href))?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* AI Assistant quick-access */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle-ai-assistant'))
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              border hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm mr-2"
            style={{
              background: 'var(--surface-inset)',
              borderColor: 'var(--border-light)',
              color: 'var(--color-brand-600)',
            }}
            title="Open AI Assistant"
          >
            <Brain className="w-3.5 h-3.5" />
            AI Assistant
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{ color: 'var(--text-secondary)' }}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-red-500 animate-pulse">
                  {unread}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-xl z-50 overflow-hidden"
                    style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                        {unread > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {unread} new
                          </span>
                        )}
                      </div>
                      {unread > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification list */}
                    <div className="max-h-[380px] overflow-y-auto divide-y" style={{ borderColor: 'var(--border-light)' }}>
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const getIcon = () => {
                            switch (notif.type) {
                              case 'APPLICATION':
                                return <Briefcase className="w-4 h-4 text-emerald-500" />
                              case 'AI_INSIGHT':
                                return <Sparkles className="w-4 h-4 text-amber-500" />
                              case 'OPPORTUNITY':
                                return <Target className="w-4 h-4 text-blue-500" />
                              case 'ASSESSMENT':
                                return <Award className="w-4 h-4 text-purple-500" />
                              default:
                                return <Info className="w-4 h-4 text-slate-500" />
                            }
                          }

                          return (
                            <div
                              key={notif.id}
                              className={`p-3.5 transition flex items-start gap-3 relative cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                              }`}
                              onClick={() => {
                                markAsRead(notif.id)
                                if (notif.link) {
                                  navigate(notif.link)
                                  setNotifOpen(false)
                                }
                              }}
                            >
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border" style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
                                {getIcon()}
                              </div>
                              <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center gap-1.5">
                                  <h4 className={`text-xs truncate ${!notif.read ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                                    {notif.title}
                                  </h4>
                                  {!notif.read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  dismissNotification(notif.id)
                                }}
                                className="text-slate-300 hover:text-slate-600 p-1 flex-shrink-0"
                                title="Dismiss"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 border-t text-center text-[11px] text-slate-400 bg-slate-50/50 dark:bg-slate-900/30" style={{ borderColor: 'var(--border-light)' }}>
                      Real-time career intelligence alerts
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User menu & Admin Status */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin/overview"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50 hover:bg-amber-200 transition-all shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>SUPER ADMIN</span>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {user?.displayName || user?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {user?.email || ''}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
