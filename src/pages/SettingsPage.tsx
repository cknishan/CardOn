import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../database/dexie'
import { useAuth } from '../components/authContext'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { SyncService } from '../services/SyncService'
import { supabaseProvider } from '../providers/SupabaseProvider'

function SettingsPage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, login, logout, deleteAccount } = useAuth()
  const [syncState, setSyncState] = useState<'idle' | 'syncing'>('idle')
  const [lastSynced, setLastSynced] = useState<string | null>(localStorage.getItem('lastSynced'))
  const [counts, setCounts] = useState({ decks: 0, cards: 0, sessions: 0 })
  const [isAccountDeleteOpen, setIsAccountDeleteOpen] = useState(false)
  const [accountDeleteConfirmation, setAccountDeleteConfirmation] = useState('')
  const [accountDeleteState, setAccountDeleteState] = useState<'idle' | 'deleting'>('idle')
  const [accountDeleteError, setAccountDeleteError] = useState('')

  useEffect(() => {
    async function load() {
      const [decks, cards, sessions] = await Promise.all([
        db.decks.count(),
        db.cards.count(),
        db.studySessions.count(),
      ])
      setCounts({ decks, cards, sessions })
    }
    load()
  }, [])

  async function handleSync() {
    setSyncState('syncing')
    try {
      const sync = new SyncService(supabaseProvider)
      await sync.push()
      await sync.pullAndMerge()
      const now = new Date().toISOString()
      localStorage.setItem('lastSynced', now)
      setLastSynced(now)

      const [decks, cards, sessions] = await Promise.all([
        db.decks.count(),
        db.cards.count(),
        db.studySessions.count(),
      ])
      setCounts({ decks, cards, sessions })
    } catch (err) {
      alert('Sync failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSyncState('idle')
    }
  }

  async function handleExport() {
    const [decks, cards, studySessions] = await Promise.all([
      db.decks.toArray(),
      db.cards.toArray(),
      db.studySessions.toArray(),
    ])
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      decks,
      cards,
      studySessions,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flashcard_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (!data.decks || !data.cards) {
            alert('Invalid backup file. No changes made.')
            return
          }
          if (window.confirm('This will overwrite all existing data. Continue?')) {
            await db.decks.clear()
            await db.cards.clear()
            await db.studySessions.clear()
            await db.decks.bulkAdd(data.decks)
            await db.cards.bulkAdd(data.cards)
            if (data.studySessions) {
              await db.studySessions.bulkAdd(data.studySessions)
            }
            setCounts({
              decks: data.decks.length,
              cards: data.cards.length,
              sessions: data.studySessions?.length ?? 0,
            })
            alert('Data restored successfully!')
          }
        } catch {
          alert('Invalid backup file. No changes made.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  async function clearLocalData() {
    await db.transaction('rw', db.decks, db.cards, db.studySessions, async () => {
      await Promise.all([db.decks.clear(), db.cards.clear(), db.studySessions.clear()])
    })
    localStorage.removeItem('lastSynced')
    setLastSynced(null)
    setCounts({ decks: 0, cards: 0, sessions: 0 })
  }

  async function handleDeleteAll() {
    if (window.confirm('Delete ALL decks, cards, and study history? This cannot be undone.')) {
      if (window.confirm('Are you sure? There is no undo.')) {
        await clearLocalData()
        navigate('/')
      }
    }
  }

  async function handleDeleteAccount() {
    if (accountDeleteConfirmation !== 'DELETE' || accountDeleteState === 'deleting') return

    setAccountDeleteState('deleting')
    setAccountDeleteError('')
    let cloudAccountDeleted = false

    try {
      await deleteAccount()
      cloudAccountDeleted = true
      await clearLocalData()
      navigate('/')
    } catch (error) {
      if (cloudAccountDeleted) {
        localStorage.removeItem('lastSynced')
        setLastSynced(null)
        setAccountDeleteError(
          'Your account was deleted, but local browser data could not be fully cleared. Use Delete All Local Data to try again.'
        )
      } else {
        setAccountDeleteError(
          'Account deletion failed. ' +
            (error instanceof Error ? error.message : 'Please try again later.')
        )
      }
    } finally {
      setAccountDeleteState('idle')
    }
  }

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

        <h1 className="text-2xl font-bold text-dark mb-6">Settings</h1>

        <section className="surface-card mb-5 p-6">
          <h2 className="text-base font-semibold text-dark mb-4">Data Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="surface-inset flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-border/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-dark">Export All Data</p>
                <p className="text-xs text-muted">Download a JSON backup of your decks and cards</p>
              </div>
              <svg
                className="w-5 h-5 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
            <button
              onClick={handleImport}
              className="surface-inset flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-border/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-dark">Import Backup</p>
                <p className="text-xs text-muted">Restore data from a JSON backup file</p>
              </div>
              <svg
                className="w-5 h-5 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </button>
          </div>
        </section>

        <section className="surface-card mb-5 p-6">
          <h2 className="text-base font-semibold text-dark mb-4">Cloud Sync</h2>
          <div className="space-y-3">
            {isLoggedIn ? (
              <>
                <div className="surface-inset flex items-center justify-between px-4 py-3">
                  <div className="text-left">
                    <p className="text-sm font-medium text-dark">Signed in as</p>
                    <p className="text-xs text-muted">{user?.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm text-danger hover:opacity-80 transition font-medium"
                  >
                    Sign Out
                  </button>
                </div>
                <button
                  onClick={handleSync}
                  disabled={syncState === 'syncing'}
                  className="surface-inset flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-border/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-dark">
                      {syncState === 'syncing' ? 'Syncing...' : 'Sync Now'}
                    </p>
                    <p className="text-xs text-muted">
                      {lastSynced
                        ? `Last synced: ${new Date(lastSynced).toLocaleString()}`
                        : 'Upload and download your data'}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-muted ${syncState === 'syncing' ? 'animate-spin' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <div className="surface-inset space-y-3 p-4">
                <p className="text-xs text-muted">Sign in to sync your data across devices.</p>
                <GoogleSignInButton onClick={login} />
              </div>
            )}
          </div>
        </section>

        <section className="surface-card mb-5 p-6">
          <h2 className="text-base font-semibold text-dark mb-4">App Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Version</span>
              <span className="text-dark font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Total Decks</span>
              <span className="text-dark font-medium">{counts.decks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Total Cards</span>
              <span className="text-dark font-medium">{counts.cards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Study Sessions</span>
              <span className="text-dark font-medium">{counts.sessions}</span>
            </div>
          </div>
        </section>

        <section className="surface-card mb-5 p-6">
          <h2 className="text-base font-semibold text-dark mb-4">CardOn Information</h2>
          <nav aria-label="CardOn information" className="space-y-2">
            {[
              {
                to: '/about',
                label: 'About CardOn',
                description: 'Learn about CardOn and fast bulk import',
              },
              {
                to: '/privacy',
                label: 'Privacy Policy',
                description: 'See how CardOn handles your information',
              },
              {
                to: '/terms',
                label: 'Terms of Service',
                description: 'Read the terms for using CardOn',
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="surface-inset flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-border/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span>
                  <span className="block text-sm font-medium text-dark">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{item.description}</span>
                </span>
                <svg
                  className="h-4 w-4 shrink-0 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>
        </section>

        <section className="surface-card border-danger/30 p-6">
          <h2 className="text-base font-semibold text-danger mb-4">Danger Zone</h2>

          {accountDeleteError && (
            <p
              className="mb-4 rounded-lg bg-again-bg px-4 py-3 text-sm text-again-text"
              role="alert"
            >
              {accountDeleteError}
            </p>
          )}

          <div>
            <h3 className="text-sm font-semibold text-dark">Local browser data</h3>
            <p className="mb-4 mt-1 text-xs leading-5 text-muted">
              Delete decks, cards, study history, and sync information stored in this browser. Your
              signed-in account and cloud data will remain.
            </p>
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={accountDeleteState === 'deleting'}
              className="button-base button-danger-outline w-full"
            >
              Delete All Local Data
            </button>
          </div>

          {isLoggedIn && (
            <div className="mt-6 border-t border-danger/20 pt-6">
              <h3 className="text-sm font-semibold text-danger">Account and all data</h3>
              <p className="mt-1 text-xs leading-5 text-muted">
                Permanently delete your CardOn account, synchronized cloud data, and all data stored
                in this browser. This cannot be undone.
              </p>

              {!isAccountDeleteOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountDeleteOpen(true)
                    setAccountDeleteConfirmation('')
                    setAccountDeleteError('')
                  }}
                  className="button-base button-danger mt-4 w-full"
                >
                  Delete Account
                </button>
              ) : (
                <div className="mt-4 rounded-xl border border-danger/30 bg-again-bg/40 p-4">
                  <label htmlFor="deleteAccountConfirmation" className="block text-sm text-dark">
                    Type <strong>DELETE</strong> to confirm
                  </label>
                  <input
                    id="deleteAccountConfirmation"
                    type="text"
                    value={accountDeleteConfirmation}
                    onChange={(event) => setAccountDeleteConfirmation(event.target.value)}
                    disabled={accountDeleteState === 'deleting'}
                    autoComplete="off"
                    spellCheck={false}
                    className="field-control mt-2 bg-surface"
                  />
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={
                        accountDeleteConfirmation !== 'DELETE' || accountDeleteState === 'deleting'
                      }
                      className="button-base button-danger flex-1"
                    >
                      {accountDeleteState === 'deleting'
                        ? 'Deleting Account...'
                        : 'Permanently Delete Account'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountDeleteOpen(false)
                        setAccountDeleteConfirmation('')
                        setAccountDeleteError('')
                      }}
                      disabled={accountDeleteState === 'deleting'}
                      className="button-base button-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
