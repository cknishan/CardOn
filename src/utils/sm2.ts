/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Implements a simplified version of the SuperMemo SM-2 algorithm.
 * Given a card and a user's recall rating, it computes updated
 * spaced repetition fields: interval, repetitions, ease factor, and due date.
 *
 * Reference: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-work-of-education
 */

import type { Flashcard } from '../models'

/**
 * The four possible ratings a user can assign during a study session.
 * - again: Complete forget — card resets to day 1
 * - hard: Recalled with difficulty — interval grows modestly
 * - good: Normal recall — standard interval growth
 * - easy: Effortless recall — interval accelerates
 */
export type Rating = 'again' | 'hard' | 'good' | 'easy'

/**
 * Visual configuration for each rating button in the UI.
 */
export interface RatingConfig {
  label: string
  color: string
  bg: string
  textColor: string
}

/**
 * Predefined visual styles for the four ratings.
 * Used by StudySessionPage to render the rating buttons.
 */
export const RATINGS: Record<Rating, RatingConfig> = {
  again: { label: 'Again', color: 'bg-again-bg', bg: 'bg-again-bg', textColor: 'text-again-text' },
  hard: { label: 'Hard', color: 'bg-hard-bg', bg: 'bg-hard-bg', textColor: 'text-hard-text' },
  good: { label: 'Good', color: 'bg-good-bg', bg: 'bg-good-bg', textColor: 'text-good-text' },
  easy: { label: 'Easy', color: 'bg-easy-bg', bg: 'bg-easy-bg', textColor: 'text-easy-text' },
}

/**
 * The set of SM-2 fields that get updated after a review.
 */
export interface SM2Result {
  interval: number
  repetitions: number
  easeFactor: number
  dueDate: string
}

/**
 * Applies the SM-2 algorithm to a card based on the user's recall rating.
 *
 * Rules per rating:
 * - again:  Reset — repetitions = 0, interval = 1 day (due tomorrow)
 * - hard:   Slight penalty — interval = max(1, round(interval * 1.2)),
 *           easeFactor -= 0.15 (floor 1.3), repetitions = max(1, current)
 * - good:   Normal — repetitions++, 1st → 1d, 2nd → 6d, then interval * easeFactor
 * - easy:   Bonus — repetitions++, 1st → 4d, 2nd → 10d, then interval * easeFactor * 1.3,
 *           easeFactor += 0.15 (cap 2.5)
 *
 * @param card   - The card being reviewed
 * @param rating - User's self-assessed recall quality
 * @returns Updated SM-2 fields (does not mutate the input card)
 */
export function applySM2(card: Flashcard, rating: Rating): SM2Result {
  let interval = card.interval
  let repetitions = card.repetitions
  let easeFactor = card.easeFactor

  if (rating === 'again') {
    // Complete reset — start over from day 1
    repetitions = 0
    interval = 1
  } else if (rating === 'hard') {
    // Recalled with difficulty: small interval increase, ease factor penalty
    repetitions = Math.max(1, repetitions)
    interval = Math.max(1, Math.round(interval * 1.2))
    easeFactor = Math.max(1.3, easeFactor - 0.15)
  } else if (rating === 'good') {
    // Normal recall: standard spacing
    repetitions += 1
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
  } else if (rating === 'easy') {
    // Effortless recall: faster growth, ease factor bonus
    repetitions += 1
    if (repetitions === 1) {
      interval = 4
    } else if (repetitions === 2) {
      interval = 10
    } else {
      interval = Math.round(interval * easeFactor * 1.3)
    }
    easeFactor = Math.min(2.5, easeFactor + 0.15)
  }

  // Schedule next review: today + interval days
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    interval,
    repetitions,
    easeFactor,
    dueDate: dueDate.toISOString().split('T')[0],
  }
}
