import { useNavigate } from 'react-router-dom'
import type { Deck } from '../models'

interface DeckCardProps {
  deck: Deck
  totalCards: number
  dueToday: number
}

function DeckCard({ deck, totalCards, dueToday }: DeckCardProps) {
  const navigate = useNavigate()

  return (
    <div
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
  )
}

export default DeckCard
