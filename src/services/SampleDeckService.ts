import { db, type FlashCardDatabase } from '../database/dexie'
import { SAMPLE_DECKS } from '../data/sampleDecks'
import type { Deck, Flashcard } from '../models'

export async function seedSampleDecks(database: FlashCardDatabase = db): Promise<boolean> {
  return database.transaction('rw', database.decks, database.cards, async () => {
    if ((await database.decks.count()) > 0) return false

    const now = new Date().toISOString()
    const today = now.split('T')[0]
    const decks: Deck[] = []
    const cards: Flashcard[] = []

    for (const sampleDeck of SAMPLE_DECKS) {
      const deckId = crypto.randomUUID()

      decks.push({
        id: deckId,
        name: sampleDeck.name,
        description: sampleDeck.description,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      })

      for (const sampleCard of sampleDeck.cards) {
        cards.push({
          id: crypto.randomUUID(),
          deckId,
          question: sampleCard.question,
          answer: sampleCard.answer,
          hint: null,
          note: null,
          interval: 0,
          repetitions: 0,
          easeFactor: 2.5,
          dueDate: today,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        })
      }
    }

    await database.decks.bulkAdd(decks)
    await database.cards.bulkAdd(cards)
    return true
  })
}
