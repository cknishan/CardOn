import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DeckRepository } from '../repositories/DeckRepository'
import type { Deck } from '../models'
import { getTextAttributes } from '../utils/textLanguage'

function DeckFormPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const [deck, setDeck] = useState<Deck | null>()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const isEdit = !!deckId

  useEffect(() => {
    if (!deckId) return
    async function load() {
      const d = await DeckRepository.getById(deckId!)
      setDeck(d)
      if (d) {
        setName(d.name)
        setDescription(d.description ?? '')
      }
    }
    load()
  }, [deckId])

  async function handleSubmit(e: React.FormEvent) {
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
      await DeckRepository.update(deckId!, {
        name: trimmed,
        description: description.trim() || null,
      })
    } else {
      await DeckRepository.create({ name: trimmed, description: description.trim() || null })
    }
    navigate('/')
  }

  async function handleDelete() {
    if (window.confirm('Delete this deck and all its cards?')) {
      await DeckRepository.hardDelete(deckId!)
      navigate('/')
    }
  }

  if (isEdit && deck === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-dark mb-2">Deck not found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary text-sm font-medium hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        {isEdit && (
          <button
            type="button"
            onClick={() => navigate(`/decks/${deckId}`)}
            className="text-sm text-muted hover:text-dark transition mb-4 flex items-center gap-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to {deck?.name ?? 'deck'}
          </button>
        )}

        <h1 className="text-2xl font-bold text-dark mb-6">
          {isEdit ? 'Edit Deck' : 'Create New Deck'}
        </h1>

        <form onSubmit={handleSubmit} className="surface-card space-y-5 p-6">
          <div>
            <label htmlFor="deckName" className="block text-sm font-medium text-dark mb-1.5">
              Deck Name
            </label>
            <input
              {...getTextAttributes(name)}
              id="deckName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="e.g. French Basics"
              maxLength={100}
              autoFocus
              className="multilingual-text field-control"
            />
            {error && <p className="text-danger text-xs mt-1.5">{error}</p>}
            <p className="text-muted text-xs mt-1.5 text-right">{name.length}/100</p>
          </div>

          <div>
            <label htmlFor="deckDescription" className="block text-sm font-medium text-dark mb-1.5">
              Description <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              {...getTextAttributes(description)}
              id="deckDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you study in this deck?"
              rows={4}
              className="multilingual-text field-control resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="button-base button-primary flex-1"
            >
              {isEdit ? 'Save Changes' : 'Create Deck'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="button-base button-secondary flex-1"
            >
              Cancel
            </button>
          </div>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="button-base button-danger-outline w-full"
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
