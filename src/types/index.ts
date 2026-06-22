/**
 * @module Types
 * @description Core TypeScript interfaces for the Flash Card App data models.
 * These types define the shape of all persisted entities used throughout the application.
 */

/**
 * Represents a flash card deck — a named collection of cards.
 */
export interface Deck {
  /** UUID primary key */
  id: string
  /** Display name, max 100 characters */
  name: string
  /** ISO date string when the deck was created */
  createdAt: string
  /** ISO date string when the deck was last modified */
  updatedAt: string
}

/**
 * Represents a single flash card with spaced repetition metadata.
 */
export interface Card {
  /** UUID primary key */
  id: string
  /** Foreign key referencing Deck.id */
  deckId: string
  /** Front side of the card (required) */
  question: string
  /** Back side of the card (required) */
  answer: string
  /** Optional hint displayed before revealing the answer */
  hint: string | null
  /** Optional note displayed alongside the answer */
  note: string | null
  /** Current interval in days until next review */
  interval: number
  /** Number of consecutive correct reviews */
  repetitions: number
  /** Ease factor for interval calculation, range 1.3–2.5, starting at 2.5 */
  easeFactor: number
  /** ISO date (YYYY-MM-DD) when the card is next due for review */
  dueDate: string
  /** ISO date string when the card was created */
  createdAt: string
  /** ISO date string when the card was last modified */
  updatedAt: string
}

/**
 * Tracks a single study session for progress reporting.
 */
export interface StudySession {
  /** UUID primary key */
  id: string
  /** Foreign key referencing Deck.id */
  deckId: string
  /** ISO datetime when the session began */
  startedAt: string
  /** ISO datetime when the session ended */
  completedAt: string
  /** Total number of cards reviewed in this session */
  cardsReviewed: number
  /** Number of cards rated "Again" */
  againCount: number
  /** Number of cards rated "Hard" */
  hardCount: number
  /** Number of cards rated "Good" */
  goodCount: number
  /** Number of cards rated "Easy" */
  easyCount: number
}

/**
 * The four possible ratings a user can assign during a study session.
 */
export type Rating = 'again' | 'hard' | 'good' | 'easy'