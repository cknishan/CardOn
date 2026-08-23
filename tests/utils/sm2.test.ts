import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { applySM2 } from '../../src/utils/sm2'
import type { Flashcard } from '../../src/models'
import type { Rating } from '../../src/utils/sm2'

function createCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 'test-id',
    deckId: 'test-deck',
    question: 'Q?',
    answer: 'A.',
    hint: null,
    note: null,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: '2024-01-15',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    deletedAt: null,
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2024-01-15'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('applySM2 — rating: again', () => {
  it('resets repetitions to 0', () => {
    const card = createCard({ repetitions: 10, interval: 100, easeFactor: 2.5 })
    const result = applySM2(card, 'again')
    expect(result.repetitions).toBe(0)
  })

  it('sets interval to 1', () => {
    const card = createCard({ interval: 100 })
    const result = applySM2(card, 'again')
    expect(result.interval).toBe(1)
  })

  it('leaves easeFactor unchanged', () => {
    const card = createCard({ easeFactor: 2.5 })
    const result = applySM2(card, 'again')
    expect(result.easeFactor).toBe(2.5)
  })

  it('dueDate is tomorrow', () => {
    const card = createCard()
    const result = applySM2(card, 'again')
    expect(result.dueDate).toBe('2024-01-16')
  })
})

describe('applySM2 — rating: hard', () => {
  it('sets repetitions to max(1, current)', () => {
    expect(applySM2(createCard({ repetitions: 0 }), 'hard').repetitions).toBe(1)
    expect(applySM2(createCard({ repetitions: 3 }), 'hard').repetitions).toBe(3)
    expect(applySM2(createCard({ repetitions: 5 }), 'hard').repetitions).toBe(5)
  })

  it('multiplies interval by 1.2, rounded, minimum 1', () => {
    expect(applySM2(createCard({ interval: 0 }), 'hard').interval).toBe(1)
    expect(applySM2(createCard({ interval: 1 }), 'hard').interval).toBe(1)
    expect(applySM2(createCard({ interval: 10 }), 'hard').interval).toBe(12)
    expect(applySM2(createCard({ interval: 20 }), 'hard').interval).toBe(24)
  })

  it('decreases easeFactor by 0.15, floor 1.3', () => {
    expect(applySM2(createCard({ easeFactor: 2.5 }), 'hard').easeFactor).toBe(2.35)
    expect(applySM2(createCard({ easeFactor: 1.4 }), 'hard').easeFactor).toBe(1.3)
    expect(applySM2(createCard({ easeFactor: 1.3 }), 'hard').easeFactor).toBe(1.3)
    expect(applySM2(createCard({ easeFactor: 1.0 }), 'hard').easeFactor).toBe(1.3)
  })
})

describe('applySM2 — rating: good', () => {
  it('increments repetitions', () => {
    const card = createCard({ repetitions: 0 })
    expect(applySM2(card, 'good').repetitions).toBe(1)
    expect(applySM2(createCard({ repetitions: 1 }), 'good').repetitions).toBe(2)
    expect(applySM2(createCard({ repetitions: 5 }), 'good').repetitions).toBe(6)
  })

  it('first good review sets interval to 1', () => {
    const result = applySM2(createCard({ repetitions: 0 }), 'good')
    expect(result.interval).toBe(1)
  })

  it('second good review sets interval to 6', () => {
    const result = applySM2(createCard({ repetitions: 1 }), 'good')
    expect(result.interval).toBe(6)
  })

  it('third+ good review multiplies interval by easeFactor', () => {
    const card = createCard({ repetitions: 2, interval: 10, easeFactor: 2.0 })
    const result = applySM2(card, 'good')
    expect(result.interval).toBe(20)
  })

  it('leaves easeFactor unchanged', () => {
    const card = createCard({ easeFactor: 2.0 })
    const result = applySM2(card, 'good')
    expect(result.easeFactor).toBe(2.0)
  })
})

describe('applySM2 — rating: easy', () => {
  it('increments repetitions', () => {
    expect(applySM2(createCard({ repetitions: 0 }), 'easy').repetitions).toBe(1)
    expect(applySM2(createCard({ repetitions: 3 }), 'easy').repetitions).toBe(4)
  })

  it('first easy review sets interval to 4', () => {
    const result = applySM2(createCard({ repetitions: 0 }), 'easy')
    expect(result.interval).toBe(4)
  })

  it('second easy review sets interval to 10', () => {
    const result = applySM2(createCard({ repetitions: 1 }), 'easy')
    expect(result.interval).toBe(10)
  })

  it('third+ easy review multiplies interval by easeFactor * 1.3', () => {
    const card = createCard({ repetitions: 2, interval: 10, easeFactor: 2.0 })
    const result = applySM2(card, 'easy')
    expect(result.interval).toBe(26)
  })

  it('increases easeFactor by 0.15, cap 2.5', () => {
    expect(applySM2(createCard({ easeFactor: 2.0 }), 'easy').easeFactor).toBe(2.15)
    expect(applySM2(createCard({ easeFactor: 2.4 }), 'easy').easeFactor).toBe(2.5)
    expect(applySM2(createCard({ easeFactor: 2.5 }), 'easy').easeFactor).toBe(2.5)
  })
})

describe('applySM2 — dueDate', () => {
  it('is a YYYY-MM-DD string N days from today', () => {
    const r1 = applySM2(createCard(), 'again')
    expect(r1.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const r2 = applySM2(createCard({ repetitions: 2, interval: 30, easeFactor: 2.0 }), 'good')
    expect(r2.dueDate).toBe('2024-03-15')
  })
})

describe('applySM2 — does not mutate input card', () => {
  it('returns a new object without modifying the input', () => {
    const card = createCard({ repetitions: 3, interval: 10, easeFactor: 2.5 })
    const original = { ...card }
    applySM2(card, 'again')
    expect(card.repetitions).toBe(original.repetitions)
    expect(card.interval).toBe(original.interval)
    expect(card.easeFactor).toBe(original.easeFactor)
    expect(card.dueDate).toBe(original.dueDate)
  })
})

describe('applySM2 — type-level correctness', () => {
  it('accepts all valid ratings without throwing', () => {
    const card = createCard()
    const ratings: Rating[] = ['again', 'hard', 'good', 'easy']
    for (const r of ratings) {
      expect(() => applySM2(card, r)).not.toThrow()
    }
  })
})
