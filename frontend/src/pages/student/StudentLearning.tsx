import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, CheckCircle, Clock, PlayCircle, Award, Sparkles,
  ArrowRight, Search, ChevronRight, X, Star, FileText, Check
} from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

interface CourseModule {
  id: string
  title: string
  duration: string
  lessonsCount: number
  completed: boolean
  nepCredits: number
  description: string
  lessons: string[]
}

interface Track {
  id: string
  title: string
  category: 'BACKEND' | 'GENAI' | 'FULLSTACK' | 'DEVOPS'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  nepTotalCredits: number
  progress: number
  durationWeeks: number
  enrolledStudents: number
  rating: number
  description: string
  skillsEarned: string[]
  modules: CourseModule[]
}

const tracksData: Track[] = [
  {
    id: 'track-backend-java',
    title: 'Cloud-Native Java & Distributed Systems',
    category: 'BACKEND',
    level: 'ADVANCED',
    nepTotalCredits: 4,
    progress: 65,
    durationWeeks: 8,
    enrolledStudents: 1420,
    rating: 4.9,
    description: 'Master enterprise Java 21, Spring Boot 3, Hibernate JPA, high-throughput microservices, Redis caching, and PostgreSQL optimizations compliant with industry hiring standards.',
    skillsEarned: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Redis', 'Docker', 'Distributed Systems'],
    modules: [
      {
        id: 'm-1',
        title: 'Java 21 Virtual Threads & Concurrency Patterns',
        duration: '4h 30m',
        lessonsCount: 6,
        completed: true,
        nepCredits: 1,
        description: 'Deep dive into Project Loom, lightweight virtual threads, structured concurrency, and thread-safe data structures.',
        lessons: [
          'Evolution of Concurrency: Platform vs Virtual Threads',
          'Structured Concurrency in Java 21',
          'Scoped Values and Context Propagation',
          'Thread Pools, Executors and Benchmark Latency',
          'Hands-on: Migrating Spring Boot IO Threads',
          'Module Assessment & Code Review'
        ]
      },
      {
        id: 'm-2',
        title: 'Spring Boot 3 Architecture & Microservices',
        duration: '6h 15m',
        lessonsCount: 8,
        completed: true,
        nepCredits: 1,
        description: 'Building stateless RESTful APIs, Spring Security 6 with JWT & Argon2id, and Spring Cloud config servers.',
        lessons: [
          'Spring Boot 3 Core Annotations & Lifecycle',
          'Database Persistence with Spring Data JPA',
          'Stateless JWT Authentication with HMAC-SHA512',
          'Role-Based Access Control (RBAC) Architecture',
          'Distributed Tracing with Micrometer & Zipkin',
          'API Gateway Routing & Rate Limiting',
          'Resilience4j Circuit Breaker Implementation',
          'Hands-on Project: Distributed Auth Gateway'
        ]
      },
      {
        id: 'm-3',
        title: 'High-Performance Caching & Messaging Systems',
        duration: '5h 45m',
        lessonsCount: 7,
        completed: false,
        nepCredits: 1,
        description: 'Implementing Redis distributed cache patterns, cache stampede prevention, and RabbitMQ message streaming.',
        lessons: [
          'Cache Strategies: Read-Through, Write-Behind, Cache-Aside',
          'Redis Data Structures & TTL Expiration Policies',
          'Message Broker Architecture: RabbitMQ Exchanges & Queues',
          'Idempotent Consumer Pattern for Distributed Events',
          'Dead Letter Exchanges (DLX) & Retry Handling',
          'Database Query Tuning & Index Optimization',
          'Capstone Project: Real-Time Event Pipeline'
        ]
      },
      {
        id: 'm-4',
        title: 'Docker Containerization & Kubernetes Orchestration',
        duration: '5h 00m',
        lessonsCount: 5,
        completed: false,
        nepCredits: 1,
        description: 'Multi-stage Docker builds, Kubernetes pods & deployments, health probes, and cloud CI/CD pipelines.',
        lessons: [
          'Dockerizing Spring Boot with Multi-Stage JRE Images',
          'Container Security & Non-Root User Execution',
          'Kubernetes Pods, Services, and ConfigMaps',
          'Liveness & Readiness Probes for Zero-Downtime Deploys',
          'GitHub Actions CI/CD Pipeline Automation'
        ]
      }
    ]
  },
  {
    id: 'track-genai',
    title: 'Generative AI & LLM Systems Engineering',
    category: 'GENAI',
    level: 'INTERMEDIATE',
    nepTotalCredits: 4,
    progress: 30,
    durationWeeks: 6,
    enrolledStudents: 2180,
    rating: 4.95,
    description: 'Build enterprise-grade LLM applications using Python, FastAPI, LangChain, Vector Databases (Pinecone/Chroma), and prompt injection defense.',
    skillsEarned: ['Python', 'FastAPI', 'PyTorch', 'Vector DB', 'RAG Pipelines', 'Prompt Engineering'],
    modules: [
      {
        id: 'g-1',
        title: 'Foundations of Modern LLMs & Prompt Architecture',
        duration: '3h 45m',
        lessonsCount: 5,
        completed: true,
        nepCredits: 1,
        description: 'Transformer architecture overview, tokenization mechanics, few-shot prompt crafting, and context window optimizations.',
        lessons: [
          'Transformer Self-Attention Mechanisms',
          'Context Windows, System Prompts & Instruction Tuning',
          'Few-Shot & Chain-of-Thought Prompt Engineering',
          'PII Masking & DPDP Act Compliance in AI Systems',
          'Interactive Laboratory: Crafting Structured Outputs'
        ]
      },
      {
        id: 'g-2',
        title: 'Retrieval-Augmented Generation (RAG) Architecture',
        duration: '6h 00m',
        lessonsCount: 8,
        completed: false,
        nepCredits: 1,
        description: 'Vector embeddings, chunking strategies, cosine similarity retrieval, and reranking pipelines.',
        lessons: [
          'Text Chunking: Semantic vs Fixed Boundary',
          'Embedding Models: BERT, SentenceTransformers, OpenAI',
          'Vector Indexing Algorithms: HNSW & IVF',
          'Building ChromaDB & Pinecone Vector Store Pipelines',
          'Hybrid Search: BM25 Keyword + Dense Vector',
          'Cross-Encoder Reranking for Precision Retrieval',
          'Evaluating RAG with RAGAS Metric Framework',
          'Capstone: Multi-Document AI Knowledge Engine'
        ]
      },
      {
        id: 'g-3',
        title: 'Production FastAPI Microservices for AI Engines',
        duration: '5h 15m',
        lessonsCount: 6,
        completed: false,
        nepCredits: 1,
        description: 'Async Python concurrency, SSE streaming endpoints, rate limiting, and defensive middleware.',
        lessons: [
          'Async / Await Architecture in Python 3.13',
          'Pydantic V2 Request & Response Data Contracts',
          'Server-Sent Events (SSE) for Real-Time Streaming',
          'Prompt Injection Firewall & Adversarial Filtering',
          'Uvicorn & Gunicorn Production Tuning',
          'Hands-on: Deploying Copilot AI Microservice'
        ]
      },
      {
        id: 'g-4',
        title: 'Autonomous Agents & Multi-Agent Orchestration',
        duration: '4h 30m',
        lessonsCount: 5,
        completed: false,
        nepCredits: 1,
        description: 'Building tool-calling autonomous agents, memory buffers, and multi-agent coordination loops.',
        lessons: [
          'ReAct Agent Framework & Function Calling',
          'Conversation Memory: Short-Term vs Episodic',
          'Tool Integration: SQL execution, Web Search, PDF Parsing',
          'Multi-Agent Collaboration Loops',
          'Final Project: Autonomous Career Mentor Agent'
        ]
      }
    ]
  },
  {
    id: 'track-fullstack',
    title: 'Full-Stack Modern Web & React 19 Ecosystem',
    category: 'FULLSTACK',
    level: 'INTERMEDIATE',
    nepTotalCredits: 3,
    progress: 80,
    durationWeeks: 6,
    enrolledStudents: 1850,
    rating: 4.88,
    description: 'Master modern frontend systems using React 19, TypeScript 5, Vite, Tailwind CSS, Zustand state management, and Framer Motion micro-animations.',
    skillsEarned: ['React 19', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'REST Integration'],
    modules: [
      {
        id: 'f-1',
        title: 'React 19 Server Components & Actions',
        duration: '4h 00m',
        lessonsCount: 6,
        completed: true,
        nepCredits: 1,
        description: 'React 19 hooks, useActionState, useOptimistic, server components, and performance optimizations.',
        lessons: [
          'React 19 Compiler & Architecture Overview',
          'Form Actions & useActionState Hook',
          'useOptimistic for Instant UI Feedback',
          'React Suspense & Streaming Boundaries',
          'Memoization Best Practices with Modern Bundlers',
          'Lab: Building an Optimistic ATS Candidate Card'
        ]
      },
      {
        id: 'f-2',
        title: 'Strict TypeScript & Architectural State Management',
        duration: '5h 00m',
        lessonsCount: 7,
        completed: true,
        nepCredits: 1,
        description: 'TypeScript generics, verbatimModuleSyntax, Zustand stores with persistence, and Axios interceptors.',
        lessons: [
          'TypeScript Discriminated Unions & Generics',
          'verbatimModuleSyntax and Clean Build Configs',
          'Zustand Global State Stores with LocalStorage Middleware',
          'Axios Auth Interceptors & Request Traceability',
          'Error Boundary & Global Safe Notification Handling',
          'Client Performance: Code Splitting & Dynamic Imports',
          'Capstone: Reactive Multi-Tier State Synchronizer'
        ]
      },
      {
        id: 'f-3',
        title: 'Design Systems & Dynamic Framer Motion Aesthetics',
        duration: '4h 30m',
        lessonsCount: 5,
        completed: false,
        nepCredits: 1,
        description: 'HSL semantic color tokens, responsive glassmorphism layouts, micro-animations, and accessibility.',
        lessons: [
          'Building Design Systems with HSL Semantic Tokens',
          'Dark Mode Architecture without Flash of Unstyled Content',
          'Framer Motion Staggered Transitions & Layout Animations',
          'WCAG 2.1 AA Accessibility Standards & Keyboard Nav',
          'Final Project: Production-Ready SaaS Dashboard'
        ]
      }
    ]
  }
]

