import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Minus, Send, Trash2, Brain, ArrowRight, Sparkles,
  BookOpen, Search, Target, BarChart3, Layers, ChevronRight,
  AlertTriangle, Lightbulb, Maximize2, Minimize2
} from 'lucide-react'
import { aiApi, isAllowedRoute } from '@/api/aiApi'
import type { AssistantResponseBlock, AssistantResponse } from '@/api/aiApi'

// ── Types ─────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content?: string
  blocks?: AssistantResponseBlock[]
  suggestedPrompts?: string[]
  timestamp: Date
}

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  userRole: string
  userName: string
  currentRoute: string
  currentPageName?: string
  initialContextMessage?: string
}

// ── Quick prompt configs by role ──────────────────────────────

const QUICK_PROMPTS: Record<string, Array<{ text: string; icon: typeof Sparkles }>> = {
  STUDENT: [
    { text: 'How do I use Career Setu?', icon: Sparkles },
    { text: 'Build my Career Passport', icon: Layers },
    { text: 'Find opportunities', icon: Search },
    { text: 'Check my skill gaps', icon: Target },
    { text: 'Take a skill assessment', icon: BarChart3 },
    { text: 'Find a mentor', icon: BookOpen },
    { text: 'Track my applications', icon: ChevronRight },
    { text: 'Explain Career Digital Twin', icon: Brain },
  ],
  EMPLOYER: [
    { text: 'How do I post a job?', icon: Sparkles },
    { text: 'View my applicants', icon: Search },
    { text: 'Schedule an interview', icon: Target },
    { text: 'Check hiring analytics', icon: BarChart3 },
    { text: 'Manage company profile', icon: Layers },
  ],
  TPO: [
    { text: 'View student directory', icon: Search },
    { text: 'Create a placement drive', icon: Target },
    { text: 'Check student skill gaps', icon: BarChart3 },
  ],
}

// ── Home state cards ──────────────────────────────────────────

const HOME_CARDS = [
  { title: 'Explore Career Setu', prompt: 'What can I do on Career Setu?', icon: Sparkles, color: 'from-blue-500 to-indigo-600' },
  { title: 'Skill Intelligence', prompt: 'How can I improve my skills?', icon: Target, color: 'from-emerald-500 to-teal-600' },
  { title: 'Opportunities', prompt: 'How do I find internships?', icon: Search, color: 'from-amber-500 to-orange-600' },
  { title: 'Career Digital Twin', prompt: 'What is my Career Digital Twin?', icon: Brain, color: 'from-purple-500 to-violet-600' },
  { title: 'Applications', prompt: 'How do I track my applications?', icon: BarChart3, color: 'from-rose-500 to-pink-600' },
]

// ── Simple markdown renderer ─────────────────────────────────

function renderMarkdown(text: string): string {
  let html = text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Unordered lists
    .replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>')
    // Numbered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  // Paragraphs: split by double newlines
  html = html
    .split(/\n\n+/)
    .map(block => {
      block = block.trim()
      if (!block || block.startsWith('<ul>') || block.startsWith('<ol>')) return block
      return `<p>${block}</p>`
    })
    .join('')

  // Single newlines within paragraphs
  html = html.replace(/(?<!\n)\n(?!\n)/g, '<br/>')

  return html
}

// ── Component ─────────────────────────────────────────────────

