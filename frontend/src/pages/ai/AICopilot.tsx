import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Loader2, Sparkles, RefreshCw, BookOpen, Search,
  FileText, Target, User, Award, CheckCircle, AlertTriangle,
  ArrowRight, UploadCloud, Check, ChevronRight, Zap, Trash2, FileUp
} from 'lucide-react'
import { aiApi, type ResumeAnalyzeResponse, type CopilotMessage } from '@/api/aiApi'
import { useAuthStore } from '@/store/authStore'
import { useBadgeStore } from '@/store/badgeStore'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestedActions?: string[]
  recommendedSkills?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hi! I'm your CareerSetu AI Career Copilot. I have real-time access to your verified Career Passport, assessment badges, and academic profile.

I can help you with:
• **Targeted Career Guidance**: Discover which roles match your verified competencies.
• **Curriculum Gap Analysis**: Find out exactly which tech stack skills you need for top companies.
• **ATS Resume Optimization**: Analyze your resume against automated ATS screening algorithms.
• **Personalized Roadmaps**: 12-week preparation milestones tailored to your pace.

What would you like to explore today?`,
    timestamp: new Date(),
    suggestedActions: [
      'Analyze my skill gaps for Backend Developer',
      'How to optimize my resume for ATS screening?',
      'Suggest top matching tech opportunities',
      'What are high demand skills in 2026?'
    ],
    recommendedSkills: ['Spring Boot', 'React 19', 'Docker', 'System Design']
  }
]

const sampleResumes: Record<string, string> = {
  backend: `Aarav Sharma
Email: aarav.sharma@careersetu.in | Phone: +91 9876543210
GitHub: github.com/aaravsharma-dev | LinkedIn: linkedin.com/in/aarav-sharma-demo

SUMMARY
Final year Computer Science student passionate about distributed microservices and cloud engineering. Experienced with Java 21, Spring Boot 3, and PostgreSQL.

EDUCATION
B.Tech Computer Science and Engineering, Pune University | CGPA: 8.75/10 (Expected: 2026)

TECHNICAL SKILLS
Languages: Java, SQL, Python, TypeScript
Frameworks & Tools: Spring Boot, Hibernate/JPA, Docker, REST APIs, Git, PostgreSQL, Redis

EXPERIENCE & PROJECTS
Full-Stack Career Gateway Platform
• Architected and engineered high-throughput REST backend in Java and Spring Boot with JWT authentication.
• Deployed microservices on Docker containers with PostgreSQL database indexing, reducing query response times by 35%.
• Integrated vector embeddings and LLM APIs for AI-driven candidate recommendation matching.

Real-Time Distributed Cache System
• Optimized in-memory cache layer using Redis and concurrent Java data structures, handling 10,000+ requests per minute.
• Implemented rate-limiting algorithms to safeguard upstream services against spikes.`,

  ai_ml: `Anita Singh
Email: anita.singh@careersetu.in | Phone: +91 9123456780

SUMMARY
Aspiring AI Engineer with solid background in Python, PyTorch, and NLP architectures.

EDUCATION
B.Tech Computer Science, BITS Pilani | CGPA: 8.45/10 (Expected: 2027)

TECHNICAL SKILLS
Languages: Python, SQL, C++
AI/ML: PyTorch, Scikit-Learn, HuggingFace, FastAPI, Pandas, NumPy, Vector Databases

