/**
 * @module MockData
 * @description Provides mock decks, cards, and study sessions for development
 * and testing. Exports query helpers that mirror the eventual Dexie API shape
 * so pages work identically once real persistence is connected.
 */

import type { Deck, Card, StudySession } from '../types'

/**
 * Returns an ISO date string for `n` days in the past.
 * @param n - Number of days to go back
 * @returns YYYY-MM-DD date string
 */
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

/**
 * Returns an ISO date string for `n` days in the future.
 * @param n - Number of days ahead
 * @returns YYYY-MM-DD date string
 */
function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

/** Mock deck data — 3 sample decks with different creation dates. */
export const mockDecks: Deck[] = [
  { id: '1', name: 'French Basics', createdAt: daysAgo(14), updatedAt: daysAgo(1) },
  { id: '2', name: 'Statistics', createdAt: daysAgo(10), updatedAt: daysAgo(5) },
  { id: '3', name: 'Python Fundamentals', createdAt: daysAgo(7), updatedAt: daysAgo(0) },
]

/** Mock card data — 17 cards spread across 3 decks with varied SR states. */
export const mockCards: Card[] = [
  { id: 'c1', deckId: '1', question: 'What is "hello" in French?', answer: 'Bonjour', hint: 'Informal greeting', note: 'Use with friends', interval: 1, repetitions: 3, easeFactor: 2.5, dueDate: daysAgo(1), createdAt: daysAgo(14), updatedAt: daysAgo(1) },
  { id: 'c2', deckId: '1', question: 'What is "thank you" in French?', answer: 'Merci', hint: null, note: 'Polite expression', interval: 6, repetitions: 2, easeFactor: 2.35, dueDate: daysFromNow(2), createdAt: daysAgo(14), updatedAt: daysAgo(3) },
  { id: 'c3', deckId: '1', question: 'What is "goodbye" in French?', answer: 'Au revoir', hint: 'Literally: "to see again"', note: null, interval: 1, repetitions: 1, easeFactor: 2.5, dueDate: daysAgo(0), createdAt: daysAgo(12), updatedAt: daysAgo(0) },
  { id: 'c4', deckId: '1', question: 'How do you say "water" in French?', answer: 'Eau', hint: null, note: null, interval: 4, repetitions: 0, easeFactor: 2.5, dueDate: daysFromNow(3), createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 'c5', deckId: '1', question: 'What is "please" in French?', answer: 'S\'il vous plaît', hint: 'Formal version', note: null, interval: 1, repetitions: 4, easeFactor: 2.5, dueDate: daysAgo(1), createdAt: daysAgo(14), updatedAt: daysAgo(1) },
  { id: 'c6', deckId: '1', question: 'How do you count to 5 in French?', answer: 'Un, deux, trois, quatre, cinq', hint: 'First three are easy', note: 'Practice pronunciation', interval: 10, repetitions: 1, easeFactor: 2.5, dueDate: daysFromNow(5), createdAt: daysAgo(8), updatedAt: daysAgo(8) },
  { id: 'c7', deckId: '1', question: 'What is "yes" and "no" in French?', answer: 'Oui / Non', hint: null, note: null, interval: 1, repetitions: 5, easeFactor: 2.5, dueDate: daysAgo(2), createdAt: daysAgo(14), updatedAt: daysAgo(2) },
  { id: 'c8', deckId: '1', question: 'What is "friend" in French?', answer: 'Ami (masc.) / Amie (fem.)', hint: 'Same root as "amicable"', note: null, interval: 1, repetitions: 2, easeFactor: 2.5, dueDate: daysAgo(0), createdAt: daysAgo(12), updatedAt: daysAgo(0) },
  { id: 'c9', deckId: '1', question: 'How do you say "I love you" in French?', answer: 'Je t\'aime', hint: null, note: 'Common phrase', interval: 15, repetitions: 1, easeFactor: 2.5, dueDate: daysFromNow(10), createdAt: daysAgo(6), updatedAt: daysAgo(6) },
  { id: 'c10', deckId: '1', question: 'What is "excuse me" in French?', answer: 'Excusez-moi', hint: 'Formal', note: null, interval: 1, repetitions: 3, easeFactor: 2.5, dueDate: daysAgo(1), createdAt: daysAgo(13), updatedAt: daysAgo(1) },

  { id: 'c11', deckId: '2', question: 'What is a p-value?', answer: 'Probability of observing results at least as extreme as the ones obtained, assuming the null hypothesis is true.', hint: 'Think "probability under null"', note: null, interval: 1, repetitions: 2, easeFactor: 2.5, dueDate: daysFromNow(1), createdAt: daysAgo(10), updatedAt: daysAgo(2) },
  { id: 'c12', deckId: '2', question: 'What is the Central Limit Theorem?', answer: 'The distribution of sample means approaches a normal distribution as sample size increases, regardless of population distribution.', hint: 'CLT', note: 'Key: n ≥ 30 is often sufficient', interval: 5, repetitions: 1, easeFactor: 2.5, dueDate: daysFromNow(4), createdAt: daysAgo(9), updatedAt: daysAgo(9) },
  { id: 'c13', deckId: '2', question: 'What is ANOVA used for?', answer: 'Comparing means of 3 or more groups to determine if at least one is significantly different.', hint: null, note: 'Parametric test', interval: 3, repetitions: 2, easeFactor: 2.5, dueDate: daysFromNow(2), createdAt: daysAgo(8), updatedAt: daysAgo(5) },

  { id: 'c14', deckId: '3', question: 'What is a list comprehension in Python?', answer: 'A concise way to create lists using the syntax [expression for item in iterable if condition]', hint: 'Replaces map/filter', note: null, interval: 1, repetitions: 3, easeFactor: 2.5, dueDate: daysAgo(1), createdAt: daysAgo(7), updatedAt: daysAgo(1) },
  { id: 'c15', deckId: '3', question: 'What is the difference between a tuple and a list?', answer: 'Tuples are immutable (cannot be changed after creation), lists are mutable.', hint: 'Tuple = constant', note: 'Tuples use (), lists use []', interval: 1, repetitions: 1, easeFactor: 2.5, dueDate: daysAgo(0), createdAt: daysAgo(6), updatedAt: daysAgo(0) },
  { id: 'c16', deckId: '3', question: 'What is a decorator in Python?', answer: 'A function that takes another function and extends its behavior without explicitly modifying it.', hint: 'Uses @ syntax', note: null, interval: 4, repetitions: 0, easeFactor: 2.5, dueDate: daysFromNow(3), createdAt: daysAgo(5), updatedAt: daysAgo(5) },
  { id: 'c17', deckId: '3', question: 'What does *args and **kwargs mean?', answer: '*args passes variable number of positional arguments, **kwargs passes variable keyword arguments.', hint: 'args = arguments, kwargs = keyword arguments', note: null, interval: 1, repetitions: 2, easeFactor: 2.5, dueDate: daysAgo(0), createdAt: daysAgo(7), updatedAt: daysAgo(0) },
]

