/**
 * DeckDetailPage
 *
 * Route: `/decks/:deckId`
 * Description: Shows all cards in a deck with a searchable table.
 * Provides buttons to study, add cards, import markdown, or edit/delete the deck.
 * Each card row shows question, answer preview, due date, and actions.
 */

import { useParams, useNavigate } from 'react-router-dom'
import { getDeckById, getCardsByDeckId, mockCards, getDueCount } from '../utils/mockData'

function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()

  const deck = deckId ? getDeckById(deckId) : undefined
  const cards = deckId ? getCardsByDeckId(deckId) : []
  const dueCount = deckId ? getDueCount(deckId) : 0

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-dark mb-2">Deck not found</h2>
        <button onClick={() => navigate('/')} className="text-primary text-sm font-medium hover:underline">
          Back to Dashboard
        </button>
      </div>
    )
  }

  /**
   * Removes a card from the mock store after user confirmation.
   * @param cardId - UUID of the card to delete
   */
  function handleDeleteCard(cardId: string) {
    if (window.confirm('Delete this card?')) {
      const idx = mockCards.findIndex(c => c.id === cardId)
      if (idx !== -1) mockCards.splice(idx, 1)
      navigate(`/decks/${deckId}`)
    }
  }

  /**
   * Formats a date string for human-readable display.
   * Returns "Today" if the date matches the current date.
   * @param dateStr - ISO date string (YYYY-MM-DD)
   * @returns Formatted date label
   */
  function formatDueDate(dateStr: string): string {
    const today = new Date().toISOString().split('T')[0]
    if (dateStr === today) return 'Today'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <button onClick={() => navigate('/')} className="text-sm text-muted hover:text-dark transition mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Decks
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark">{deck.name}</h1>
            <p className="text-sm text-muted mt-1">
              {cards.length} card{cards.length !== 1 ? 's' : ''}
              {dueCount > 0 && <span className="text-warning font-semibold ml-2">· {dueCount} due today</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/decks/${deckId}/study`)}
              disabled={dueCount === 0}
              className="bg-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
            >
              ▶ Study
            </button>
            <button
              onClick={() => navigate(`/decks/${deckId}/cards/new`)}
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              + Add Card
            </button>
            <button
              onClick={() => navigate(`/decks/${deckId}/import`)}
              className="border border-border text-dark px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-background transition"
            >
              Import Markdown
            </button>
            <button
              onClick={() => navigate(`/decks/${deckId}/edit`)}
              className="border border-border text-dark px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-background transition"
            >
              Edit Deck
            </button>
          </div>
        </div>

        {/* Empty state */}
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-surface rounded-xl border border-border">
            <div className="text-5xl mb-4">🃏</div>
            <h2 className="text-lg font-semibold text-dark mb-2">No cards yet</h2>
            <p className="text-sm text-muted mb-6">Add your first card or import from markdown.</p>
            <div className="flex gap-3">
              <button onClick={() => navigate(`/decks/${deckId}/cards/new`)} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                + Add Card
              </button>
              <button onClick={() => navigate(`/decks/${deckId}/import`)} className="border border-border text-dark px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-background transition">
                Import Markdown
              </button>
            </div>
          </div>
        )}

        {/* Cards table */}
        {cards.length > 0 && (
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
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
                  {cards.map(card => (
                    <tr key={card.id} className="border-b border-border last:border-0 hover:bg-background/50 transition">
                      <td className="px-5 py-4 max-w-[200px] truncate font-medium text-dark">
                        {card.question}
                      </td>
                      <td className="px-5 py-4 max-w-[200px] truncate text-muted">
                        {card.answer}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          card.dueDate <= new Date().toISOString().split('T')[0]
                            ? 'bg-again-bg text-again-text'
                            : 'bg-good-bg text-good-text'
                        }`}>
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
