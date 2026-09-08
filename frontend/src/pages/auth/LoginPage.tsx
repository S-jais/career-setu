import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/authApi'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const redirectTarget = searchParams.get('redirect')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(data.email, data.password)
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success(`Welcome back, ${response.user.fullName.split(' ')[0]}!`)
      if (redirectTarget && redirectTarget.startsWith('/')) {
        navigate(redirectTarget)
      } else {
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid credentials. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>
        Welcome back
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        Sign in to your CareerSetu account.{' '}
        <Link to="/auth/register" className="font-medium" style={{ color: 'var(--color-brand-500)' }}>
          Create account
        </Link>
      </p>

      {redirectTarget && (
        <div className="mb-6 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium"
             style={{ background: 'var(--color-brand-50)', borderColor: 'var(--color-brand-200)', color: 'var(--color-brand-700)' }}>
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Please sign in to access {redirectTarget.includes('opportunities') ? 'the Opportunity Marketplace' : 'your requested page'}.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
            style={{
              background: 'var(--surface-card)',
              borderColor: errors.email ? 'var(--color-error)' : 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
          {errors.email && (
            <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Password</label>
            <Link to="/auth/forgot-password" className="text-xs" style={{ color: 'var(--color-brand-500)' }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
              style={{
                background: 'var(--surface-card)',
                borderColor: errors.password ? 'var(--color-error)' : 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: 'var(--text-muted)' }}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white gradient-brand shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </form>

      {/* Demo credentials & Quick Fill */}
      <div className="mt-6 p-4 rounded-2xl border" style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">🚀 Quick-Fill Login (Dev & Demo)</p>
          <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">Click to auto-fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { email: 'sj6161362@gmail.com', role: '👑 Super Admin', note: 'Full Governance' },
            { email: 'admin@careersetu.in', role: 'Platform Admin', note: 'System Admin' },
            { email: 'student@careersetu.in', role: 'Student Lead', note: 'Aarav Sharma' },
            { email: 'employer@careersetu.in', role: 'Employer / ATS', note: 'TechCorp Recruiter' },
          ].map(({ email, role, note }) => (
            <button
              key={email}
              type="button"
              onClick={() => {
                setValue('email', email)
                setValue('password', 'Demo@CareerSetu2024')
                toast.success(`Loaded credentials for ${role}`)
              }}
              className="p-2.5 rounded-xl border text-left hover:border-brand-500 hover:bg-white dark:hover:bg-slate-800 transition-all group"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{role}</span>
                <span className="text-[10px] text-slate-400 font-normal">{note}</span>
              </div>
              <div className="text-[11px] font-mono text-brand-600 truncate mt-0.5">
                {email}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Authentication Guarantees */}
      <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500" style={{ borderColor: 'var(--border-light)' }}>
        <span className="inline-flex items-center gap-1">
          🔒 <strong>Argon2id</strong> Encryption
        </span>
        <span className="inline-flex items-center gap-1">
          🛡️ <strong>JWT HMAC-512</strong> Stateless Auth
        </span>
        <span className="inline-flex items-center gap-1">
          ⚡ <strong>Rate-Limit</strong> Active
        </span>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          By signing in, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
