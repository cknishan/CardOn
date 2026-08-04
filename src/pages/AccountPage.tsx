import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import UserAvatar from '../components/UserAvatar'

function AccountPage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, login, logout } = useAuth()
  const [lastSynced] = useState<string | null>(localStorage.getItem('lastSynced'))

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted hover:text-dark transition mb-4 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-dark mb-6">Account</h1>

        <section className="bg-surface rounded-xl border border-border p-6 mb-5">
          {isLoggedIn && user ? (
            <>
              <div className="flex items-center gap-4 mb-5">
                <UserAvatar user={user} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{user.email}</p>
                  <p className="text-xs text-muted mt-0.5 break-all">User ID: {user.id}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full bg-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <div className="text-center py-2 mb-5">
                <p className="text-sm font-semibold text-dark">Not signed in</p>
                <p className="text-xs text-muted mt-1">Sign in to sync your data across devices.</p>
              </div>
              <button
                onClick={login}
                className="w-full bg-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Sign in with Google
              </button>
            </>
          )}
        </section>

        <section className="bg-surface rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-dark mb-4">Cloud Sync</h2>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted">
              {lastSynced ? `Last synced: ${new Date(lastSynced).toLocaleString()}` : 'No sync yet'}
            </p>
            <Link to="/settings" className="text-sm text-primary hover:underline shrink-0">
              Manage sync
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AccountPage
