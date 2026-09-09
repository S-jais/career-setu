import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Zap, Search, BarChart3, Brain, GraduationCap,
  Briefcase, Building2, Users, Bell, Settings, LogOut, Menu, X,
  Target, Calendar, MessageSquare, Award, BookOpen, TrendingUp,
  Shield, Sparkles, Info, CheckCheck
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
  const { user, clearAuth, activeRoleView } = useAuthStore()
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
    <div className="flex h-screen overflow-hidden bg-[var(--mist)] text-[var(--slate)] font-sans antialiased selection:bg-[var(--marigold)] selection:text-[var(--ink)]">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[var(--ink)]/50 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-60 border-r border-[var(--line)] bg-[var(--paper)] transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
          <Link to="/" className="flex items-center gap-2.5 flex-1 min-w-0">
            <svg className="w-[24px] h-[24px] shrink-0" viewBox="0 0 26 26" fill="none">
              <path d="M2 19C6 12 9 9 13 9C17 9 20 12 24 19" stroke="#132A46" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="2" cy="19" r="2" fill="#1C7C72" />
              <circle cx="24" cy="19" r="2" fill="#E2963A" />
            </svg>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-medium text-[1.15rem] text-[var(--ink)] tracking-tight truncate leading-tight">
                CareerSetu
              </span>
              <span className="text-[10px] text-[var(--slate)] opacity-80 truncate">
                Skills to Opportunities
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-[var(--slate)] hover:text-[var(--ink)]"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info badge */}
        <div className="px-4 py-3 border-b border-[var(--line)] bg-[var(--mist-dim)]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[3px] bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center text-xs font-semibold shrink-0">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate text-[var(--ink)]">{user?.fullName || 'User'}</p>
              <p className="text-[10px] truncate text-[var(--slate)] uppercase font-medium">{user?.primaryRole || 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[var(--ink)] text-[var(--paper)]'
                    : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--mist-dim)]'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--marigold)]' : 'text-[var(--slate)]'}`}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-[2px] font-semibold border ${
                      active
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-[var(--mist-dim)] border-[var(--line)] text-[var(--ink)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-[var(--line)] p-2.5 space-y-0.5">
          <Link
            to="#"
            className="flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-xs text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--mist-dim)] transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-xs text-[#B93829] hover:bg-red-50 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-3 border-b border-[var(--line)] bg-[var(--paper)] shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-[3px] border border-[var(--line)] text-[var(--slate)] hover:text-[var(--ink)]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-display font-medium text-[1.05rem] text-[var(--ink)]">
              {navItems.find(n => isActive(n.href))?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* AI Assistant quick-access button */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle-ai-assistant'))
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-semibold border border-[var(--line)] bg-[var(--mist-dim)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
            title="Open AI Assistant"
          >
            <Brain className="w-3.5 h-3.5 text-[var(--teal)]" />
            <span>AI Assistant</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-[3px] border border-[var(--line)] text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--mist-dim)] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-[2px] text-[9px] font-bold text-white flex items-center justify-center bg-[var(--marigold-deep)]">
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
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] z-50 overflow-hidden shadow-md"
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[var(--line)] flex items-center justify-between bg-[var(--mist-dim)]/50">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-medium text-sm text-[var(--ink)]">Notifications</span>
                        {unread > 0 && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] bg-[var(--marigold)] text-[var(--ink)]">
                            {unread} new
                          </span>
                        )}
                      </div>
                      {unread > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-semibold text-[var(--marigold-deep)] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification list */}
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-[var(--line)]">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-xs text-[var(--slate)] opacity-70">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const getIcon = () => {
                            switch (notif.type) {
                              case 'APPLICATION':
                                return <Briefcase className="w-3.5 h-3.5 text-[var(--teal)]" />
                              case 'AI_INSIGHT':
                                return <Sparkles className="w-3.5 h-3.5 text-[var(--marigold)]" />
                              case 'OPPORTUNITY':
                                return <Target className="w-3.5 h-3.5 text-[var(--ink)]" />
                              case 'ASSESSMENT':
                                return <Award className="w-3.5 h-3.5 text-[var(--marigold-deep)]" />
                              default:
                                return <Info className="w-3.5 h-3.5 text-[var(--slate)]" />
                            }
                          }

                          return (
                            <div
                              key={notif.id}
                              className={`p-3 transition-colors flex items-start gap-3 relative cursor-pointer hover:bg-[var(--mist-dim)]/50 ${
                                !notif.read ? 'bg-[var(--mist-dim)]/30' : ''
                              }`}
                              onClick={() => {
                                markAsRead(notif.id)
                                if (notif.link) {
                                  navigate(notif.link)
                                  setNotifOpen(false)
                                }
                              }}
                            >
                              <div className="w-7 h-7 rounded-[3px] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--line)] bg-[var(--paper)]">
                                {getIcon()}
                              </div>
                              <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center gap-1.5">
                                  <h4 className={`text-xs truncate ${!notif.read ? 'font-bold text-[var(--ink)]' : 'font-medium text-[var(--slate)]'}`}>
                                    {notif.title}
                                  </h4>
                                  {!notif.read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--marigold-deep)] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-[var(--slate)] mt-0.5 line-clamp-2 leading-relaxed">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-[var(--slate)] opacity-70 mt-1 block">
                                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  dismissNotification(notif.id)
                                }}
                                className="text-[var(--slate)] opacity-50 hover:opacity-100 p-1 shrink-0 cursor-pointer"
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
                    <div className="p-2 border-t border-[var(--line)] text-center text-[10px] text-[var(--slate)] opacity-75 bg-[var(--mist-dim)]/40">
                      Real-time career intelligence alerts
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User menu & Admin Status */}
          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <Link
                to="/admin/overview"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[3px] text-[11px] font-bold bg-[var(--ink)] text-[var(--paper)] border border-[var(--line)]"
              >
                <Shield className="w-3 h-3 text-[var(--marigold)]" />
                <span>ADMIN</span>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[3px] bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center text-xs font-semibold shrink-0">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-[var(--ink)] truncate max-w-[130px]">
                  {user?.displayName || user?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-[var(--slate)] opacity-80 truncate max-w-[130px]">
                  {user?.email || ''}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-[3px] border border-transparent hover:border-[var(--line)] text-[var(--slate)] hover:text-[#B93829] transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[var(--mist)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
