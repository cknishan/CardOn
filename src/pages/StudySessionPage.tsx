import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../db'
import { getDeckById, getDueCardsByDeckId } from '../db/queries'
import { applySM2, RATINGS } from '../utils/sm2'
import type { Rating, RatingConfig } from '../utils/sm2'
import type { Card, Deck } from '../types'

function StudySessionPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()

  const [deck, setDeck] = useState<Deck | undefined>()
  const [dueCards, setDueCards] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [sessionCards, setSessionCards] = useState<Card[]>([])
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  useEffect(() => {
    if (!deckId) return
    const id = deckId
    async function load() {
      const [d, c] = await Promise.all([getDeckById(id), getDueCardsByDeckId(id)])
      setDeck(d)
      setDueCards(c)
    }
    load()
  }, [deckId])

  const startSession = useCallback(() => {
    setSessionCards([...dueCards])
    setSessionStarted(true)
    setCurrentIndex(0)
    setShowAnswer(false)
    setShowHint(false)
    setShowNote(false)
    setSessionComplete(false)
    setReviewedCount(0)
  }, [dueCards])

  async function handleRate(rating: Rating) {
    const card = sessionCards[currentIndex]
    const updated = applySM2(card, rating)
    await db.cards.update(card.id, { ...updated, updatedAt: new Date().toISOString() })

    const nextIndex = currentIndex + 1
    setReviewedCount((prev) => prev + 1)

    if (nextIndex >= sessionCards.length) {
      setSessionComplete(true)
      setShowAnswer(false)
      setShowHint(false)
      setShowNote(false)
    } else {
      setCurrentIndex(nextIndex)
      setShowAnswer(false)
      setShowHint(false)
      setShowNote(false)
    }
  }

  function toggleHint() {
    setShowHint((prev) => !prev)
  }

  function toggleNote() {
    setShowNote((prev) => !prev)
  }

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-dark mb-2">Deck not found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary text-sm font-medium hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-surface rounded-xl border border-border p-10">
          <div className="text-6xl mb-5">📖</div>
          <h1 className="text-xl font-bold text-dark mb-2">{deck.name}</h1>
          {dueCards.length === 0 ? (
            <>
              <p className="text-muted text-sm mb-6">Nothing due today! Come back tomorrow.</p>
              <button
                onClick={() => navigate(`/decks/${deckId}`)}
                className="bg-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Back to Deck
              </button>
            </>
          ) : (
            <>
              <p className="text-muted text-sm mb-1">
                {dueCards.length} card{dueCards.length !== 1 ? 's' : ''} due for review
              </p>
              <button
                onClick={startSession}
                className="mt-6 bg-dark text-white px-8 py-3 rounded-xl text-base font-semibold hover:opacity-90 transition"
              >
                ▶ Start Studying
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-surface rounded-xl border border-border p-10">
          <div className="text-6xl mb-5">🎉</div>
          <h1 className="text-xl font-bold text-dark mb-2">Session Complete!</h1>
          <p className="text-success font-semibold text-lg mb-6">
            You reviewed {reviewedCount} cards.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/decks/${deckId}`)}
              className="bg-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Back to Decks
            </button>
          </div>
        </div>
      </div>
    )
  }

  const card = sessionCards[currentIndex]

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted hover:text-dark transition"
          >
            ✕ Exit
          </button>
          <span className="text-sm text-muted">
            {currentIndex + 1} of {sessionCards.length}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-1.5 mb-8">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }}
          />
        </div>

        <div className="bg-surface rounded-xl border border-border p-8 sm:p-10">
          <div className="text-lg sm:text-xl font-semibold text-dark mb-2 leading-relaxed">
            {card.question}
          </div>

          <div className="flex gap-2 mb-6">
            {card.hint && (
              <button
                onClick={toggleHint}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                  showHint
                    ? 'bg-warning/20 text-warning'
                    : 'bg-border/50 text-muted hover:text-dark'
                }`}
              >
                {showHint ? 'Hide Hint' : 'Hint'}
              </button>
            )}
            {card.note && (
              <button
                onClick={toggleNote}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                  showNote ? 'bg-accent/20 text-accent' : 'bg-border/50 text-muted hover:text-dark'
                }`}
              >
                {showNote ? 'Hide Note' : 'Note'}
              </button>
            )}
          </div>

          {showHint && card.hint && (
            <div className="text-sm text-warning bg-warning/10 rounded-lg px-4 py-3 mb-4">
              💡 {card.hint}
            </div>
          )}

          {showNote && card.note && (
            <div className="text-sm text-accent bg-accent/10 rounded-lg px-4 py-3 mb-4">
              📝 {card.note}
            </div>
          )}

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full mt-2 bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Show Answer
            </button>
          ) : (
            <>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-base sm:text-lg text-dark leading-relaxed">
                  <span className="font-medium">Answer: </span>
                  {card.answer}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                {(Object.entries(RATINGS) as [Rating, RatingConfig][]).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleRate(key)}
                    className={`${config.bg} ${config.textColor} py-3 rounded-xl text-sm font-bold hover:opacity-80 transition`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudySessionPage
