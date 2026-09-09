import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, GraduationCap, Briefcase, Building2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
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
      const normalizedEmail = data.email.toLowerCase().trim()
      await authApi.register({
        fullName: data.fullName.trim(),
        email: normalizedEmail,
        password: data.password,
        role: data.role,
        acceptedTerms: data.acceptedTerms,
        acceptedPrivacyPolicy: data.acceptedPrivacyPolicy,
      })
      toast.success('Account created successfully! Your CareerSetu account has been created. You can now sign in.', {
        duration: 5000,
        icon: '🎉',
      })
      navigate('/auth/login')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ''
      if (message.toLowerCase().includes('already exists') || message.toLowerCase().includes('duplicate') || message.includes('EMAIL_ALREADY_EXISTS')) {
        toast.error('An account with this email already exists. Please sign in instead.', { duration: 5000 })
      } else {
        toast.error(message || 'Registration failed. Please check your details and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[3px] p-7 sm:p-9">
      <h2 className="text-[1.75rem] font-medium font-display mb-1.5 text-[var(--ink)] leading-tight">
        Create your account
      </h2>
      <p className="text-sm mb-6 text-[var(--slate)]">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-[var(--marigold-deep)] hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--ink)]">
            I am a...
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => {
              const isSelected = selectedRole === role.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setValue('role', role.id)}
                  className="flex flex-col items-start gap-1 p-3 rounded-[3px] border text-left transition-colors cursor-pointer"
                  style={{
                    background: isSelected ? 'var(--mist-dim)' : 'var(--paper)',
                    borderColor: isSelected ? 'var(--ink)' : 'var(--line)',
                  }}
                >
                  <role.icon className="w-4 h-4" style={{ color: isSelected ? 'var(--marigold-deep)' : 'var(--slate)' }} />
                  <span className="text-xs font-semibold text-[var(--ink)]">{role.label}</span>
                  <span className="text-[11px] text-[var(--slate)] opacity-80 leading-snug">{role.desc}</span>
                </button>
              )
            })}
          </div>
          {errors.role && <p className="mt-1 text-xs text-[#B93829]">{errors.role.message}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--ink)]">Full Name</label>
          <input
            {...register('fullName')}
            placeholder="Enter your name"
            autoComplete="name"
            className="w-full px-3.5 py-2.5 rounded-[3px] border text-sm outline-none transition-colors"
            style={{
              background: 'var(--paper)',
              borderColor: errors.fullName ? 'var(--color-error)' : 'var(--line)',
              color: 'var(--ink)',
            }}
          />
          {errors.fullName && <p className="mt-1 text-xs text-[#B93829]">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--ink)]">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@college.edu"
            autoComplete="email"
            className="w-full px-3.5 py-2.5 rounded-[3px] border text-sm outline-none transition-colors"
            style={{
              background: 'var(--paper)',
              borderColor: errors.email ? 'var(--color-error)' : 'var(--line)',
              color: 'var(--ink)',
            }}
          />
          {errors.email && <p className="mt-1 text-xs text-[#B93829]">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--ink)]">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min. 8 chars, uppercase, number, special"
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
          {errors.password && <p className="mt-1 text-xs text-[#B93829]">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--ink)]">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="Re-enter your password"
            className="w-full px-3.5 py-2.5 rounded-[3px] border text-sm outline-none transition-colors"
            style={{
              background: 'var(--paper)',
              borderColor: errors.confirmPassword ? 'var(--color-error)' : 'var(--line)',
              color: 'var(--ink)',
            }}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-[#B93829]">{errors.confirmPassword.message}</p>}
        </div>

        {/* Consent */}
        <div className="space-y-2 pt-1">
          {[
            { field: 'acceptedTerms', label: 'Terms of Service', error: errors.acceptedTerms },
            { field: 'acceptedPrivacyPolicy', label: 'Privacy Policy', error: errors.acceptedPrivacyPolicy },
          ].map(({ field, label, error }) => (
            <div key={field}>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(field as keyof RegisterFormData)}
                  className="mt-0.5 w-4 h-4 rounded-[2px] border-[var(--line)] accent-[var(--ink)]"
                />
                <span className="text-xs text-[var(--slate)]">
                  I accept the <a href="#" className="underline hover:text-[var(--ink)]">{label}</a>
                </span>
              </label>
              {error && <p className="mt-0.5 text-xs pl-6 text-[#B93829]">{(error as { message?: string }).message}</p>}
            </div>
          ))}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.99 }}
          className="btn btn-primary w-full py-2.5 text-sm font-semibold rounded-[3px] gap-2 mt-2"
        >
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
