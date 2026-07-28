import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDecks } from '../db/queries'
import { getTotalCardsCount, getDueCount } from '../db/queries'
import DeckCard from '../components/DeckCard'
import EmptyState from '../components/EmptyState'
import type { Deck } from '../models'

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
          <EmptyState
            icon="📚"
            title="No decks yet"
            description="Create your first deck to start studying."
            action={
              <button
                onClick={() => navigate('/decks/new')}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                + Create New Deck
              </button>
            }
          />
        )}

        {rows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rows.map(({ deck, totalCards, dueToday }) => (
              <DeckCard key={deck.id} deck={deck} totalCards={totalCards} dueToday={dueToday} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
