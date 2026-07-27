import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../db'
import { getDeckById } from '../db/queries'
import { parseMarkdown } from '../utils/markdownParser'

import type { ParsedCard } from '../utils/markdownParser'
import type { Deck } from '../types'

function ImportPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [deck, setDeck] = useState<Deck | undefined>()
  const [parsedCards, setParsedCards] = useState<ParsedCard[]>([])
  const [fileName, setFileName] = useState('')
  const [imported, setImported] = useState(false)
  const [successCount, setSuccessCount] = useState(0)
  const [errorCards, setErrorCards] = useState<ParsedCard[]>([])

  useEffect(() => {
    if (!deckId) return
    getDeckById(deckId).then(setDeck)
  }, [deckId])

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

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const cards = parseMarkdown(text)
      setParsedCards(cards)
      setImported(false)
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const cards = parseMarkdown(text)
      setParsedCards(cards)
      setImported(false)
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    let success = 0
    const errors: ParsedCard[] = []
    const toAdd: Parameters<typeof db.cards.bulkAdd>[0] = []

    for (const card of parsedCards) {
      if (card.errors.length > 0 || card.question === '(missing)' || card.answer === '(missing)') {
        errors.push(card)
        continue
      }
      toAdd.push({
        id: crypto.randomUUID(),
        deckId: deckId!,
        question: card.question,
        answer: card.answer,
        hint: card.hint || null,
        note: card.note || null,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      success++
    }

    if (toAdd.length > 0) {
      await db.cards.bulkAdd(toAdd)
    }

    setSuccessCount(success)
    setErrorCards(errors)
    setImported(true)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(`/decks/${deckId}`)}
          className="text-sm text-muted hover:text-dark transition mb-4 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {deck.name}
        </button>

        <h1 className="text-2xl font-bold text-dark mb-2">Import Cards from Markdown</h1>
        <p className="text-sm text-muted mb-6">
          Upload a <code className="bg-border/50 px-1.5 py-0.5 rounded text-xs">.md</code> or{' '}
          <code className="bg-border/50 px-1.5 py-0.5 rounded text-xs">.txt</code> file with cards
          formatted using Q:, A:, Hint:, Note: syntax.
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="bg-surface border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-4xl mb-3">📄</div>
          <p className="text-sm font-medium text-dark mb-1">
            {fileName || 'Drop your file here, or click to browse'}
          </p>
          <p className="text-xs text-muted">Supports .md and .txt files</p>
        </div>

        {parsedCards.length > 0 && !imported && (
          <div className="mt-6 bg-surface rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-dark mb-3">
              Preview ({parsedCards.length} card{parsedCards.length !== 1 ? 's' : ''} parsed)
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {parsedCards.map((card, i) => (
                <div
                  key={i}
                  className={`text-xs p-3 rounded-lg ${card.errors.length > 0 ? 'bg-again-bg' : 'bg-good-bg'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">Q: {card.question}</span>
                    {card.errors.length > 0 && (
                      <span className="text-again-text shrink-0 ml-2">
                        {card.errors.join('; ')}
                      </span>
                    )}
                  </div>
                  <span className="text-muted">A: {card.answer}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleImport}
                className="flex-1 bg-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Import {parsedCards.length} card{parsedCards.length !== 1 ? 's' : ''}
              </button>
              <button
                onClick={() => {
                  setParsedCards([])
                  setFileName('')
                }}
                className="flex-1 border border-border text-dark py-2.5 rounded-xl text-sm font-medium hover:bg-background transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {imported && (
          <div className="mt-6 bg-surface rounded-xl border border-border p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-lg font-semibold text-success mb-2">
              {successCount} card{successCount !== 1 ? 's' : ''} imported successfully!
            </h2>
            {errorCards.length > 0 && (
              <div className="mt-3 text-left">
                <p className="text-sm font-medium text-again-text mb-2">
                  {errorCards.length} card{errorCards.length !== 1 ? 's' : ''} skipped due to
                  errors:
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {errorCards.map((card, i) => (
                    <p key={i} className="text-xs text-muted">
                      Q: {card.question} — {card.errors.join('; ')}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => navigate(`/decks/${deckId}`)}
              className="mt-5 bg-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Back to {deck.name}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportPage
