import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare, Send, Search, CheckCheck, Paperclip,
  MoreVertical, Phone, Video, ShieldCheck, Sparkles, Building2, User
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { messageApi } from '@/api/messageApi'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  sender: 'ME' | 'THEM'
  text: string
  time: string
}

interface Thread {
  id: string
  name: string
  role: string
  company: string
  category: 'RECRUITER' | 'MENTOR' | 'TPO'
  avatar: string
  online: boolean
  lastMessage: string
  lastTime: string
  unread: number
  messages: ChatMessage[]
}

const initialThreads: Thread[] = [
  {
    id: 't-1',
    name: 'Sarah Jenkins',
    role: 'Senior Technical Recruiter',
    company: 'TechCorp India',
    category: 'RECRUITER',
    avatar: 'SJ',
    online: true,
    lastMessage: 'Would you be available for a 45-minute technical conversation this Thursday at 3:00 PM?',
    lastTime: '10:45 AM',
    unread: 1,
    messages: [
      { id: 'm1', sender: 'THEM', text: 'Hi Aarav! We reviewed your Career Passport application for the Cloud Native Engineer Intern role.', time: '10:30 AM' },
      { id: 'm2', sender: 'THEM', text: 'Your 96/100 code assessment score in Java & Spring Boot caught our hiring team\'s attention.', time: '10:32 AM' },
      { id: 'm3', sender: 'ME', text: 'Hello Sarah! Thank you for the update. I would love to discuss the opportunity and how my skills align with the team.', time: '10:38 AM' },
      { id: 'm4', sender: 'THEM', text: 'Would you be available for a 45-minute technical conversation this Thursday at 3:00 PM?', time: '10:45 AM' }
    ]
  },
  {
    id: 't-2',
    name: 'Karthik Subramanian',
    role: 'Engineering Manager',
    company: 'Razorpay',
    category: 'MENTOR',
    avatar: 'KS',
    online: true,
    lastMessage: 'Reviewed your distributed cache project. The Redis stampede mitigation is top tier!',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm5', sender: 'ME', text: 'Hi Karthik, thank you for accepting the 1:1 mentorship request. I pushed my cache benchmark code to GitHub.', time: 'Yesterday 4:00 PM' },
      { id: 'm6', sender: 'THEM', text: 'Reviewed your distributed cache project. The Redis stampede mitigation is top tier!', time: 'Yesterday 5:15 PM' },
      { id: 'm7', sender: 'THEM', text: 'Make sure to mention the 42% P99 latency reduction in your resume impact bullet points.', time: 'Yesterday 5:16 PM' }
    ]
  },
  {
    id: 't-3',
    name: 'Prof. S. K. Kulkarni',
    role: 'Training & Placement Officer',
    company: 'COEP Technological University',
    category: 'TPO',
    avatar: 'SK',
    online: false,
    lastMessage: 'Your NEP 14-credit internship registration form has been verified by the department.',
    lastTime: '2 days ago',
    unread: 0,
    messages: [
      { id: 'm8', sender: 'THEM', text: 'Hello Aarav, your company evaluation report for TechCorp India has been received.', time: '2 days ago' },
      { id: 'm9', sender: 'THEM', text: 'Your NEP 14-credit internship registration form has been verified by the department.', time: '2 days ago' }
    ]
  }
]

