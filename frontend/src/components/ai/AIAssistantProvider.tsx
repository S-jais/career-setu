import { useState, useEffect, createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import AIAssistantOrb from './AIAssistantOrb'
import AIAssistantPanel from './AIAssistantPanel'

interface AIAssistantContextValue {
  isOpen: boolean
  open: (contextMessage?: string) => void
  close: () => void
  toggle: () => void
}

const AIAssistantContext = createContext<AIAssistantContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
})

export const useAIAssistant = () => useContext(AIAssistantContext)

export default function AIAssistantProvider() {
  const [isOpen, setIsOpen] = useState(false)
  const [contextMessage, setContextMessage] = useState<string | undefined>()
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  // Listen for toggle-ai-assistant custom event from header button
  useEffect(() => {
    const handler = () => setIsOpen(prev => !prev)
    window.addEventListener('toggle-ai-assistant', handler)
    return () => window.removeEventListener('toggle-ai-assistant', handler)
  }, [])

  // Only render when authenticated
  if (!isAuthenticated || !user) return null

  const open = (msg?: string) => {
    setContextMessage(msg)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setContextMessage(undefined)
  }

  const toggle = () => {
    if (isOpen) close()
    else open()
  }

  // Derive the current page name from route for display
  const routeLabels: Record<string, string> = {
    '/student/overview': 'Student Dashboard',
    '/student/passport': 'Career Passport',
    '/student/digital-twin': 'Career Digital Twin',
    '/student/skills': 'Skill Intelligence',
    '/student/opportunities': 'Opportunity Marketplace',
    '/student/applications': 'Application Tracker',
    '/student/assessment': 'Skill Assessment',
    '/student/copilot': 'AI Copilot',
    '/student/learning': 'Learning Roadmap',
    '/student/mentors': 'Mentorship Hub',
    '/student/events': 'Campus Events',
    '/student/messages': 'Message Center',
    '/employer/overview': 'Employer Dashboard',
    '/employer/jobs': 'Job Management',
    '/employer/applicants': 'Applicant ATS',
    '/employer/interviews': 'Interview Scheduler',
    '/employer/analytics': 'Employer Analytics',
    '/employer/profile': 'Company Profile',
    '/employer/messages': 'Messages',
    '/institution/overview': 'Institution Dashboard',
    '/institution/students': 'Student Roster',
    '/institution/drives': 'Placement Drives',
  }

  const currentRoute = location.pathname
  const currentPageName = routeLabels[currentRoute] || undefined

  return (
    <AIAssistantContext.Provider value={{ isOpen, open, close, toggle }}>
      <AIAssistantOrb
        isOpen={isOpen}
        onClick={toggle}
        isThinking={false}
      />
      <AIAssistantPanel
        isOpen={isOpen}
        onClose={close}
        userRole={user.primaryRole}
        userName={user.fullName?.split(' ')[0] || 'there'}
        currentRoute={currentRoute}
        currentPageName={currentPageName}
        initialContextMessage={contextMessage}
      />
    </AIAssistantContext.Provider>
  )
}