export default function AIAssistantPanel({
  isOpen,
  onClose,
  userRole,
  userName,
  currentRoute,
  currentPageName,
  initialContextMessage,
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Handle initial context message
  useEffect(() => {
    if (isOpen && initialContextMessage && messages.length === 0) {
      sendMessage(initialContextMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialContextMessage])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const history = messages.slice(-8).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content || m.blocks?.find(b => b.type === 'TEXT')?.content || '',
      }))
      history.push({ role: 'user', content: text })

      const response: AssistantResponse = await aiApi.chatAssistant({
        messages: history,
        user_role: userRole,
        current_route: currentRoute,
        current_page_name: currentPageName,
      })

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        blocks: response.blocks,
        suggestedPrompts: response.suggested_prompts,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      // Error state — provide fallback navigation
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        blocks: [
          {
            type: 'WARNING',
            content: 'Career Setu AI is temporarily unavailable. You can still navigate Career Setu using the menu or the buttons below.',
          },
          { type: 'NAVIGATE', route: '/student/overview', label: 'Open Dashboard' },
          { type: 'NAVIGATE', route: '/student/opportunities', label: 'Browse Opportunities' },
          { type: 'NAVIGATE', route: '/student/passport', label: 'Career Passport' },
        ],
        suggestedPrompts: [],
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigate = (route: string) => {
    if (isAllowedRoute(route)) {
      navigate(route)
      onClose()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const rolePrompts = QUICK_PROMPTS[userRole.toUpperCase()] || QUICK_PROMPTS.STUDENT

  // Panel sizing
  const panelClasses = isMaximized
    ? 'fixed inset-4 z-[70] sm:inset-6'
    : 'fixed bottom-0 right-0 z-[70] w-full h-full sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[620px] sm:rounded-[3px]'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-[var(--ink)]/40 backdrop-blur-xs sm:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`${panelClasses} flex flex-col overflow-hidden border border-[var(--line)] shadow-lg rounded-[3px]`}
            style={{
              background: 'var(--paper)',
            }}
            role="dialog"
            aria-label="Career Setu AI Assistant"
          >
            {/* ── Header ──────────────────────────────────── */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-[var(--line)] bg-[var(--mist-dim)]/60 flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-[3px] bg-[var(--paper)] p-0.5 border border-[var(--line)] flex items-center justify-center shrink-0">
                <Brain className="w-4.5 h-4.5 text-[var(--ink)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium font-display text-[var(--ink)] tracking-tight">
                  CareerSetu AI
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    Your intelligent Career Setu guide
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: 'var(--text-muted)' }}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="hidden sm:block p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: 'var(--text-muted)' }}
                  title={isMaximized ? 'Minimize' : 'Maximize'}
                  aria-label={isMaximized ? 'Minimize' : 'Maximize'}
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: 'var(--text-muted)' }}
                  title="Close"
                  aria-label="Close AI Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages area ───────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                /* ── Home state ────────────────────────── */
                <div className="space-y-4">
                  {/* Welcome */}
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-[3px] bg-[var(--ink)] flex items-center justify-center text-[var(--paper)] mx-auto mb-3 shadow-xs">
                      <Brain className="w-6 h-6 text-[var(--marigold)]" />
                    </div>
                    <h3 className="text-base font-medium font-display text-[var(--ink)]">
                      Hi{userName ? `, ${userName}` : ''}! 👋
                    </h3>
                    <p className="text-xs mt-1 max-w-xs mx-auto text-[var(--slate)] opacity-85 leading-relaxed">
                      I'm your Career Setu guide. I can help you understand the platform, find features, navigate your career journey, and answer questions about your profile.
                    </p>
                  </div>

                  {/* Feature cards */}
                  <div className="grid grid-cols-2 gap-2">
                    {HOME_CARDS.map(card => (
                      <button
                        key={card.title}
                        onClick={() => sendMessage(card.prompt)}
                        className="text-left p-3 rounded-[3px] border border-[var(--line)] bg-[var(--paper)] transition-colors hover:border-[var(--ink)] group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-[3px] bg-[var(--ink)] flex items-center justify-center text-[var(--marigold)] mb-2">
                          <card.icon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs font-semibold text-[var(--ink)]">
                          {card.title}
                        </p>
                        <p className="text-[10px] mt-0.5 line-clamp-1 text-[var(--slate)] opacity-70">
                          &ldquo;{card.prompt}&rdquo;
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Quick prompts */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Try asking…
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {rolePrompts.slice(0, 6).map(prompt => (
                        <button
                          key={prompt.text}
                          onClick={() => sendMessage(prompt.text)}
                          className="text-[11px] px-2.5 py-1.5 rounded-lg border transition-all hover:border-brand-300 hover:bg-brand-50/50 font-medium"
                          style={{
                            background: 'var(--surface-inset)',
                            borderColor: 'var(--border-light)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {prompt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Message list ──────────────────────── */
                <>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                          <Brain className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className={`max-w-[85%] ${msg.role === 'user' ? '' : ''}`}>
                        {msg.role === 'user' ? (
                          /* User message */
                          <div
                            className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-sm"
                            style={{ background: 'var(--color-brand-500)', color: 'white' }}
                          >
                            {msg.content}
                          </div>
                        ) : (
                          /* AI message — render structured blocks */
                          <div className="space-y-2">
                            {msg.blocks?.map((block, idx) => (
                              <div key={idx}>
                                {block.type === 'TEXT' && block.content && (
                                  <div
                                    className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed ai-markdown"
                                    style={{
                                      background: 'var(--surface-inset)',
                                      color: 'var(--text-primary)',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }}
                                  />
                                )}

                                {block.type === 'WARNING' && block.content && (
                                  <div
                                    className="px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed flex items-start gap-2 border"
                                    style={{
                                      background: 'hsl(38, 100%, 97%)',
                                      borderColor: 'hsl(38, 80%, 80%)',
                                      color: 'hsl(38, 60%, 30%)',
                                    }}
                                  >
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                                    <span>{block.content}</span>
                                  </div>
                                )}

                                {block.type === 'TIP' && block.content && (
                                  <div
                                    className="px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed flex items-start gap-2 border"
                                    style={{
                                      background: 'hsl(210, 100%, 97%)',
                                      borderColor: 'hsl(210, 80%, 85%)',
                                      color: 'hsl(210, 50%, 30%)',
                                    }}
                                  >
                                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                                    <span>{block.content}</span>
                                  </div>
                                )}

                                {block.type === 'NAVIGATE' && block.route && block.label && (
                                  <button
                                    onClick={() => handleNavigate(block.route!)}
                                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all
                                      border hover:shadow-md hover:-translate-y-0.5 group w-full text-left"
                                    style={{
                                      background: 'var(--surface-card)',
                                      borderColor: 'var(--color-brand-200)',
                                      color: 'var(--color-brand-600)',
                                    }}
                                  >
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                    <span>{block.label}</span>
                                    <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
                                  </button>
                                )}

                                {block.type === 'STEP_LIST' && block.steps && (
                                  <div
                                    className="px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed"
                                    style={{ background: 'var(--surface-inset)', color: 'var(--text-primary)' }}
                                  >
                                    {block.content && (
                                      <p className="font-semibold mb-1.5">{block.content}</p>
                                    )}
                                    <ol className="list-decimal list-inside space-y-1">
                                      {block.steps.map((step, si) => (
                                        <li key={si}>{step}</li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Suggested prompt chips */}
                            {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {msg.suggestedPrompts.map(prompt => (
                                  <button
                                    key={prompt}
                                    onClick={() => sendMessage(prompt)}
                                    className="text-[10px] px-2 py-1 rounded-lg border transition-all
                                      hover:border-brand-300 hover:bg-brand-50/50 font-medium"
                                    style={{
                                      background: 'var(--surface-card)',
                                      borderColor: 'var(--border-light)',
                                      color: 'var(--text-secondary)',
                                    }}
                                  >
                                    {prompt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-[9px] mt-0.5 px-1" style={{ color: 'var(--text-muted)' }}>
                          {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Thinking indicator */}
                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white flex-shrink-0">
                        <Brain className="w-3.5 h-3.5" />
                      </div>
                      <div
                        className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2"
                        style={{ background: 'var(--surface-inset)' }}
                      >
                        <span className="ai-thinking-dots flex items-center gap-1">
                          <span /><span /><span />
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          Career Setu AI is thinking…
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input area ──────────────────────────────── */}
            <div className="border-t border-[var(--line)] p-3 flex-shrink-0 bg-[var(--paper)]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(input)
                    }
                  }}
                  placeholder="Ask Career Setu AI anything…"
                  className="flex-1 px-3 py-2 rounded-[3px] border border-[var(--line)] bg-[var(--mist-dim)]/50 text-xs sm:text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--ink)]"
                  disabled={isLoading}
                  aria-label="Type your question"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="px-3 py-2 rounded-[3px] font-semibold text-[var(--paper)] bg-[var(--ink)] hover:bg-[var(--ink-soft)]
                    disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 text-[var(--marigold)]" />
                </button>
              </div>
              {currentPageName && (
                <p className="text-[10px] mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
                  Context: {currentPageName}
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
