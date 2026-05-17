/**
 * DashboardPage
 *
 * Route: `/`
 * Description: Landing page showing all decks in a responsive grid.
 * Each deck card displays its name, total card count, due count,
 * and actions (Study / View Cards). Empty state is shown when no decks exist.
 */

import { useNavigate } from 'react-router-dom'
import { mockDecks, getTotalCardsCount, getDueCount } from '../utils/mockData'

function DashboardPage() {
  const navigate = useNavigate()
  const decks = mockDecks

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-content mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Your Decks</h1>
            <p className="text-sm text-muted mt-1">
              {decks.length} deck{decks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/decks/new')}
            className="flex items-center gap-2 bg-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            + Create New Deck
          </button>
        </div>

        {/* Empty state */}
        {decks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-5">📚</div>
            <h2 className="text-lg font-semibold text-dark mb-2">No decks yet</h2>
            <p className="text-sm text-muted mb-6">
              Create your first deck to start studying.
            </p>
            <button
              onClick={() => navigate('/decks/new')}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              + Create New Deck
            </button>
          </div>
        )}

        {/* Deck grid */}
        {decks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {decks.map(deck => {
              const totalCards = getTotalCardsCount(deck.id)
              const dueToday = getDueCount(deck.id)
              return (
                <div
                  key={deck.id}
                  className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/decks/${deck.id}`)}
                >
                  {/* Deck name */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-dark leading-snug">
                      {deck.name}
                    </h2>
                    {dueToday > 0 && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-again-bg text-again-text shrink-0">
                        {dueToday} due
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <span> {totalCards} cards</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/decks/${deck.id}/study`) }}
                      disabled={dueToday === 0}
                      className="flex-1 bg-dark text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
                    >
                      ▶ Study
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/decks/${deck.id}`) }}
                      className="flex-1 border border-border text-dark py-2 rounded-lg text-sm font-medium hover:bg-background transition"
                    >
                      View Cards
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default DashboardPage