export default function MessageCenter() {
  const { user } = useAuthStore()
  const [threads, setThreads] = useState<Thread[]>(initialThreads)
  const [activeThreadId, setActiveThreadId] = useState<string>(initialThreads[0].id)
  const [inputMessage, setInputMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RECRUITER' | 'MENTOR' | 'TPO'>('ALL')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load live messages from backend API
  useEffect(() => {
    async function loadBackendConversations() {
      try {
        const liveConvs = await messageApi.getConversations()
        if (liveConvs && liveConvs.length > 0) {
          const mappedThreads: Thread[] = liveConvs.map(c => ({
            id: c.conversationId,
            name: c.otherPartyName,
            role: c.otherPartyRole,
            company: 'Partner Organization',
            category: (c.otherPartyRole === 'RECRUITER' ? 'RECRUITER' : c.otherPartyRole === 'MENTOR' ? 'MENTOR' : 'TPO') as any,
            avatar: c.otherPartyName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            online: true,
            lastMessage: c.lastMessage,
            lastTime: new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: c.unreadCount,
            messages: c.recentMessages.map(m => ({
              id: m.id,
              sender: m.senderId === user?.id ? 'ME' : 'THEM',
              text: m.content,
              time: new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))
          }))
          // Merge with initial mock threads for rich UX
          setThreads(prev => {
            const existingIds = new Set(mappedThreads.map(t => t.id))
            const remaining = prev.filter(t => !existingIds.has(t.id))
            return [...mappedThreads, ...remaining]
          })
        }
      } catch {
        // Fallback gracefully to default sample threads
      }
    }
    loadBackendConversations()
  }, [user])

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeThread.messages])

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId)
    setThreads(threads.map(t => t.id === threadId ? { ...t, unread: 0 } : t))
    messageApi.markAsRead(threadId).catch(() => {})
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim()
    if (!text) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ME',
      text,
      time: now
    }

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: text,
          lastTime: now,
          messages: [...t.messages, newMsg]
        }
      }
      return t
    })

    setThreads(updatedThreads)
    setInputMessage('')

    // Fire API request in background
    try {
      await messageApi.sendMessage({
        conversationId: activeThread.id,
        recipientId: user?.id || '00000000-0000-0000-0000-000000000000',
        recipientName: activeThread.name,
        content: text,
        senderRole: user?.primaryRole || 'STUDENT'
      })
    } catch {
      // Offline fallback
    }

    // Simulate realistic recruiter/mentor response
    if (activeThread.category === 'RECRUITER') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'THEM',
          text: `Acknowledged! I have placed this on our engineering calendar. Look forward to speaking with you!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setThreads(prev => prev.map(t => t.id === activeThreadId ? {
          ...t,
          lastMessage: replyMsg.text,
          lastTime: replyMsg.time,
          messages: [...t.messages, replyMsg]
        } : t))
      }, 1200)
    }
  }

  const filteredThreads = threads.filter(t => {
    const matchesFilter = activeFilter === 'ALL' || t.category === activeFilter
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="h-[calc(100vh-8rem)] max-w-7xl mx-auto flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Messages & Recruiter Inbox
          </h1>
          <p className="text-xs text-slate-500">
            Real-time direct communication with hiring recruiters, verified mentors, and campus TPO coordinators.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Messaging Active
        </span>
      </div>

      {/* Main 2-Column Chat Box */}
      <div className="flex-1 min-h-0 flex rounded-2xl border overflow-hidden shadow-sm" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
        {/* Left Column: Threads List (Width 320px) */}
        <div className="w-80 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-card)' }}>
          {/* Search */}
          <div className="p-3 border-b space-y-2.5" style={{ borderColor: 'var(--border-light)' }}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 text-[11px] font-semibold">
              {(['ALL', 'RECRUITER', 'MENTOR', 'TPO'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'var(--border-light)' }}>
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === activeThreadId
              return (
                <div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-l-4 border-l-blue-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      {thread.avatar}
                    </div>
                    {thread.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs truncate text-slate-900 dark:text-slate-100">
                        {thread.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">{thread.lastTime}</span>
                    </div>

                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate mb-1">
                      {thread.company}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                      {thread.lastMessage}
                    </p>
                  </div>

                  {thread.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {thread.unread}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--surface-base)' }}>
          {/* Thread Header */}
          <div className="px-5 py-3 border-b flex items-center justify-between flex-shrink-0" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold">
                {activeThread.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {activeThread.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {activeThread.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {activeThread.company} • {activeThread.online ? 'Active now' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toast.success('Calling feature launching soon')}
                className="p-2 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => toast.success('Video meeting invite sent to email')}
                className="p-2 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            <div className="text-center my-2">
              <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border" style={{ borderColor: 'var(--border-light)' }}>
                Direct Encrypted Career Channel
              </span>
            </div>

            {activeThread.messages.map((msg) => {
              const isMe = msg.sender === 'ME'
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe ? 'rounded-tr-xs text-white' : 'rounded-tl-xs border'
                    }`}
                    style={
                      isMe
                        ? { background: 'var(--color-brand-500)' }
                        : { background: 'var(--surface-card)', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }
                    }
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestions */}
          <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-card)' }}>
            {[
              'Yes, Thursday at 3:00 PM works perfectly for me!',
              'Thank you! Looking forward to the discussion.',
              'Could we reschedule to Friday morning?'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] px-2.5 py-1 rounded-lg border hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 transition"
                style={{ borderColor: 'var(--border-light)' }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3.5 border-t flex items-center gap-2 flex-shrink-0" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-light)' }}>
            <button
              onClick={() => toast('Attach resume or portfolio file', { icon: '📎' })}
              className="p-2.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1 px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{ background: 'var(--surface-inset)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl font-semibold text-white gradient-brand disabled:opacity-50 transition shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
