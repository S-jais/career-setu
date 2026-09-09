import { Brain } from 'lucide-react'

interface AIAssistantOrbProps {
  isOpen: boolean
  onClick: () => void
  isThinking: boolean
}

export default function AIAssistantOrb({ isOpen, onClick, isThinking }: AIAssistantOrbProps) {
  if (isOpen) return null

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-[60] w-12 h-12 rounded-[3px] bg-[var(--ink)] text-[var(--paper)] border border-[var(--line)] shadow-md
        flex items-center justify-center cursor-pointer transition-all duration-200
        hover:bg-[var(--ink-soft)] hover:-translate-y-0.5
        focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--marigold-deep)]
        ${isThinking ? 'ai-orb--thinking' : ''}`}
      aria-label="Open Career Setu AI Assistant"
      title="Career Setu AI"
      role="button"
      tabIndex={0}
    >
      <Brain className="w-5 h-5 text-[var(--marigold)]" />
    </button>
  )
}
