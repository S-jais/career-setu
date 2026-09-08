import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Search, Download, Upload, CheckCircle,
  AlertCircle, ShieldCheck, User, ArrowRight, X, ExternalLink, Award, FileSpreadsheet, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { institutionApi } from '@/api/institutionApi'
import type { InstitutionStudentRecord } from '@/api/institutionApi'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

const initialFallbackStudents: InstitutionStudentRecord[] = [
  {
    id: 's-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@careersetu.in',
    rollNo: '22CSE041',
    department: 'Computer Science & Engineering',
    year: 4,
    cgpa: 8.92,
    nepCredits: 14,
    nepStatus: 'COMPLIANT',
    verifiedBadgesCount: 4,
    placementStatus: 'Shortlisted',
    placedCompany: 'TechCorp India'
  },
  {
    id: 's-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    rollNo: '22CSE018',
    department: 'Computer Science & Engineering',
    year: 4,
    cgpa: 9.15,
    nepCredits: 14,
    nepStatus: 'COMPLIANT',
    verifiedBadgesCount: 5,
    placementStatus: 'Interview Scheduled',
    placedCompany: 'Microsoft AI'
  },
  {
    id: 's-3',
    name: 'Rahul Kumar',
    email: 'rahul.k@example.com',
    rollNo: '22IT052',
    department: 'Information Technology',
    year: 4,
    cgpa: 8.42,
    nepCredits: 10,
    nepStatus: 'IN_PROGRESS',
    verifiedBadgesCount: 3,
    placementStatus: 'Placed',
    placedCompany: 'Infosys AI Systems'
  },
  {
    id: 's-4',
    name: 'Anita Singh',
    email: 'anita.s@example.com',
    rollNo: '22AI034',
    department: 'Artificial Intelligence & Data Science',
    year: 4,
    cgpa: 8.78,
    nepCredits: 12,
    nepStatus: 'IN_PROGRESS',
    verifiedBadgesCount: 4,
    placementStatus: 'Final Round',
    placedCompany: 'Amazon Web Services'
  }
]

