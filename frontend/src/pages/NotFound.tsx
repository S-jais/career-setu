import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: 'var(--surface-base)' }}>
      <div className="text-8xl font-bold font-display gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>Page not found</h1>
      <p className="text-sm mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="px-6 py-3 rounded-xl font-semibold text-white gradient-brand">
        Back to Home
      </Link>
    </div>
  )
}
