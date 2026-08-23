import Dexie, { type Table } from 'dexie'
import type { Deck, Flashcard, StudySession } from '../models'

export class FlashCardDatabase extends Dexie {
  decks!: Table<Deck, string>
  cards!: Table<Flashcard, string>
  studySessions!: Table<StudySession, string>

  constructor() {
    super('FlashCardApp')

    this.version(1).stores({
      decks: 'id, name, createdAt, updatedAt',
      cards: 'id, deckId, dueDate, createdAt',
      studySessions: 'id, deckId, startedAt, completedAt',
    })
  }
}

export const db = new FlashCardDatabase()
