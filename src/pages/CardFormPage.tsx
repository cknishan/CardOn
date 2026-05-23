/**
 * CardFormPage
 *
 * Route: `/decks/:deckId/cards/new` | `/decks/:deckId/cards/:cardId/edit`
 * Description: Form to add or edit a flash card. Requires question and answer;
 * hint and note are optional. In edit mode, a delete button is shown.
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDeckById, mockCards, generateId } from '../utils/mockData'

function CardFormPage() {
  const { deckId, cardId } = useParams<{ deckId: string; cardId: string }>()
  const navigate = useNavigate()

  const deck = deckId ? getDeckById(deckId) : undefined
  const existing = cardId ? mockCards.find(c => c.id === cardId) : null

  const [question, setQuestion] = useState(existing?.question ?? '')
  const [answer, setAnswer] = useState(existing?.answer ?? '')
  const [hint, setHint] = useState(existing?.hint ?? '')
  const [note, setNote] = useState(existing?.note ?? '')
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({})

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-dark mb-2">Deck not found</h2>
        <button onClick={() => navigate('/')} className="text-primary text-sm font-medium hover:underline">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const isEdit = !!existing

  /**
   * Validates required fields and saves (creates or updates) the card.
   * Redirects to deck detail on success.
   */
 function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: { question?: string; answer?: string } = {}
    if (!question.trim()) newErrors.question = 'Question is required'
    if (!answer.trim()) newErrors.answer = 'Answer is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    if (isEdit && existing) {
      const idx = mockCards.findIndex(c => c.id === cardId)
      if (idx !== -1) {
        mockCards[idx] = {
          ...existing,
          question: question.trim(),
          answer: answer.trim(),
          hint: hint.trim() || null,
          note: note.trim() || null,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      mockCards.push({
        id: generateId(),
        deckId: deckId!,
        question: question.trim(),
        answer: answer.trim(),
        hint: hint.trim() || null,
        note: note.trim() || null,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    navigate(`/decks/${deckId}`)
  }

  /** Deletes the current card after confirmation. */
  function handleDelete() {
    if (!existing) return
    if (window.confirm('Delete this card?')) {
      const idx = mockCards.findIndex(c => c.id === cardId)
      if (idx !== -1) mockCards.splice(idx, 1)
      navigate(`/decks/${deckId}`)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(`/decks/${deckId}`)}
          className="text-sm text-muted hover:text-dark transition mb-4 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to {deck.name}
        </button>

        <h1 className="text-2xl font-bold text-dark mb-6">
          {isEdit ? 'Edit Card' : 'Add New Card'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
          {/* Question */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-dark mb-1.5">
              Question <span className="text-danger">*</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={e => { setQuestion(e.target.value); setErrors(prev => ({ ...prev, question: undefined })) }}
              placeholder="Enter the question"
              rows={3}
              autoFocus
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
            {errors.question && <p className="text-danger text-xs mt-1.5">{errors.question}</p>}
          </div>

          {/* Answer */}
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-dark mb-1.5">
              Answer <span className="text-danger">*</span>
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={e => { setAnswer(e.target.value); setErrors(prev => ({ ...prev, answer: undefined })) }}
              placeholder="Enter the answer"
              rows={3}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
            {errors.answer && <p className="text-danger text-xs mt-1.5">{errors.answer}</p>}
          </div>

          {/* Hint */}
          <div>
            <label htmlFor="hint" className="block text-sm font-medium text-dark mb-1.5">
              Hint <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="hint"
              value={hint}
              onChange={e => setHint(e.target.value)}
              placeholder="A helpful hint"
              rows={2}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-dark mb-1.5">
              Note <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Additional notes"
              rows={2}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!question.trim() || !answer.trim()}
              className="flex-1 bg-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
            >
              {isEdit ? 'Save Changes' : 'Add Card'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/decks/${deckId}`)}
              className="flex-1 border border-border text-dark py-2.5 rounded-xl text-sm font-medium hover:bg-background transition"
            >
              Cancel
            </button>
          </div>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full text-danger text-sm font-medium py-2 hover:underline transition"
            >
              Delete this card
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default CardFormPage
