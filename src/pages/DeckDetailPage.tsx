import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DeckRepository } from '../repositories/DeckRepository'
import { FlashcardRepository } from '../repositories/FlashcardRepository'
import type { Deck, Flashcard } from '../models'
import { getTextAttributes } from '../utils/textLanguage'

function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()

  const [deck, setDeck] = useState<Deck | undefined>()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [dueCount, setDueCount] = useState(0)

  useEffect(() => {
    if (!deckId) return
    const id = deckId
    async function load() {
      const [d, c, due] = await Promise.all([
        DeckRepository.getById(id),
        FlashcardRepository.getByDeckId(id),
        FlashcardRepository.getDueCount(id),
      ])
      setDeck(d)
      setCards(c)
      setDueCount(due)
    }
    load()
  }, [deckId])

  async function handleDeleteCard(cardId: string) {
    if (window.confirm('Delete this card?')) {
      await FlashcardRepository.hardDelete(cardId)
      setCards((prev) => prev.filter((c) => c.id !== cardId))
    }
  }

  function formatDueDate(dateStr: string): string {
    const today = new Date().toISOString().split('T')[0]
    if (dateStr === today) return 'Today'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!deck) {
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
      <div className="mx-auto max-w-5xl">
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
          Back to Decks
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1
              {...getTextAttributes(deck.name)}
              className="multilingual-display text-2xl font-bold text-dark"
            >
              {deck.name}
            </h1>
            <p className="text-sm text-muted mt-1">
              {cards.length} card{cards.length !== 1 ? 's' : ''}
              {dueCount > 0 && (
                <span className="text-warning font-semibold ml-2">· {dueCount} due today</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/decks/${deckId}/study`)}
              disabled={dueCount === 0}
              className="button-base button-primary"
            >
              ▶ Study
            </button>
            <button
              onClick={() => navigate(`/decks/${deckId}/cards/new`)}
              className="button-base button-highlight"
            >
              + Add Card
            </button>
            <button
              onClick={() => navigate(`/decks/${deckId}/import`)}
              className="button-base button-secondary"
            >
              Import Markdown
            </button>
            <button
              onClick={() => navigate(`/decks/${deckId}/edit`)}
              className="button-base button-secondary"
            >
              Edit Deck
            </button>
          </div>
        </div>

        {cards.length === 0 && (
          <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
            <h2 className="text-lg font-semibold text-dark mb-2">No cards yet</h2>
            <p className="text-sm text-muted mb-6">Add your first card or import from markdown.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate(`/decks/${deckId}/cards/new`)}
                className="button-base button-highlight"
              >
                + Add Card
              </button>
              <button
                onClick={() => navigate(`/decks/${deckId}/import`)}
                className="button-base button-secondary"
              >
                Import Markdown
              </button>
            </div>
          </div>
        )}

        {cards.length > 0 && (
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted text-xs uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Question</th>
                    <th className="px-5 py-3 font-medium">Answer</th>
                    <th className="px-5 py-3 font-medium">Due Date</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr
                      key={card.id}
                      className="border-b border-border last:border-0 hover:bg-background/50 transition"
                    >
                      <td
                        {...getTextAttributes(card.question)}
                        className="multilingual-text px-5 py-4 max-w-50 truncate font-medium text-dark"
                      >
                        {card.question}
                      </td>
                      <td
                        {...getTextAttributes(card.answer)}
                        className="multilingual-text px-5 py-4 max-w-50 truncate text-muted"
                      >
                        {card.answer}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`status-badge ${
                            card.dueDate <= new Date().toISOString().split('T')[0]
                              ? 'bg-again-bg text-again-text'
                              : 'bg-good-bg text-good-text'
                          }`}
                        >
                          {formatDueDate(card.dueDate)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/decks/${deckId}/cards/${card.id}/edit`)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-xs font-medium text-danger hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeckDetailPage
