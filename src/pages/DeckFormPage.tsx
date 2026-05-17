/**
 * DeckFormPage
 *
 * Route: `/decks/new` | `/decks/:deckId/edit`
 * Description: Form to create a new deck or edit an existing one.
 * Validates that the name is non-empty and ≤ 100 characters.
 * In edit mode, a "Delete this deck" option is shown.
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDeckById, mockDecks } from '../utils/mockData'

function DeckFormPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const existing = deckId ? getDeckById(deckId) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [error, setError] = useState('')

  const isEdit = !!existing

  /**
   * Validates the deck name and saves (creates or updates) the deck.
   * Redirects to dashboard on success.
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name required')
      return
    }
    if (trimmed.length > 100) {
      setError('Max 100 characters')
      return
    }
    if (isEdit) {
      const deck = mockDecks.find(d => d.id === deckId)
      if (deck) deck.name = trimmed
    }
    navigate('/')
  }

  /** Deletes the current deck after confirmation. */
  function handleDelete() {
    if (window.confirm('Delete this deck and all its cards?')) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-dark mb-6">
          {isEdit ? 'Edit Deck' : 'Create New Deck'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
          <div>
            <label htmlFor="deckName" className="block text-sm font-medium text-dark mb-1.5">
              Deck Name
            </label>
            <input
              id="deckName"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="e.g. French Basics"
              maxLength={100}
              autoFocus
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {error && <p className="text-danger text-xs mt-1.5">{error}</p>}
            <p className="text-muted text-xs mt-1.5 text-right">{name.length}/100</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
            >
              {isEdit ? 'Save Changes' : 'Create Deck'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-border text-dark py-2.5 rounded-xl text-sm font-medium hover:bg-background transition"
            >
              Cancel
            </button>
          </div>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full text-danger text-sm font-medium py-2 hover:underline transition"
            >
              Delete this deck
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default DeckFormPage
