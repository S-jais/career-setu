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

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
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

      {/* Demo credentials */}
      <div className="mt-6 p-4 rounded-xl border" style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>🔧 Demo Accounts (Development Only)</p>
        <div className="space-y-1">
          {[
            { email: 'student@careersetu.in', role: 'Student' },
            { email: 'employer@careersetu.in', role: 'Employer / Recruiter' },
            { email: 'admin@careersetu.in', role: 'Platform Admin' },
          ].map(({ email, role }) => (
            <p key={email} className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {role}: <span style={{ color: 'var(--color-brand-500)' }}>{email}</span> / Demo@CareerSetu2024
            </p>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          By signing in, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
