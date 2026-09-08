import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import StudentDashboard from '@/pages/student/StudentDashboard'
import CareerPassport from '@/pages/student/CareerPassport'
import SkillIntelligence from '@/pages/student/SkillIntelligence'
import OpportunityMarketplace from '@/pages/student/OpportunityMarketplace'
import ApplicationTracker from '@/pages/student/ApplicationTracker'
import EmployerDashboard from '@/pages/employer/EmployerDashboard'
import EmployerJobs from '@/pages/employer/EmployerJobs'
import ApplicantATS from '@/pages/employer/ApplicantATS'
import InstitutionDashboard from '@/pages/institution/InstitutionDashboard'
import AICopilot from '@/pages/ai/AICopilot'
import AssessmentPage from '@/pages/student/AssessmentPage'
import StudentOnboarding from '@/pages/student/StudentOnboarding'
import StudentLearning from '@/pages/student/StudentLearning'
import MentorshipHub from '@/pages/student/MentorshipHub'
import CampusEvents from '@/pages/student/CampusEvents'
import MessageCenter from '@/pages/student/MessageCenter'
import DigitalTwin from '@/pages/student/DigitalTwin'
import InterviewScheduler from '@/pages/employer/InterviewScheduler'
import EmployerAnalytics from '@/pages/employer/EmployerAnalytics'
import CompanyProfilePage from '@/pages/employer/CompanyProfilePage'
import StudentDirectory from '@/pages/institution/StudentDirectory'
import PlacementDrives from '@/pages/institution/PlacementDrives'
import NotFound from '@/pages/NotFound'
import AdminDashboard from '@/pages/admin/AdminDashboard'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectParam = location.pathname !== '/' ? `?redirect=${encodeURIComponent(location.pathname + location.search)}` : ''
    return <Navigate to={`/auth/login${redirectParam}`} replace />
  }

  // Super Admin has universal master access across all portals
  const isAdmin = user?.primaryRole === 'PLATFORM_ADMIN' || user?.primaryRole === 'SUPER_ADMIN' || user?.roles?.includes('PLATFORM_ADMIN')

  if (allowedRoles && user && !isAdmin && !allowedRoles.includes(user.primaryRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function DashboardRedirect() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/auth/login" replace />

  switch (user.primaryRole) {
    case 'PLATFORM_ADMIN':
    case 'SUPER_ADMIN':
      return <Navigate to="/admin/overview" replace />
    case 'STUDENT':
    case 'ALUMNI':
      return <Navigate to="/student/overview" replace />
    case 'EMPLOYER':
    case 'RECRUITER':
      return <Navigate to="/employer/overview" replace />
    case 'TPO':
    case 'INSTITUTION_ADMIN':
    case 'DEPARTMENT_ADMIN':
      return <Navigate to="/institution/overview" replace />
    case 'FACULTY':
      return <Navigate to="/faculty/overview" replace />
    default:
      return <Navigate to="/student/overview" replace />
  }
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/opportunities" element={<Navigate to="/student/opportunities" replace />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardRedirect /></ProtectedRoute>
      } />

      {/* Student routes */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ALUMNI']}><DashboardLayout role="student" /></ProtectedRoute>}>
        <Route path="/student/overview" element={<StudentDashboard />} />
        <Route path="/student/passport" element={<CareerPassport />} />
        <Route path="/student/skills" element={<SkillIntelligence />} />
        <Route path="/student/opportunities" element={<OpportunityMarketplace />} />
        <Route path="/student/applications" element={<ApplicationTracker />} />
        <Route path="/student/assessment" element={<AssessmentPage />} />
        <Route path="/student/copilot" element={<AICopilot />} />
        <Route path="/student/onboarding" element={<StudentOnboarding />} />
        <Route path="/student/learning" element={<StudentLearning />} />
        <Route path="/student/mentors" element={<MentorshipHub />} />
        <Route path="/student/events" element={<CampusEvents />} />
        <Route path="/student/messages" element={<MessageCenter />} />
        <Route path="/student/digital-twin" element={<DigitalTwin />} />
      </Route>

      {/* Employer routes */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYER', 'RECRUITER']}><DashboardLayout role="employer" /></ProtectedRoute>}>
        <Route path="/employer/overview" element={<EmployerDashboard />} />
        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/employer/applicants" element={<ApplicantATS />} />
        <Route path="/employer/interviews" element={<InterviewScheduler />} />
        <Route path="/employer/analytics" element={<EmployerAnalytics />} />
        <Route path="/employer/profile" element={<CompanyProfilePage />} />
        <Route path="/employer/messages" element={<MessageCenter />} />
      </Route>

      {/* Institution routes */}
      <Route element={<ProtectedRoute allowedRoles={['TPO', 'INSTITUTION_ADMIN', 'DEPARTMENT_ADMIN']}><DashboardLayout role="institution" /></ProtectedRoute>}>
        <Route path="/institution/overview" element={<InstitutionDashboard />} />
        <Route path="/institution/students" element={<StudentDirectory />} />
        <Route path="/institution/drives" element={<PlacementDrives />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'SUPER_ADMIN']}><DashboardLayout role="admin" /></ProtectedRoute>}>
        <Route path="/admin/overview" element={<AdminDashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
