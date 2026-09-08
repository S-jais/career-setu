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
      className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full gradient-brand text-white shadow-lg
        flex items-center justify-center cursor-pointer transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2
        ${isThinking ? 'ai-orb--thinking' : 'ai-orb'}`}
      aria-label="Open Career Setu AI Assistant"
      title="Career Setu AI"
      role="button"
      tabIndex={0}
    >
      {/* Subtle ring orbit */}
      <span
        className="absolute inset-[-3px] rounded-full border border-brand-300/30 pointer-events-none"
        style={{ animation: 'ai-orb-ring 12s linear infinite' }}
      />
      <Brain className="w-6 h-6 relative z-10" />
    </button>
  )
}
