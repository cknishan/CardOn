/**
 * NotFoundPage
 *
 * Route: `*` (catch-all)
 * Description: Displayed when no route matches the current URL.
 * Shows a friendly 404 message with a link back to the dashboard.
 */

import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-5">🔮</div>
        <h1 className="text-2xl font-bold text-dark mb-2">Page not found</h1>
        <p className="text-sm text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={() => navigate('/')} className="button-base button-primary">
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage
