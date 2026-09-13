import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateDeckCard from '../components/CreateDeckCard'
import DeckCard from '../components/DeckCard'
import type { Deck } from '../models'
import { DeckRepository } from '../repositories/DeckRepository'
import { FlashcardRepository } from '../repositories/FlashcardRepository'
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
      <div className="mx-auto max-w-[1010px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark">Your Decks</h1>
            <p className="mt-1 text-sm text-muted">
              {rows.length} deck{rows.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/decks/new')}
            className="icon-button border-2 border-dark text-dark hover:bg-surface"
            aria-label="Create a new deck"
            title="Create a new deck"
          >
            <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path
                d="M14 4v20M4 14h20"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {rows.length === 0 && (
          <div className="mb-8 py-6 text-center">
            <h2 className="mb-2 text-lg font-semibold text-dark">No decks yet</h2>
            <p className="text-sm text-muted">Create your first deck to start studying.</p>
          </div>
        )}

        <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ deck, stats }) => (
            <DeckCard key={deck.id} deck={deck} stats={stats} />
          ))}
          <CreateDeckCard />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
