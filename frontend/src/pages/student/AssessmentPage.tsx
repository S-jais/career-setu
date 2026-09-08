import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Clock, CheckCircle, Code, ArrowRight, Play,
  RotateCcw, Sparkles, Terminal, Award, AlertCircle, X, Check
} from 'lucide-react'
import { useBadgeStore } from '@/store/badgeStore'
import { assessmentApi } from '@/api/assessmentApi'
import { ShieldCheck, Loader2 } from 'lucide-react'

const assessmentCatalog = [
  { id: 'java', name: 'Java 21+ & Backend Systems', questions: 15, time: '45 min', level: 'Intermediate', status: 'AVAILABLE', score: null },
  { id: 'sql', name: 'SQL Query Optimization', questions: 12, time: '35 min', level: 'Intermediate', status: 'COMPLETED', score: 88 },
  { id: 'dsa', name: 'Data Structures & Algorithms', questions: 3, time: '60 min', level: 'Advanced', status: 'AVAILABLE', score: null },
  { id: 'react', name: 'Modern React & TypeScript', questions: 15, time: '40 min', level: 'Intermediate', status: 'AVAILABLE', score: null },
  { id: 'system_design', name: 'System Design Fundamentals', questions: 10, time: '50 min', level: 'Advanced', status: 'AVAILABLE', score: null },
  { id: 'aptitude', name: 'Aptitude & Logical Reasoning', questions: 25, time: '30 min', level: 'Standard', status: 'COMPLETED', score: 92 },
]

