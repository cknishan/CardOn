/**
 * SettingsPage
 *
 * Route: `/settings`
 * Description: Data management hub. Allows users to export all data as JSON,
 * import a backup file (with overwrite warning), and permanently delete all
 * data (double-confirmation required). Also displays version and stats.
 */

import { useNavigate } from 'react-router-dom'
import { mockDecks, mockCards, mockStudySessions } from '../utils/mockData'

function SettingsPage() {
  const navigate = useNavigate()

  /** Serialises all mock data to a downloadable JSON file. */
  function handleExport() {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      decks: mockDecks,
      cards: mockCards,
      studySessions: mockStudySessions,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flashcard_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /** Opens a file picker to load and restore a JSON backup. */
  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (!data.decks || !data.cards) {
            alert('Invalid backup file. No changes made.')
            return
          }
          if (window.confirm('This will overwrite all existing data. Continue?')) {
            mockDecks.length = 0
            mockCards.length = 0
            mockStudySessions.length = 0
            mockDecks.push(...data.decks)
            mockCards.push(...data.cards)
            if (data.studySessions) mockStudySessions.push(...data.studySessions)
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

  /**
   * Permanently removes all decks, cards, and study sessions.
   * Requires two consecutive confirmations before executing.
   */
  function handleDeleteAll() {
    if (window.confirm('Delete ALL decks, cards, and study history? This cannot be undone.')) {
      if (window.confirm('Are you sure? There is no undo.')) {
        mockDecks.length = 0
        mockCards.length = 0
        mockStudySessions.length = 0
        navigate('/')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        {/* Breadcrumb */}
        <button onClick={() => navigate('/')} className="text-sm text-muted hover:text-dark transition mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-dark mb-6">Settings</h1>

        {/* Data Management */}
        <section className="bg-surface rounded-xl border border-border p-6 mb-5">
          <h2 className="text-base font-semibold text-dark mb-4">Data Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between bg-background hover:bg-border/30 transition rounded-lg px-4 py-3"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-dark">Export All Data</p>
                <p className="text-xs text-muted">Download a JSON backup of your decks and cards</p>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              onClick={handleImport}
              className="w-full flex items-center justify-between bg-background hover:bg-border/30 transition rounded-lg px-4 py-3"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-dark">Import Backup</p>
                <p className="text-xs text-muted">Restore data from a JSON backup file</p>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="bg-surface rounded-xl border border-border p-6 mb-5">
          <h2 className="text-base font-semibold text-dark mb-4">About</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Version</span>
              <span className="text-dark font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Total Decks</span>
              <span className="text-dark font-medium">{mockDecks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Total Cards</span>
              <span className="text-dark font-medium">{mockCards.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Study Sessions</span>
              <span className="text-dark font-medium">{mockStudySessions.length}</span>
            </div>
          </div>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-xs text-muted hover:text-primary transition"
          >
            Feedback / Support ↗
          </a>
        </section>

        {/* Danger Zone */}
        <section className="bg-surface rounded-xl border border-danger/30 p-6">
          <h2 className="text-base font-semibold text-danger mb-4">Danger Zone</h2>
          <p className="text-xs text-muted mb-4">Permanently delete all your data. This cannot be undone.</p>
          <button
            onClick={handleDeleteAll}
            className="w-full bg-danger text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Delete All Data
          </button>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
