import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[var(--mist)] selection:bg-[var(--marigold)] selection:text-[var(--ink)]">
      <div className="text-8xl font-medium font-display text-[var(--marigold-deep)] mb-3 leading-none">404</div>
      <h1 className="text-3xl font-medium font-display mb-2 text-[var(--ink)]">Page not found</h1>
      <p className="text-sm mb-8 max-w-md text-[var(--slate)]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  )
}
