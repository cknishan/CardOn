/**
 * @module Database
 * @description Dexie.js IndexedDB wrapper for local-first data persistence.
 * Defines the database schema, table indexes, and exports a singleton instance.
 *
 * @see {@link https://dexie.org/}
 */

import Dexie, { type Table } from 'dexie'
import type { Deck, Card, StudySession } from '../types'

/**
 * IndexedDB database for the Flash Card App.
 * Uses Dexie.js for a promise-based API over the native IndexedDB.
 *
 * @example
 * ```ts
 * import { db } from '../db'
 * const decks = await db.decks.toArray()
 * ```
 */
export class FlashCardDatabase extends Dexie {
  /** Decks table — stores all flash card decks */
  decks!: Table<Deck, string>
  /** Cards table — stores all flash cards with spaced repetition metadata */
  cards!: Table<Card, string>
  /** Study sessions table — logs completed review sessions */
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

/** Singleton database instance used throughout the application. */
export const db = new FlashCardDatabase()

/*
 * ── Index Reference ─────────────────────────────────────────────────────
 *
 *  decks:  'id, name, createdAt, updatedAt'
 *    id        – Primary key (required)
 *    name      – Search/filter decks by name
 *    createdAt – Sort by creation date
 *    updatedAt – Sync preparation (future use)
 *
 *  cards:  'id, deckId, dueDate, createdAt'
 *    id        – Primary key
 *    deckId    – Get all cards in a deck (critical)
 *    dueDate   – Query cards due on or before today (critical)
 *    createdAt – Sort by creation
 *
 *  studySessions:  'id, deckId, startedAt, completedAt'
 *    id          – Primary key
 *    deckId      – Get session history per deck
 *    startedAt   – Weekly summary queries
 *    completedAt – Calculate completion time
 */