PROJECTS
Semantic Job Search Engine
• Implemented semantic vector search pipeline using FastAPI and HuggingFace sentence transformers.
• Engineered cosine similarity matrix indexing for 50,000+ career listings with sub-50ms latency.
• Automated data extraction and cleaning workflows utilizing Python and PostgreSQL.`
}

export default function AICopilot() {
  const { user } = useAuthStore()
  const { skills: userSkills, badges } = useBadgeStore()

  // Active view: 'chat' | 'resume'
  const [activeTab, setActiveTab] = useState<'chat' | 'resume'>('chat')

  // Chat state
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Resume Analyzer state
  const [resumeText, setResumeText] = useState(sampleResumes.backend)
  const [targetRole, setTargetRole] = useState('Backend Software Engineer')
  const [targetIndustry, setTargetIndustry] = useState('Information Technology')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalyzeResponse | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; charCount?: number } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom()
    }
  }, [messages, activeTab])

  // Chat message submission
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // Check if user specifically asks to review resume
    const lower = text.toLowerCase()
    if (lower.includes('review my resume') || lower.includes('resume analyzer') || lower.includes('ats check')) {
      setActiveTab('resume')
      setIsLoading(false)
      return
    }

    try {
      const history: CopilotMessage[] = messages.slice(-5).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
      history.push({ role: 'user', content: text })

      const verifiedSkillNames = userSkills.filter(s => s.verified).map(s => s.name)

      const response = await aiApi.chatCopilot({
        messages: history,
        student_context: {
          name: user?.fullName || 'Aarav Sharma',
          target_role: 'Full Stack & Backend Software Engineer',
          skills: verifiedSkillNames.length > 0 ? verifiedSkillNames : ['Java', 'SQL', 'Git', 'REST APIs'],
          education_level: 'Undergraduate B.Tech'
        }
      })

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions,
        recommendedSkills: response.recommended_skills
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error('Copilot request failed:', err)
      // Fallback
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I analyzed your query: "${text}". Based on your verified profile and current Indian tech market requirements:

1. **Core Verification**: Prioritize validating high-demand competencies (Java, Spring Boot, React, and SQL) via proctored assessments.
2. **Project Proof of Work**: Deploy full-stack projects showcasing Docker containerization, REST API documentation, and quantifiable metric outcomes.
3. **Application Strategy**: Apply to verified opportunities on the CareerSetu marketplace where your match score exceeds 80%.

_AI-assisted guidance based on verified profile competencies._`,
        timestamp: new Date(),
        suggestedActions: ['Run ATS Resume Scan', 'View Matching Opportunities', 'Take Code Assessment']
      }
      setMessages(prev => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Resume analysis submission
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim() || isAnalyzing) return
    setIsAnalyzing(true)

    try {
      const result = await aiApi.analyzeResume({
        resume_text: resumeText,
        target_role: targetRole,
        target_industry: targetIndustry
      })
      setAnalysisResult(result)
    } catch (err) {
      console.error('Failed to analyze resume:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    try {
      toast.loading(`Extracting text from ${file.name}...`, { id: 'resume-upload' })
      const res = await aiApi.uploadResume(file, targetRole, targetIndustry)
      setResumeText(res.extracted_text)
      setAnalysisResult(res.analysis)
      setUploadedFile({
        name: res.file_name,
        size: file.size,
        charCount: res.char_count,
      })
      toast.success(`Parsed ${file.name}! ATS Score: ${res.analysis.ats_compatibility_score}/100`, { id: 'resume-upload' })
    } catch (err: any) {
      console.error('Resume upload failed:', err)
      toast.error(err?.message || 'Failed to parse resume file', { id: 'resume-upload' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 max-w-7xl mx-auto">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            AI Career & Intelligence Suite
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Real-time conversational copilot and ATS resume optimization powered by CareerSetu AI.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl border bg-slate-100 dark:bg-slate-800 flex items-center" style={{ borderColor: 'var(--border-default)' }}>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'chat'
                  ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> AI Copilot Chat
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'resume'
                  ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> ATS Resume Studio
            </button>
          </div>

          <span className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Online
          </span>
        </div>
      </div>

      {/* Main Body: Tab 1 (Chat) or Tab 2 (Resume Studio) */}
      {activeTab === 'chat' ? (
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          {/* Chat Window */}
          <div
            className="flex-1 flex flex-col rounded-2xl border overflow-hidden shadow-sm"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                        <Brain className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                      }`}
                      style={
                        msg.role === 'user'
                          ? { background: 'var(--color-brand-500)', color: 'white' }
                          : { background: 'var(--surface-inset)', color: 'var(--text-primary)' }
                      }
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Recommended Skills Pills */}
                      {msg.recommendedSkills && msg.recommendedSkills.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-[11px] font-semibold opacity-75 mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Recommended Skills for this Goal:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.recommendedSkills.map(sk => (
                              <span
                                key={sk}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Action Chips */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1">
                          {msg.suggestedActions.map(action => (
                            <button
                              key={action}
                              onClick={() => sendMessage(action)}
                              className="text-[11px] px-2.5 py-1 rounded-lg border bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition font-medium text-left flex items-center gap-1"
                              style={{ borderColor: 'var(--border-light)' }}
                            >
                              <span>{action}</span>
                              <ChevronRight className="w-3 h-3 opacity-50" />
                            </button>
                          ))}
                        </div>
                      )}

                      <p className="text-[10px] mt-1.5 opacity-50 text-right">
                        {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 text-white">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{ background: 'var(--surface-inset)' }}>
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-500">CareerSetu AI is analyzing your profile...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Prompt Buttons */}
            <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto" style={{ borderColor: 'var(--border-light)' }}>
              {[
                { label: 'Review my resume in ATS Studio', action: () => setActiveTab('resume'), icon: FileText },
                { label: 'Analyze my skill gaps', action: () => sendMessage('Analyze my skill gaps for Backend Developer'), icon: Target },
                { label: '12-week learning roadmap', action: () => sendMessage('Create a 12-week learning roadmap for Backend Developer'), icon: BookOpen },
                { label: 'Suggest matching opportunities', action: () => sendMessage('Suggest top matching tech opportunities for my profile'), icon: Search },
              ].map(({ label, action, icon: Icon }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium flex-shrink-0 border transition hover:border-blue-300 hover:bg-blue-50/50"
                  style={{ background: 'var(--surface-inset)', color: 'var(--text-secondary)', borderColor: 'var(--border-light)' }}
                >
                  <Icon className="w-3.5 h-3.5 text-blue-500" />
                  {label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                  placeholder="Ask Career Copilot anything about skills, roadmaps, opportunities..."
                  className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="px-5 py-3 rounded-xl font-medium text-white gradient-brand disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] mt-2 text-center text-slate-400">
                CareerSetu AI Copilot provides assistive guidance verified against your Career Passport.
              </p>
            </div>
          </div>

          {/* Sidebar Context */}
          <div className="lg:w-80 space-y-4 flex-shrink-0">
            {/* Connected Profile State */}
            <div className="p-5 rounded-2xl border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Connected Profile Context</h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <span className="text-slate-400">Target Role</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Full Stack Engineer</span>
                </div>
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <span className="text-slate-400">Verified Badges</span>
                  <span className="font-semibold text-emerald-600">{badges.length} Earned</span>
                </div>
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <span className="text-slate-400">Verified Skills</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {userSkills.filter(s => s.verified).length} Skills
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Academic Standing</span>
                  <span className="font-semibold text-blue-600">PICT Pune · CGPA 8.75</span>
                </div>
              </div>
            </div>

            {/* Quick Link to ATS Resume Studio */}
            <div className="p-5 rounded-2xl border gradient-brand text-white shadow-sm">
              <FileText className="w-6 h-6 mb-2 text-white/90" />
              <h3 className="font-bold text-sm mb-1">ATS Resume Studio</h3>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                Scan your resume text with automated ATS keyword & impact verb detectors.
              </p>
              <button
                onClick={() => setActiveTab('resume')}
                className="w-full py-2 rounded-xl text-xs font-bold bg-white text-blue-600 hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-1"
              >
                Launch Resume Studio <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: ATS RESUME STUDIO */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto">
          {/* Left Column: Input Editor & Parameters */}
          <div className="space-y-4 flex flex-col">
            <div className="p-5 rounded-2xl border space-y-4" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Resume Text & Role Targeting
                  </h3>
                </div>

                {/* Sample Template Loader */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 mr-1 text-[11px]">Load Sample:</span>
                  <button
                    onClick={() => setResumeText(sampleResumes.backend)}
                    className="px-2 py-0.5 rounded border hover:bg-slate-100 text-[11px] text-blue-600"
                    style={{ borderColor: 'var(--border-light)' }}
                  >
                    Backend
                  </button>
                  <button
                    onClick={() => setResumeText(sampleResumes.ai_ml)}
                    className="px-2 py-0.5 rounded border hover:bg-slate-100 text-[11px] text-purple-600"
                    style={{ borderColor: 'var(--border-light)' }}
                  >
                    AI/ML
                  </button>
                </div>
              </div>

              {/* Target Role & Industry Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-500">Target Role Title</label>
                  <input
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-500">Industry / Domain</label>
                  <input
                    value={targetIndustry}
                    onChange={e => setTargetIndustry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-500">
                  Upload Resume Document (PDF, TXT, MD)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0])
                    }
                  }}
                />

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                      <p className="text-xs font-semibold text-blue-600">Extracting and analyzing resume text...</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex items-center justify-between w-full px-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 text-left">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          DOC
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.charCount?.toLocaleString()} characters extracted
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFile(null)
                            setResumeText(sampleResumes.backend)
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-500"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-1">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                        <FileUp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-blue-600 hover:underline">Click to upload</span>
                        <span className="text-xs text-slate-500"> or drag and drop your resume</span>
                      </div>
                      <p className="text-[10px] text-slate-400">PDF, TXT, or Markdown (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-500">
                    Extracted Resume Content (Editable)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {resumeText.length.toLocaleString()} characters
                  </span>
                </div>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  rows={13}
                  placeholder="Paste raw text of your resume..."
                  className="w-full p-3.5 rounded-xl border text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleAnalyzeResume}
                disabled={isAnalyzing || !resumeText.trim()}
                className="w-full py-3 rounded-xl text-xs font-bold text-white gradient-brand disabled:opacity-50 transition shadow-md flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Deep ATS Evaluation...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze Resume with AI Engine
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: ATS Evaluation Dashboard */}
          <div className="space-y-4">
            {analysisResult ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border text-center" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Overall Resume Score</span>
                    <p className="text-3xl font-bold font-display text-blue-600">
                      {analysisResult.overall_score}<span className="text-sm font-normal text-slate-400">/100</span>
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {analysisResult.overall_score >= 80 ? 'Top Percentile Candidate' : 'Solid Foundation'}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border text-center" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">ATS Compatibility</span>
                    <p className="text-3xl font-bold font-display text-emerald-600">
                      {analysisResult.ats_compatibility_score}<span className="text-sm font-normal text-slate-400">/100</span>
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Parsed Successfully
                    </span>
                  </div>
                </div>

                {/* AI Executive Summary */}
                <div className="p-4 rounded-xl border text-xs leading-relaxed" style={{ background: 'hsl(148, 60%, 97%)', borderColor: 'hsl(148, 50%, 85%)', color: 'hsl(148, 60%, 25%)' }}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Evaluation Summary:
                  </div>
                  {analysisResult.summary}
                </div>

                {/* Strengths */}
                {analysisResult.strengths.length > 0 && (
                  <div className="p-4 rounded-xl border space-y-2" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Identified Strengths
                    </h4>
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      {analysisResult.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actionable Improvements */}
                {analysisResult.actionable_improvements.length > 0 && (
                  <div className="p-4 rounded-xl border space-y-2" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Actionable Recommendations
                    </h4>
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      {analysisResult.actionable_improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">→</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Keywords */}
                {analysisResult.missing_keywords.length > 0 && (
                  <div className="p-4 rounded-xl border space-y-2" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Missing High-Impact Industry Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missing_keywords.map(kw => (
                        <span key={kw} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Empty state before running scan */
              <div className="p-12 text-center rounded-2xl border flex flex-col items-center justify-center min-h-[380px]" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  Ready to Analyze Your Resume
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
                  Click the button to evaluate your resume against ATS ranking factors, action verb density, and missing tech keywords.
                </p>
                <button
                  onClick={handleAnalyzeResume}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand shadow-sm flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" /> Start ATS Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
