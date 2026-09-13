import { useNavigate } from 'react-router-dom'
import type { Deck } from '../models'
import type { DeckStats } from '../repositories/FlashcardRepository'
import { getTextAttributes } from '../utils/textLanguage'

interface DeckCardProps {
  deck: Deck
  stats: DeckStats
}

function DeckCard({ deck, stats }: DeckCardProps) {
  const navigate = useNavigate()

  return (
    <article className="surface-card flex aspect-square w-full max-w-82.5 flex-col p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h2
          {...getTextAttributes(deck.name)}
          className="multilingual-display line-clamp-3 min-w-0 flex-1 wrap-break-words text-[22px] font-bold leading-[1.4] text-[#cf3333]"
        >
          {deck.name}
        </h2>

        <button
          type="button"
          className="group relative w-20 shrink-0 rounded-xl bg-[#fff4f4] px-3 py-3 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={`${stats.seen} of ${stats.total} cards seen, ${stats.dueAgain} due again, ${stats.completed} completed and not due`}
          aria-describedby={`deck-progress-${deck.id}`}
        >
          <div className="whitespace-nowrap text-base text-dark">
            {stats.seen} / <span className="font-bold">{stats.total}</span>
          </div>
          <div className="mt-1 flex justify-around text-base" aria-hidden="true">
            <span className="text-[#ff3333]">{stats.dueAgain}</span>
            <span className="text-[#187d3e]">{stats.completed}</span>
          </div>
          <span
            id={`deck-progress-${deck.id}`}
            role="tooltip"
            className="invisible absolute right-0 top-[calc(100%+0.5rem)] z-10 w-52 rounded-sm bg-dark px-3 py-2 text-left text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
          >
            {stats.seen} seen out of {stats.total} total. {stats.dueAgain} due again.{' '}
            {stats.completed} completed and not due.
          </span>
        </button>
      </div>

      <p
        {...getTextAttributes(deck.description ?? '')}
        className="multilingual-text mt-6 line-clamp-4 text-sm leading-[1.35] text-dark"
      >
        {deck.description ?? ''}
      </p>

      <div className="mt-auto grid grid-cols-3 items-center">
        <button
          type="button"
          onClick={() => navigate(`/decks/${deck.id}/edit`)}
          className="icon-button justify-self-start text-dark hover:bg-background"
          aria-label={`Edit ${deck.name}`}
        >
          <svg className="h-9 w-9" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M27.5 10.5H9.75A3.75 3.75 0 0 0 6 14.25v24A3.75 3.75 0 0 0 9.75 42h24a3.75 3.75 0 0 0 3.75-3.75V20.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m34.5 6.5 7 7L22 33l-9 2 2-9L34.5 6.5Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/decks/${deck.id}`)}
          className="icon-button justify-self-center text-dark hover:bg-background"
          aria-label={`View ${deck.name}`}
        >
          <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/decks/${deck.id}/study`)}
          disabled={stats.studyDue === 0}
          className="icon-button justify-self-end border-2 border-dark text-dark hover:bg-background"
          aria-label={`Study ${deck.name}`}
        >
          <svg
            className="ml-0.5 h-7 w-7"
            viewBox="0 0 36 36"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5.5v25l21-12.5L8 5.5Z" />
          </svg>
        </button>
      </div>
    </article>
  )
}

export default DeckCard
