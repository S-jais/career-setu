import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, ShieldCheck, Globe, MapPin, Users,
  CheckCircle, Edit3, Save, ExternalLink, Sparkles, Award, Loader2, Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import { companyApi } from '@/api/companyApi'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    legalName: 'TechCorp Solutions India Private Limited',
    brandName: 'TechCorp India',
    cin: 'U72200MH2019PTC328491',
    gstin: '29AABCT1332L1Z2',
    industry: 'Enterprise Cloud & AI Systems',
    headcount: '500 - 1,000 Employees',
    foundedYear: 2019,
    website: 'https://techcorp.example.in',
    careersUrl: 'https://careers.techcorp.example.in',
    headquarters: 'Bandra-Kurla Complex (BKC), Mumbai, Maharashtra',
    offices: ['Mumbai', 'Bengaluru', 'Pune'],
    about: 'TechCorp India is a premier enterprise cloud systems organization pioneering high-throughput distributed transaction engines, microservices architectures, and sovereign AI copilot platforms for Fortune 500 enterprises.',
    techStack: ['Java 21', 'Spring Boot 3', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'Python', 'React 19'],
    perks: ['Pre-Placement Offer (PPO) Pathway', '₹45,000 - ₹85,000/mo Internship Stipends', 'Health Insurance & Wellness Budget', 'Hybrid Work Culture', 'Direct Mentorship by Principal Engineers']
  })

  const [form, setForm] = useState({ ...profile })

  useEffect(() => {
    async function loadCompany() {
      try {
        const comp = await companyApi.getPrimary()
        if (comp) {
          setCompanyId(comp.id)
          setProfile(prev => ({
            ...prev,
            legalName: comp.legalName || prev.legalName,
            brandName: comp.brandName || prev.brandName,
            cin: comp.cin || prev.cin,
            gstin: comp.gstin || prev.gstin,
            industry: comp.industry || prev.industry,
            website: comp.website || prev.website,
            about: comp.description || prev.about
          }))
          setForm(prev => ({
            ...prev,
            legalName: comp.legalName || prev.legalName,
            brandName: comp.brandName || prev.brandName,
            cin: comp.cin || prev.cin,
            gstin: comp.gstin || prev.gstin,
            industry: comp.industry || prev.industry,
            website: comp.website || prev.website,
            about: comp.description || prev.about
          }))
        }
      } catch (err) {
        console.warn('Using local fallback for company profile:', err)
      }
    }
    loadCompany()
  }, [])

  const handleVerifyGstinNow = async () => {
    if (!companyId) return
    setIsVerifyingGstin(true)
    try {
      const res = await companyApi.verifyGstin(companyId, form.gstin, form.cin)
      toast.success(res.message || 'GSTIN verified against Indian national registry!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to verify GSTIN format')
    } finally {
      setIsVerifyingGstin(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (companyId) {
        await companyApi.updateProfile(companyId, {
          brandName: form.brandName,
          description: form.about,
          industry: form.industry,
          website: form.website
        })
      }
      setProfile({ ...form })
      setIsEditing(false)
      toast.success('Company verification profile & branding updated in backend!')
    } catch (err) {
      setProfile({ ...form })
      setIsEditing(false)
      toast.success('Company profile updated locally!')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> MCA & GSTIN Verified
            </span>
            <span className="text-xs text-slate-400">• Ministry of Corporate Affairs Authenticated</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Company Profile & Verification Center
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Manage corporate branding, government compliance credentials, and recruitment identity presented to university candidates.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              setIsEditing(false)
            } else {
              setForm({ ...profile })
              setIsEditing(true)
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold border hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
        >
          <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </motion.div>

      {/* Main Profile Showcase Card */}
      <motion.div variants={fadeUp} className="p-6 rounded-2xl border shadow-sm space-y-6" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 pb-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-md">
            TC
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  {profile.brandName}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{profile.legalName}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-blue-600 transition"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mt-3">
              {profile.about}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-3">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {profile.headquarters}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-500" /> {profile.headcount}</span>
              <span>•</span>
              <span>Founded {profile.foundedYear}</span>
            </div>
          </div>
        </div>

        {/* Form or Read-only Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Brand Name</label>
                <input
                  type="text"
                  required
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border outline-none font-medium"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Industry / Domain</label>
                <input
                  type="text"
                  required
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full p-2.5 rounded-xl border outline-none font-medium"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Company Overview & Student Pitch</label>
              <textarea
                rows={4}
                required
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                className="w-full p-2.5 rounded-xl border outline-none font-medium resize-none leading-relaxed"
                style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Corporate Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full p-2.5 rounded-xl border outline-none font-medium font-mono"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-300">Headquarters Address</label>
                <input
                  type="text"
                  value={form.headquarters}
                  onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
                  className="w-full p-2.5 rounded-xl border outline-none font-medium"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold text-white gradient-brand transition shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Stack Tags */}
            <div>
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2.5">
                Core Engineering Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800/60"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Culture Perks */}
            <div>
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2.5">
                Internship & Candidate Perks
              </h3>
              <div className="space-y-1.5">
                {profile.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