/** Mock study session history for progress tracking display. */
export const mockStudySessions: StudySession[] = [
  { id: 's1', deckId: '1', startedAt: daysAgo(2) + 'T10:00:00', completedAt: daysAgo(2) + 'T10:15:00', cardsReviewed: 8, againCount: 2, hardCount: 1, goodCount: 4, easyCount: 1 },
  { id: 's2', deckId: '1', startedAt: daysAgo(1) + 'T09:30:00', completedAt: daysAgo(1) + 'T09:45:00', cardsReviewed: 6, againCount: 1, hardCount: 2, goodCount: 3, easyCount: 0 },
  { id: 's3', deckId: '3', startedAt: daysAgo(0) + 'T14:00:00', completedAt: daysAgo(0) + 'T14:12:00', cardsReviewed: 5, againCount: 1, hardCount: 0, goodCount: 3, easyCount: 1 },
]

/**
 * Looks up a deck by its ID.
 * @param id - The deck UUID
 * @returns The matching Deck, or undefined if not found
 */
export function getDeckById(id: string): Deck | undefined {
  return mockDecks.find(d => d.id === id)
}

/**
 * Returns all cards belonging to a specific deck.
 * @param deckId - The deck UUID to filter by
 * @returns Array of cards in the given deck
 */
export function getCardsByDeckId(deckId: string): Card[] {
  return mockCards.filter(c => c.deckId === deckId)
}

/**
 * Returns all cards due for review (dueDate <= today) for a given deck.
 * @param deckId - The deck UUID to filter by
 * @returns Array of cards that are due
 */
export function getDueCardsByDeckId(deckId: string): Card[] {
  const today = new Date().toISOString().split('T')[0]
  return mockCards.filter(c => c.deckId === deckId && c.dueDate <= today)
}

/**
 * Counts how many cards are due for review in a deck.
 * @param deckId - The deck UUID
 * @returns Number of due cards
 */
export function getDueCount(deckId: string): number {
  return getDueCardsByDeckId(deckId).length
}

/**
 * Counts the total number of cards in a deck.
 * @param deckId - The deck UUID
 * @returns Total card count
 */
export function getTotalCardsCount(deckId: string): number {
  return getCardsByDeckId(deckId).length
}

/**
 * Generates a short random ID (for mock data entries).
 * Uses base-36 encoding of a random number for compact IDs.
 * @returns A random alphanumeric string (~9 characters)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}
