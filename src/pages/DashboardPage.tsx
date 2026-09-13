import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeckRepository } from '../repositories/DeckRepository'
import { FlashcardRepository } from '../repositories/FlashcardRepository'
import DeckCard from '../components/DeckCard'
import EmptyState from '../components/EmptyState'
import type { Deck } from '../models'
import type { DeckStats } from '../repositories/FlashcardRepository'

interface DeckRow {
  deck: Deck
  stats: DeckStats
}

function DashboardPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<DeckRow[]>([])

  useEffect(() => {
    async function load() {
      const decks = await DeckRepository.getAll()
      const data = await Promise.all(
        decks.map(async (deck) => ({
          deck,
          stats: await FlashcardRepository.getDeckStats(deck.id),
        }))
      )
      setRows(data)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-[1010px] mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
            {rows.map(({ deck, stats }) => (
              <DeckCard key={deck.id} deck={deck} stats={stats} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
