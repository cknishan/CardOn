import { useNavigate } from 'react-router-dom'

function CreateDeckCard() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/decks/new')}
      className="surface-card group flex aspect-square w-full max-w-[330px] flex-col items-center justify-center gap-4 border-2 border-dashed border-accent/70 bg-surface/60 text-accent transition hover:border-accent hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      aria-label="Create a new deck"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition group-hover:scale-105 group-hover:bg-accent/15">
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 6v20M6 16h20"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-base font-semibold">Create new deck</span>
    </button>
  )
}

export default CreateDeckCard