export default function StudentLearning() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTrack, setActiveTrack] = useState<Track>(tracksData[0])
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null)
  const [lessonModalOpen, setLessonModalOpen] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)

  const filteredTracks = tracksData.filter((track) => {
    const matchesCategory = selectedCategory === 'ALL' || track.category === selectedCategory
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.skillsEarned.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleOpenModule = (mod: CourseModule) => {
    setActiveModule(mod)
    setLessonModalOpen(true)
    setQuizScore(null)
  }

  const handleCompleteLesson = () => {
    setQuizScore(100)
    toast.success(`Module verified! Earned ${activeModule?.nepCredits} NEP Academic Credit!`)
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              NEP 2020 Aligned
            </span>
            <span className="text-xs text-slate-400">• Up to 14 Academic Internship Credits</span>
          </div>
          <h1 className="text-2xl font-bold font-display mt-1" style={{ color: 'var(--text-primary)' }}>
            Skill Learning & Certification Roadmaps
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Industry-vetted curriculum pathways with interactive modules, hands-on projects, and verifiable credentials.
          </p>
        </div>

        {/* NEP Credits Progress Widget */}
        <div className="p-4 rounded-2xl border flex items-center gap-4 flex-shrink-0 shadow-sm"
             style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-emerald-600">8 / 14</span>
              <span className="text-xs text-slate-400 font-medium">NEP Credits Earned</span>
            </div>
            <p className="text-[11px] text-slate-500">6 credits remaining for mandatory semester requirement</p>
          </div>
        </div>
      </motion.div>

      {/* Filter & Search Bar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-slate-100 dark:bg-slate-800 w-full sm:w-auto" style={{ borderColor: 'var(--border-default)' }}>
          {['ALL', 'BACKEND', 'GENAI', 'FULLSTACK'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-white shadow text-blue-600 dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Roadmaps' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, roadmaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          />
        </div>
      </motion.div>

      {/* Main Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1/3: Available Tracks List */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider px-1">Active Roadmaps ({filteredTracks.length})</h3>
          {filteredTracks.map((track) => {
            const isSelected = activeTrack.id === track.id
            return (
              <motion.div
                key={track.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTrack(track)}
                className={`p-4 rounded-2xl border cursor-pointer transition shadow-sm ${
                  isSelected ? 'ring-2 ring-blue-500' : 'hover:border-blue-300'
                }`}
                style={{
                  background: isSelected ? 'var(--surface-card)' : 'var(--surface-card)',
                  borderColor: isSelected ? 'var(--color-brand-500)' : 'var(--border-light)'
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {track.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-current" /> {track.rating}
                  </div>
                </div>

                <h4 className="font-bold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {track.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {track.durationWeeks} weeks</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-emerald-500" /> {track.nepTotalCredits} NEP Credits</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Curriculum Progress</span>
                    <span className="font-bold text-blue-600">{track.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${track.progress}%` }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Right 2/3: Selected Roadmap Deep Dive & Module List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border shadow-sm" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{activeTrack.category} ROADMAP</span>
                <h2 className="text-xl font-bold font-display mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {activeTrack.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {activeTrack.nepTotalCredits} NEP Credits
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 my-4">
              {activeTrack.description}
            </p>

            {/* Skills You Will Master */}
            <div className="mb-5">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Verified Competencies Unlocked:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeTrack.skillsEarned.map((skill) => (
                  <span key={skill} className="text-xs font-medium px-2.5 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800/60" style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
                    <Check className="w-3 h-3 text-emerald-500 inline mr-1" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Modules List */}
            <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Curriculum Modules ({activeTrack.modules.length})
            </h3>

            <div className="space-y-3">
              {activeTrack.modules.map((mod, index) => (
                <div
                  key={mod.id}
                  onClick={() => handleOpenModule(mod)}
                  className="p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      mod.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {mod.completed ? <Check className="w-4 h-4" /> : `0${index + 1}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {mod.title}
                        </h4>
                        {mod.completed && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {mod.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mod.duration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {mod.lessonsCount} lessons</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">+{mod.nepCredits} Academic Credit</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 transition flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson / Module Modal Dialog */}
      <AnimatePresence>
        {lessonModalOpen && activeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setLessonModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 z-10 space-y-5"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    +{activeModule.nepCredits} NEP Credit Module
                  </span>
                  <h3 className="font-bold font-display text-lg mt-1" style={{ color: 'var(--text-primary)' }}>
                    {activeModule.title}
                  </h3>
                </div>
                <button
                  onClick={() => setLessonModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-slate-500 leading-relaxed">{activeModule.description}</p>

                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Interactive Syllabus & Hands-On Exercises
                </h4>

                <div className="space-y-2">
                  {activeModule.lessons.map((lesson, idx) => (
                    <div
                      key={lesson}
                      className="p-3 rounded-xl border flex items-center justify-between gap-2"
                      style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <PlayCircle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {idx + 1}. {lesson}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">15 mins</span>
                    </div>
                  ))}
                </div>

                {/* Verification Sandbox Check */}
                <div className="p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 dark:text-white">Module Comprehension & NEP Credit Check</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    Submit the module code assessment to earn your cryptographic badge and verify academic internship credits.
                  </p>

                  {quizScore ? (
                    <div className="p-3 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Module Passed with 100% Score! 1 NEP Credit added to Career Passport.
                    </div>
                  ) : (
                    <button
                      onClick={handleCompleteLesson}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-brand transition shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Submit & Claim Academic Credit
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
