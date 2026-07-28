import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FlashCardDatabase } from '../../src/database/dexie'
import type { Deck, Flashcard, StudySession } from '../../src/models'

let db: FlashCardDatabase

function deck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: 'deck-1',
    name: 'Test Deck',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    deletedAt: null,
    ...overrides,
  }
}

function card(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 'card-1',
    deckId: 'deck-1',
    question: 'Question?',
    answer: 'Answer.',
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

function session(overrides: Partial<StudySession> = {}): StudySession {
  return {
    id: 'session-1',
    deckId: 'deck-1',
    startedAt: '2024-01-15T10:00:00.000Z',
    completedAt: '2024-01-15T10:30:00.000Z',
    cardsReviewed: 10,
    againCount: 2,
    hardCount: 1,
    goodCount: 5,
    easyCount: 2,
    deletedAt: null,
    ...overrides,
  }
}

beforeEach(() => {
  db = new FlashCardDatabase()
})

afterEach(async () => {
  await db.delete()
})

describe('decks', () => {
  it('adds and retrieves a deck by id', async () => {
    await db.decks.add(deck())
    const result = await db.decks.get('deck-1')
    expect(result).toEqual(deck())
  })

  it('returns undefined for a non-existent deck', async () => {
    const result = await db.decks.get('non-existent')
    expect(result).toBeUndefined()
  })

  it('lists all decks with toArray', async () => {
    await db.decks.bulkAdd([deck({ id: 'd1', name: 'Deck A' }), deck({ id: 'd2', name: 'Deck B' })])
    const all = await db.decks.toArray()
    expect(all).toHaveLength(2)
    expect(all.map((d) => d.name)).toEqual(['Deck A', 'Deck B'])
  })

  it('updates a deck name', async () => {
    await db.decks.add(deck())
    const updated = await db.decks.update('deck-1', { name: 'Renamed' })
    expect(updated).toBe(1)
    const result = await db.decks.get('deck-1')
    expect(result!.name).toBe('Renamed')
  })

  it('updating a non-existent deck returns 0', async () => {
    const updated = await db.decks.update('nope', { name: 'Nope' })
    expect(updated).toBe(0)
  })

  it('deletes a deck', async () => {
    await db.decks.add(deck())
    await db.decks.delete('deck-1')
    const result = await db.decks.get('deck-1')
    expect(result).toBeUndefined()
  })

  it('deleting a non-existent deck does not throw', async () => {
    await expect(db.decks.delete('nope')).resolves.toBeUndefined()
  })

  it('clears all decks', async () => {
    await db.decks.bulkAdd([deck({ id: 'd1' }), deck({ id: 'd2' })])
    await db.decks.clear()
    const all = await db.decks.toArray()
    expect(all).toEqual([])
  })
})

describe('cards', () => {
  it('adds and retrieves a card by id', async () => {
    await db.cards.add(card())
    const result = await db.cards.get('card-1')
    expect(result).toEqual(card())
  })

  it('returns undefined for a non-existent card', async () => {
    const result = await db.cards.get('nope')
    expect(result).toBeUndefined()
  })

  it('lists cards for a given deckId', async () => {
    await db.cards.bulkAdd([
      card({ id: 'c1', deckId: 'deck-a' }),
      card({ id: 'c2', deckId: 'deck-a' }),
      card({ id: 'c3', deckId: 'deck-b' }),
    ])
    const deckACards = await db.cards.where('deckId').equals('deck-a').toArray()
    expect(deckACards).toHaveLength(2)
    expect(deckACards.map((c) => c.id)).toEqual(['c1', 'c2'])
  })

  it('returns empty array when deck has no cards', async () => {
    const cards = await db.cards.where('deckId').equals('empty-deck').toArray()
    expect(cards).toEqual([])
  })

  it('queries due cards by date', async () => {
    const today = '2024-01-15'
    await db.cards.bulkAdd([
      card({ id: 'c1', dueDate: '2024-01-14' }),
      card({ id: 'c2', dueDate: '2024-01-15' }),
      card({ id: 'c3', dueDate: '2024-01-16' }),
    ])
    const dueCards = await db.cards.where('dueDate').belowOrEqual(today).toArray()
    expect(dueCards).toHaveLength(2)
    expect(dueCards.map((c) => c.id)).toEqual(['c1', 'c2'])
  })

  it('filters due cards for a specific deck', async () => {
    const today = '2024-01-15'
    await db.cards.bulkAdd([
      card({ id: 'c1', deckId: 'deck-x', dueDate: '2024-01-14' }),
      card({ id: 'c2', deckId: 'deck-x', dueDate: '2024-01-16' }),
      card({ id: 'c3', deckId: 'deck-y', dueDate: '2024-01-14' }),
    ])
    const due = await db.cards
      .where('deckId')
      .equals('deck-x')
      .filter((c) => c.dueDate <= today)
      .toArray()
    expect(due).toHaveLength(1)
    expect(due[0].id).toBe('c1')
  })

  it('updates card SM-2 fields', async () => {
    await db.cards.add(card())
    const updated = await db.cards.update('card-1', {
      interval: 6,
      repetitions: 2,
      easeFactor: 2.6,
      dueDate: '2024-01-21',
    })
    expect(updated).toBe(1)
    const result = await db.cards.get('card-1')
    expect(result!.interval).toBe(6)
    expect(result!.repetitions).toBe(2)
    expect(result!.easeFactor).toBe(2.6)
    expect(result!.dueDate).toBe('2024-01-21')
  })

  it('deletes a card', async () => {
    await db.cards.add(card())
    await db.cards.delete('card-1')
    const result = await db.cards.get('card-1')
    expect(result).toBeUndefined()
  })

  it('clears all cards', async () => {
    await db.cards.bulkAdd([card({ id: 'c1' }), card({ id: 'c2' })])
    await db.cards.clear()
    const all = await db.cards.toArray()
    expect(all).toEqual([])
  })
})

describe('study sessions', () => {
  it('adds and retrieves a session by id', async () => {
    await db.studySessions.add(session())
    const result = await db.studySessions.get('session-1')
    expect(result).toEqual(session())
  })

  it('lists sessions for a given deckId', async () => {
    await db.studySessions.bulkAdd([
      session({ id: 's1', deckId: 'deck-a' }),
      session({ id: 's2', deckId: 'deck-a' }),
      session({ id: 's3', deckId: 'deck-b' }),
    ])
    const deckASessions = await db.studySessions.where('deckId').equals('deck-a').toArray()
    expect(deckASessions).toHaveLength(2)
    expect(deckASessions.map((s) => s.id)).toEqual(['s1', 's2'])
  })

  it('clears all sessions', async () => {
    await db.studySessions.add(session())
    await db.studySessions.clear()
    const all = await db.studySessions.toArray()
    expect(all).toEqual([])
  })
})

describe('cross-table operations', () => {
  it('cards survive deck deletion (no cascade)', async () => {
    await db.decks.add(deck({ id: 'd1' }))
    await db.cards.add(card({ id: 'c1', deckId: 'd1' }))
    await db.decks.delete('d1')
    const remainingCards = await db.cards.where('deckId').equals('d1').toArray()
    expect(remainingCards).toHaveLength(1)
    expect(remainingCards[0].id).toBe('c1')
  })

  it('bulk delete all tables', async () => {
    await db.decks.add(deck())
    await db.cards.add(card())
    await db.studySessions.add(session())
    await db.decks.clear()
    await db.cards.clear()
    await db.studySessions.clear()
    expect(await db.decks.toArray()).toEqual([])
    expect(await db.cards.toArray()).toEqual([])
    expect(await db.studySessions.toArray()).toEqual([])
  })

  it('populates all three tables independently', async () => {
    await db.decks.add(deck({ id: 'd1', name: 'Languages' }))
    await db.cards.add(card({ id: 'c1', deckId: 'd1' }))
    await db.studySessions.add(session({ id: 's1', deckId: 'd1' }))
    const d = await db.decks.get('d1')
    const c = await db.cards.get('c1')
    const s = await db.studySessions.get('s1')
    expect(d).toBeDefined()
    expect(c).toBeDefined()
    expect(s).toBeDefined()
    expect(c!.deckId).toBe(d!.id)
    expect(s!.deckId).toBe(d!.id)
  })
})
