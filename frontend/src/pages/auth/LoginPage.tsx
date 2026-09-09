import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, Info, Lock } from 'lucide-react'
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
      const normalizedEmail = data.email.toLowerCase().trim()
      const response = await authApi.login(normalizedEmail, data.password)
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success(`Welcome back! Login successful.`)
      if (redirectTarget && redirectTarget.startsWith('/')) {
        navigate(redirectTarget)
      } else {
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid email or password.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[3px] p-7 sm:p-9">
      <h2 className="text-[1.75rem] font-medium font-display mb-1.5 text-[var(--ink)] leading-tight">
        Welcome back
      </h2>
      <p className="text-sm mb-7 text-[var(--slate)]">
        Sign in to your CareerSetu account.{' '}
        <Link to="/auth/register" className="font-semibold text-[var(--marigold-deep)] hover:underline">
          Create account
        </Link>
      </p>

      {redirectTarget && (
        <div className="mb-6 p-3 rounded-[3px] border border-[var(--line)] bg-[var(--mist-dim)] flex items-center gap-2.5 text-xs font-medium text-[var(--ink)]">
          <Info className="w-4 h-4 shrink-0 text-[var(--teal)]" />
          <span>Please sign in to access {redirectTarget.includes('opportunities') ? 'the Opportunity Marketplace' : 'your requested page'}.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--ink)]">
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="name@organization.edu"
            className="w-full px-3.5 py-2.5 rounded-[3px] border text-sm outline-none transition-colors"
            style={{
              background: 'var(--paper)',
              borderColor: errors.email ? 'var(--color-error)' : 'var(--line)',
              color: 'var(--ink)',
            }}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#B93829]">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-[var(--ink)]">Password</label>
            <Link to="/auth/forgot-password" className="text-xs text-[var(--slate)] hover:text-[var(--ink)] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your account password"
              className="w-full px-3.5 py-2.5 pr-10 rounded-[3px] border text-sm outline-none transition-colors"
              style={{
                background: 'var(--paper)',
                borderColor: errors.password ? 'var(--color-error)' : 'var(--line)',
                color: 'var(--ink)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--slate)] hover:text-[var(--ink)]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-[#B93829]">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.99 }}
          className="btn btn-primary w-full py-2.5 text-sm font-semibold rounded-[3px] gap-2 mt-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </form>

      {/* Security notice */}
      <div className="mt-8 pt-6 border-t border-[var(--line)] text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--slate)]">
          <Lock className="w-3.5 h-3.5 text-[var(--teal)]" />
          <span>Protected by end-to-end cryptographic authentication</span>
        </div>
        <p className="text-xs text-[var(--slate)] opacity-80">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-[var(--ink)]">Terms of Service</a> and{' '}
          <a href="#" className="underline hover:text-[var(--ink)]">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
