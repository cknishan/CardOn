/**
 * StudySessionPage
 *
 * Route: `/decks/:deckId/study`
 * Description: Spaced-repetition study session. Shows due cards one at a time.
 * User can toggle hint/note, reveal the answer, then rate their recall
 * (Again / Hard / Good / Easy). A simplified SM-2 algorithm updates the
 * card's interval, ease factor, and due date.
 */

import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDeckById, getDueCardsByDeckId, mockCards } from '../utils/mockData'
import type { Card } from '../types'

/** The four possible ratings a user can assign during a study session. */
type Rating = 'again' | 'hard' | 'good' | 'easy'

/** Visual configuration for each rating button. */
interface RatingConfig {
  label: string
  color: string
  bg: string
  textColor: string
}

const RATINGS: Record<Rating, RatingConfig> = {
  again: { label: 'Again', color: 'bg-again-bg', bg: 'bg-again-bg', textColor: 'text-again-text' },
  hard: { label: 'Hard', color: 'bg-hard-bg', bg: 'bg-hard-bg', textColor: 'text-hard-text' },
  good: { label: 'Good', color: 'bg-good-bg', bg: 'bg-good-bg', textColor: 'text-good-text' },
  easy: { label: 'Easy', color: 'bg-easy-bg', bg: 'bg-easy-bg', textColor: 'text-easy-text' },
}

/**
 * Simplified SM-2 spaced repetition algorithm.
 * Mutates and returns the updated SR fields for a card based on the rating.
 *
 * @param card - The card being reviewed
 * @param rating - User-assigned recall rating
 * @returns Updated SR fields (interval, repetitions, easeFactor, dueDate)
 */
function applySM2(card: Card, rating: Rating) {
  let interval = card.interval
  let repetitions = card.repetitions
  let easeFactor = card.easeFactor

  if (rating === 'again') {
    repetitions = 0
    interval = 1
  } else if (rating === 'hard') {
    repetitions = Math.max(1, repetitions)
    interval = Math.max(1, Math.round(interval * 1.2))
    easeFactor = Math.max(1.3, easeFactor - 0.15)
  } else if (rating === 'good') {
    repetitions += 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * easeFactor)
  } else if (rating === 'easy') {
    repetitions += 1
    if (repetitions === 1) interval = 4
    else if (repetitions === 2) interval = 10
    else interval = Math.round(interval * easeFactor * 1.3)
    easeFactor = Math.min(2.5, easeFactor + 0.15)
  }

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return { interval, repetitions, easeFactor, dueDate: dueDate.toISOString().split('T')[0] }
}

function StudySessionPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()

  const deck = deckId ? getDeckById(deckId) : undefined
  const dueCards = deckId ? getDueCardsByDeckId(deckId) : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [sessionCards, setSessionCards] = useState<Card[]>([])
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  /** Initializes a new study session with all currently due cards. */
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

  /**
   * Applies the user's rating to the current card, advances to the next,
   * or finishes the session if all cards have been reviewed.
   */
  function handleRate(rating: Rating) {
    const card = sessionCards[currentIndex]
    const updated = applySM2(card, rating)
    Object.assign(card, updated)

    const nextIndex = currentIndex + 1
    setReviewedCount(prev => prev + 1)

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
    setShowHint(prev => !prev)
  }

  function toggleNote() {
    setShowNote(prev => !prev)
  }

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-dark mb-2">Deck not found</h2>
        <button onClick={() => navigate('/')} className="text-primary text-sm font-medium hover:underline">Back to Dashboard</button>
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
              <button onClick={() => navigate(`/decks/${deckId}`)} className="bg-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                Back to Deck
              </button>
            </>
          ) : (
            <>
              <p className="text-muted text-sm mb-1">{dueCards.length} card{dueCards.length !== 1 ? 's' : ''} due for review</p>
              <button onClick={startSession} className="mt-6 bg-dark text-white px-8 py-3 rounded-xl text-base font-semibold hover:opacity-90 transition">
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
          <p className="text-success font-semibold text-lg mb-6">You reviewed {reviewedCount} cards.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(`/decks/${deckId}`)} className="bg-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">
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
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-sm text-muted hover:text-dark transition">✕ Exit</button>
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

        {/* Card */}
        <div className="bg-surface rounded-xl border border-border p-8 sm:p-10">
          {/* Question */}
          <div className="text-lg sm:text-xl font-semibold text-dark mb-2 leading-relaxed">
            {card.question}
          </div>

          {/* Extra fields (hint/note toggle) */}
          <div className="flex gap-2 mb-6">
            {card.hint && (
              <button
                onClick={toggleHint}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                  showHint ? 'bg-warning/20 text-warning' : 'bg-border/50 text-muted hover:text-dark'
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

          {/* Answer area */}
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

              {/* Rating buttons */}
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
