import Dexie, { type Table } from 'dexie'
import type { Deck, Card, StudySession } from '../types'

export class FlashCardDatabase extends Dexie {
  decks!: Table<Deck, string>
  cards!: Table<Card, string>
  studySessions!: Table<StudySession, string>

  constructor() {
    super('FlashCardApp')
    this.version(1).stores({
      decks: 'id, name, createdAt, updatedAt',
      cards: 'id, deckId, dueDate, interval, repetitions, easeFactor, createdAt, updatedAt',
      studySessions: 'id, deckId, startedAt, completedAt'
    })
  }
}

export const db = new FlashCardDatabase()

// =====================================================
// Decks table indexes
// =====================================================
// id - Primary key (always required)
// name - Search/filter decks by name
// createdAt - Sort by oldest/newest
// updatedAt  - Sync preparation (future)


// =====================================================
// Cards table indexes
// =====================================================
// id - Primary key
// deckId - Critical: get all cards in a deck
// dueDate - Critical: query cards where dueDate <= today
// interval - Analytics (future)
// repetitions - Analytics (future)
// easeFactor - Analytics (future)
// createdAt - Sort by creation
// updatedAt - Sync preparation (future)

// =====================================================
// StudySessions table indexes
// =====================================================
// id - Primary key
// deckId - Get session history per deck
// startedAt - Weekly summary queries
// completedAt - Calculate completion time