interface SampleDecksCardProps {
  isLoading: boolean
  onClick: () => void
}

function SampleDecksCard({ isLoading, onClick }: SampleDecksCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="surface-card group flex aspect-square w-full max-w-82.5 flex-col items-center justify-center gap-4 border-2 border-primary/60 bg-surface/70 px-8 text-primary transition hover:border-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      aria-label="Add three sample decks"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition group-hover:scale-105 group-hover:bg-primary/15">
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="6" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M9 23h16a3 3 0 0 0 3-3V10M6 23.5A3.5 3.5 0 0 0 9.5 27H23"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M11 10h8M11 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-base font-semibold">
        {isLoading ? 'Adding sample decks…' : 'Try sample decks'}
      </span>
      <span className="max-w-48 text-sm font-normal leading-relaxed text-muted">
        Add 3 ready-to-study decks.
      </span>
    </button>
  )
}

export default SampleDecksCard
