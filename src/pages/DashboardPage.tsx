import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDecks } from '../db/queries'
import { getTotalCardsCount, getDueCount } from '../db/queries'
import type { Deck } from '../types'

interface DeckRow {
  deck: Deck
  totalCards: number
  dueToday: number
}

function DashboardPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<DeckRow[]>([])

  useEffect(() => {
    async function load() {
      const decks = await getAllDecks()
      const data = await Promise.all(
        decks.map(async (deck) => ({
          deck,
          totalCards: await getTotalCardsCount(deck.id),
          dueToday: await getDueCount(deck.id),
        }))
      )
      setRows(data)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-content mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Your Decks</h1>
            <p className="text-sm text-muted mt-1">
              {rows.length} deck{rows.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/decks/new')}
            className="flex items-center gap-2 bg-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            + Create New Deck
          </button>
        </div>

        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-5">📚</div>
            <h2 className="text-lg font-semibold text-dark mb-2">No decks yet</h2>
            <p className="text-sm text-muted mb-6">Create your first deck to start studying.</p>
            <button
              onClick={() => navigate('/decks/new')}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              + Create New Deck
            </button>
          </div>
        )}

        {rows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rows.map(({ deck, totalCards, dueToday }) => (
              <div
                key={deck.id}
                className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-4 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/decks/${deck.id}`)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-dark leading-snug">{deck.name}</h2>
                  {dueToday > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-again-bg text-again-text shrink-0">
                      {dueToday} due
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-muted">
                  <span> {totalCards} cards</span>
                </div>

                <div className="flex gap-2 mt-auto pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/decks/${deck.id}/study`)
                    }}
                    disabled={dueToday === 0}
                    className="flex-1 bg-dark text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
                  >
                    ▶ Study
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/decks/${deck.id}`)
                    }}
                    className="flex-1 border border-border text-dark py-2 rounded-lg text-sm font-medium hover:bg-background transition"
                  >
                    View Cards
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
