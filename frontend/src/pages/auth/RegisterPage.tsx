import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, GraduationCap, Briefcase, Building2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/authApi'

const roles = [
  { id: 'STUDENT', label: 'Student', icon: GraduationCap, desc: 'Looking for internships & jobs' },
  { id: 'EMPLOYER', label: 'Employer / Recruiter', icon: Briefcase, desc: 'Hiring talent & collaborating' },
  { id: 'TPO', label: 'TPO / Institution', icon: Building2, desc: 'Managing placements & career' },
  { id: 'FACULTY', label: 'Faculty / Mentor', icon: Users, desc: 'Teaching & mentoring students' },
]

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[@$!%*?&]/, 'Must contain at least one special character (@$!%*?&)'),
  confirmPassword: z.string(),
  role: z.string().min(1, 'Please select a role'),
  acceptedTerms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
  acceptedPrivacyPolicy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const defaultRole = searchParams.get('role') || 'STUDENT'

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole, acceptedTerms: undefined as unknown as true, acceptedPrivacyPolicy: undefined as unknown as true },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const response = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
        acceptedTerms: data.acceptedTerms,
        acceptedPrivacyPolicy: data.acceptedPrivacyPolicy,
      })
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success('Account created! Welcome to CareerSetu.')
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>
        Create your account
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium" style={{ color: 'var(--color-brand-500)' }}>Sign in</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>I am a...</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => (
              <button key={role.id} type="button"
                      onClick={() => setValue('role', role.id)}
                      className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                        selectedRole === role.id ? 'ring-2 ring-brand-500' : ''
                      }`}
                      style={{
                        background: selectedRole === role.id ? 'var(--color-brand-50)' : 'var(--surface-card)',
                        borderColor: selectedRole === role.id ? 'var(--color-brand-400)' : 'var(--border-default)',
                      }}>
                <role.icon className="w-4 h-4" style={{ color: selectedRole === role.id ? 'var(--color-brand-500)' : 'var(--text-muted)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{role.label}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{role.desc}</span>
              </button>
            ))}
          </div>
          {errors.role && <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>{errors.role.message}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name</label>
          <input {...register('fullName')} placeholder="Rahul Sharma" autoComplete="name"
                 className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
                 style={{ background: 'var(--surface-card)', borderColor: errors.fullName ? 'var(--color-error)' : 'var(--border-default)', color: 'var(--text-primary)' }} />
          {errors.fullName && <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
          <input {...register('email')} type="email" placeholder="you@college.edu" autoComplete="email"
                 className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
                 style={{ background: 'var(--surface-card)', borderColor: errors.email ? 'var(--color-error)' : 'var(--border-default)', color: 'var(--text-primary)' }} />
          {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'}
                   autoComplete="new-password" placeholder="Min. 8 chars, uppercase, number, special"
                   className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
                   style={{ background: 'var(--surface-card)', borderColor: errors.password ? 'var(--color-error)' : 'var(--border-default)', color: 'var(--text-primary)' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--text-muted)' }}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
          <input {...register('confirmPassword')} type="password" placeholder="Re-enter your password"
                 className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400"
                 style={{ background: 'var(--surface-card)', borderColor: errors.confirmPassword ? 'var(--color-error)' : 'var(--border-default)', color: 'var(--text-primary)' }} />
          {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Consent */}
        <div className="space-y-2">
          {[
            { field: 'acceptedTerms', label: 'Terms of Service', error: errors.acceptedTerms },
            { field: 'acceptedPrivacyPolicy', label: 'Privacy Policy', error: errors.acceptedPrivacyPolicy },
          ].map(({ field, label, error }) => (
            <div key={field}>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" {...register(field as keyof RegisterFormData)}
                       className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-brand-500" />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  I accept the <a href="#" className="underline" style={{ color: 'var(--color-brand-500)' }}>{label}</a>
                </span>
              </label>
              {error && <p className="mt-0.5 text-xs pl-6" style={{ color: 'var(--color-error)' }}>{(error as { message?: string }).message}</p>}
            </div>
          ))}
        </div>

        {/* Submit */}
        <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
                       className="w-full py-3 rounded-xl font-semibold text-sm text-white gradient-brand shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
          ) : (
            <>Create Account <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </form>
    </div>
  )
}
