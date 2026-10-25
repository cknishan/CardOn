/**
 * @module Layout
 * @description Root layout wrapper rendered around every page.
 * Provides the top navigation bar with branding and a settings link,
 * plus a centered content area.
 *
 * Route: rendered as a wrapper in App.tsx, with no route of its own.
 */

import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './authContext'
import UserAvatar from './UserAvatar'

interface LayoutProps {
  /** Page content rendered inside the main area */
  children?: ReactNode
}

/**
 * Application shell with nav bar and main content slot.
 * Uses Tailwind's `max-w-7xl` container centred with padding.
 */
function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const informationRoutes = ['/about', '/privacy', '/terms']
  const currentPath = location.pathname.replace(/\/$/, '') || '/'

  if (informationRoutes.includes(currentPath)) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex items-center justify-between border-b bg-white px-6 py-4 sm:px-8">
        <Link
          to="/"
          className="font-display flex items-center gap-3 text-xl font-bold text-dark"
          aria-label="CardOn home"
        >
          <img src="/logo.png" alt="" className="h-11 w-11 object-contain" />
          <span>CardOn</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/account')}
            className="icon-button"
            aria-label="Account"
          >
            <UserAvatar user={user} size="md" />
          </button>
          <Link
            to="/settings"
            className="icon-button text-dark hover:bg-background"
            aria-label="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
    </div>
  )
}

export default Layout