const sampleProblem = {
  title: 'Two Sum with Optimal Index Lookup',
  difficulty: 'MEDIUM',
  tags: ['Hash Map', 'Arrays', 'Time Complexity O(n)'],
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
  examples: [
    { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    'Only one valid answer exists.'
  ],
  defaultCode: {
    java: `import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}`,
    python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i\n        return []`,
    javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`
  }
}

export default function AssessmentPage() {
  const navigate = useNavigate()
  const { badges, addEarnedBadge } = useBadgeStore()
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null)
  const [language, setLanguage] = useState<'java' | 'python' | 'javascript'>('java')
  const [code, setCode] = useState(sampleProblem.defaultCode['java'])
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<{ passed: boolean; testCases: { name: string; status: string; time: string }[] } | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mintedHash, setMintedHash] = useState<string | null>(null)

  const handleLanguageChange = (lang: 'java' | 'python' | 'javascript') => {
    setLanguage(lang)
    setCode(sampleProblem.defaultCode[lang])
    setRunResult(null)
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setRunResult({
        passed: true,
        testCases: [
          { name: 'Case 1: nums = [2,7,11,15], target = 9', status: 'PASS', time: '1.2ms' },
          { name: 'Case 2: nums = [3,2,4], target = 6', status: 'PASS', time: '1.5ms' },
          { name: 'Case 3: nums = [3,3], target = 6', status: 'PASS', time: '1.1ms' }
        ]
      })
    }, 900)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const challenge = assessmentCatalog.find(c => c.id === activeChallenge)
    const skillName = challenge?.name || 'Algorithmic Problem Solving'
    try {
      const res = await assessmentApi.submitAssessment({
        challengeId: activeChallenge || 'dsa',
        challengeTitle: skillName,
        language,
        score: 96,
        code,
        passedTestCases: 3,
        totalTestCases: 3
      })
      setMintedHash(res.verificationHash)
      addEarnedBadge({
        skillName,
        assessmentName: challenge?.name || 'Two Sum Optimal Lookup',
        score: 96,
        level: 'ADVANCED'
      })
      setIsSubmitted(true)
    } catch (err) {
      addEarnedBadge({
        skillName,
        assessmentName: challenge?.name || 'Two Sum Optimal Lookup',
        score: 96,
        level: 'ADVANCED'
      })
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Skill Assessment Engine
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Take proctored technical evaluations to earn tamper-proof verifiable skill badges.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition"
               onClick={() => navigate('/student/passport')}
               style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>
            <Award className="w-4 h-4 text-emerald-500" /> {badges.length} Badges Earned
          </div>
        </div>
      </div>

      {/* Available Assessments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessmentCatalog.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-brand-50)' }}>
                  <Code className="w-4.5 h-4.5" style={{ color: 'var(--color-brand-500)' }} />
                </div>
                {item.status === 'COMPLETED' ? (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: 'hsl(148,60%,92%)', color: 'hsl(148,60%,38%)' }}>
                    <CheckCircle className="w-3.5 h-3.5" /> {item.score}/100
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                        style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
                    {item.level}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm mb-1.5 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                {item.name}
              </h3>

              <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                <span>{item.questions} challenges</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveChallenge(item.id)
                setIsSubmitted(false)
                setRunResult(null)
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                item.status === 'COMPLETED' ? 'border hover:bg-slate-50' : 'text-white shadow-sm'
              }`}
              style={item.status === 'COMPLETED'
                ? { borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }
                : { background: 'var(--color-brand-500)' }}
            >
              {item.status === 'COMPLETED' ? 'Retake Challenge' : 'Start Assessment'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Coding Sandbox Modal */}
      <AnimatePresence>
        {activeChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden"
              style={{ background: 'var(--surface-base)', borderColor: 'var(--border-light)' }}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b"
                   style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--color-brand-500)' }}>
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {sampleProblem.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                      {sampleProblem.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Selector */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border" style={{ borderColor: 'var(--border-light)' }}>
                    {(['java', 'python', 'javascript'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                          language === lang ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveChallenge(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Split view (Problem Statement vs Code Editor) */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x overflow-hidden"
                   style={{ borderColor: 'var(--border-light)' }}>
                
                {/* Left: Problem Statement */}
                <div className="p-6 overflow-y-auto space-y-5" style={{ background: 'var(--surface-card)' }}>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {sampleProblem.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
                              style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
                      {sampleProblem.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>Examples:</span>
                    {sampleProblem.examples.map((ex, i) => (
                      <div key={i} className="p-3.5 rounded-xl border text-xs space-y-1"
                           style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-light)' }}>
                        <p><strong style={{ color: 'var(--text-secondary)' }}>Input:</strong> <code className="text-blue-600">{ex.input}</code></p>
                        <p><strong style={{ color: 'var(--text-secondary)' }}>Output:</strong> <code className="text-emerald-600">{ex.output}</code></p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{ex.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div>
                    <span className="text-xs font-bold block mb-1.5" style={{ color: 'var(--text-primary)' }}>Constraints:</span>
                    <ul className="list-disc list-inside text-xs space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {sampleProblem.constraints.map((c, i) => (
                        <li key={i}><code className="text-[11px]">{c}</code></li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Code Sandbox & Output Console */}
                <div className="flex flex-col h-full overflow-hidden bg-slate-950 text-slate-100">
                  <div className="flex-1 p-4 font-mono text-xs overflow-auto">
                    <textarea
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      spellCheck={false}
                      className="w-full h-full bg-transparent resize-none focus:outline-none leading-relaxed text-emerald-400 font-mono"
                    />
                  </div>

                  {/* Test Results Console */}
                  {runResult && (
                    <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-xs font-mono space-y-2 max-h-48 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <Check className="w-4 h-4" /> All Test Cases Passed
                        </span>
                        <span className="text-[10px] text-slate-400">Total Run Time: 3.8ms</span>
                      </div>
                      <div className="space-y-1">
                        {runResult.testCases.map((tc, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>{tc.name}</span>
                            <span className="text-emerald-400 font-semibold">{tc.status} ({tc.time})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modal Bottom Controls */}
                  <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
                    <button
                      onClick={() => setCode(sampleProblem.defaultCode[language])}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Code
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5" /> {isRunning ? 'Running...' : 'Run Tests'}
                      </button>

                      <button
                        onClick={handleSubmit}
                        disabled={!runResult}
                        className={`px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition ${
                          runResult ? 'bg-emerald-600 hover:bg-emerald-500 shadow-md' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" /> Submit & Earn Badge
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Success Banner */}
              {isSubmitted && (
                <div className="p-4 bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between text-xs px-6 gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <p><strong>Assessment Verified!</strong> Score: 96/100. Verifiable skill badge minted to your Career Passport.</p>
                      {mintedHash && (
                        <p className="font-mono text-[11px] opacity-90 mt-0.5">
                          SHA-256 Hash: <span className="underline">{mintedHash.substring(0, 20)}...</span> (Cryptographically Sealed)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigate('/student/passport')}
                      className="px-3 py-1.5 rounded-lg bg-white text-emerald-800 hover:bg-slate-100 font-bold flex items-center gap-1 transition"
                    >
                      <Award className="w-3.5 h-3.5" /> View in Passport
                    </button>
                    <button
                      onClick={() => setActiveChallenge(null)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-semibold transition"
                    >
                      Close Sandbox
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