export default function StudentDirectory() {
  const [students, setStudents] = useState<InstitutionStudentRecord[]>(initialFallbackStudents)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('ALL')
  const [nepFilter, setNepFilter] = useState('ALL')
  const [selectedStudent, setSelectedStudent] = useState<InstitutionStudentRecord | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadStudents = async () => {
    setIsLoading(true)
    try {
      const data = await institutionApi.getStudents({
        department: branchFilter !== 'ALL' ? branchFilter : undefined,
        nepStatus: nepFilter !== 'ALL' ? nepFilter : undefined,
        search: searchQuery || undefined
      })
      if (data && data.length > 0) {
        setStudents(data)
      }
    } catch (err) {
      console.warn('Using fallback data for institution students:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [branchFilter, nepFilter])

  const handleExportCSV = () => {
    const headers = 'Name,Email,RollNo,Department,Year,CGPA,NEPCredits,NEPStatus,PlacementStatus\n'
    const rows = students.map(s => `"${s.name}","${s.email}","${s.rollNo}","${s.department}",${s.year},${s.cgpa},${s.nepCredits},"${s.nepStatus}","${s.placementStatus}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `careersetu_batch_2026_roster.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Roster CSV downloaded successfully!')
  }

  const handleBulkUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      toast.error('Please select a .csv file to upload')
      return
    }

    setIsUploading(true)
    try {
      const res = await institutionApi.bulkUploadCsv(uploadFile)
      if (res.success) {
        toast.success(res.message || `Successfully imported ${res.importedCount} students!`)
        setShowUploadModal(false)
        setUploadFile(null)
        await loadStudents()
      } else {
        toast.error(res.message || 'CSV upload failed')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error uploading roster CSV')
    } finally {
      setIsUploading(false)
    }
  }

  const filtered = students.filter((s) => {
    const matchesBranch = branchFilter === 'ALL' || (s.department && s.department.includes(branchFilter))
    const matchesNep = nepFilter === 'ALL' || s.nepStatus === nepFilter
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesBranch && matchesNep && matchesSearch
  })

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Institution TPO Suite
            </span>
            <span className="text-xs text-slate-400">• NEP 2020 14-Credit Roster</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Student Cohort & Verification Directory
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Track academic batches, NEP 2020 mandatory internship credits, verifiable badges, and placement statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            <Upload className="w-4 h-4" /> Bulk Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 border transition hover:bg-slate-50 dark:hover:bg-slate-800"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
          >
            <Download className="w-4 h-4" /> Export Roster
          </button>
        </div>
      </motion.div>

      {/* Summary KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled Cohort</p>
          <p className="text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>{students.length}</p>
          <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Graduating Batch 2026</span>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">NEP 14-Credit Compliant</p>
          <p className="text-2xl font-black mt-1 text-emerald-600">
            {students.filter(s => s.nepStatus === 'COMPLIANT').length}
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">
            {Math.round((students.filter(s => s.nepStatus === 'COMPLIANT').length / (students.length || 1)) * 100)}% compliance rate
          </span>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Cohort CGPA</p>
          <p className="text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
            {(students.reduce((acc, s) => acc + s.cgpa, 0) / (students.length || 1)).toFixed(2)}
          </p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Consistent Academic Baseline</span>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placed / Shortlisted</p>
          <p className="text-2xl font-black mt-1 text-purple-600">
            {students.filter(s => ['Placed', 'Shortlisted', 'Interview Scheduled', 'Final Round', 'PLACED', 'SHORTLISTED'].includes(s.placementStatus)).length}
          </p>
          <span className="text-xs text-purple-600 font-medium mt-1 inline-block">Active Hiring Cycles</span>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={fadeUp} className="p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
      >
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name, roll number, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border bg-transparent focus:outline-none"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Artificial Intelligence">AI & Data Science</option>
            <option value="Electronics">Electronics & Telecommunication</option>
          </select>

          <select
            value={nepFilter}
            onChange={(e) => setNepFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border bg-transparent focus:outline-none"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All NEP Credit Statuses</option>
            <option value="COMPLIANT">Compliant (14 Credits)</option>
            <option value="IN_PROGRESS">In Progress (1 - 13 Credits)</option>
            <option value="PENDING">Pending (0 Credits)</option>
          </select>
        </div>
      </motion.div>

      {/* Student Table */}
      <motion.div variants={fadeUp} className="rounded-2xl border overflow-hidden shadow-sm"
        style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-bold uppercase tracking-wider text-slate-400" style={{ borderColor: 'var(--border-light)' }}>
                <th className="py-3.5 px-4">Student & Roll No</th>
                <th className="py-3.5 px-4">Department & Year</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">NEP 2020 Status</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Placement Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border-light)' }}>
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.rollNo} • {s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-xs text-slate-700 dark:text-slate-300">{s.department}</p>
                    <p className="text-xs text-slate-400">Year {s.year} (Batch of 2026)</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                    {s.cgpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {s.nepStatus === 'COMPLIANT' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {s.nepCredits}/14 Credits
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {s.nepCredits}/14 Credits
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-lg border text-xs font-semibold flex items-center gap-1 w-fit"
                          style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                      <Award className="w-3.5 h-3.5 text-blue-500" /> {s.verifiedBadgesCount || 3}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {s.placementStatus}
                      </span>
                      {s.placedCompany && (
                        <p className="text-xs text-purple-600 font-medium">@ {s.placedCompany}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bulk CSV Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Bulk Import Student Roster
                  </h2>
                  <p className="text-xs text-slate-400">Upload college spreadsheet (.csv) to batch-enroll student records</p>
                </div>
              </div>

              <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0])
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {uploadFile ? uploadFile.name : 'Click to browse or drop CSV roster file'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Columns: Name, Email, RollNo, Department, Year, CGPA, NEPCredits
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Supported Features:</p>
                  <p>• Automatic NEP 2020 14-credit compliance calculation</p>
                  <p>• Idempotent upsert by student Roll Number</p>
                  <p>• Instant database persistence in Spring Boot backend</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !uploadFile}
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? 'Importing...' : 'Upload & Import'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Details Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
              style={{ background: 'var(--surface-card)' }}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Student Verification Passport</h2>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-blue-100 text-blue-800">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{selectedStudent.name}</h3>
                      <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border space-y-2 text-xs" style={{ borderColor: 'var(--border-light)' }}>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Roll Number:</span>
                      <span className="font-bold">{selectedStudent.rollNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-bold text-right">{selectedStudent.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cumulative GPA:</span>
                      <span className="font-bold text-emerald-600">{selectedStudent.cgpa.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">NEP 2020 Credits:</span>
                      <span className="font-bold">{selectedStudent.nepCredits} / 14 Credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Placement Status:</span>
                      <span className="font-bold text-purple-600">{selectedStudent.placementStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Close Drawer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
