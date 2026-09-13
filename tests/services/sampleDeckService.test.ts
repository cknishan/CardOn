import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SAMPLE_DECKS } from '../../src/data/sampleDecks'
import { FlashCardDatabase } from '../../src/database/dexie'
import type { Deck } from '../../src/models'
import { seedSampleDecks } from '../../src/services/SampleDeckService'

let database: FlashCardDatabase

beforeEach(() => {
  database = new FlashCardDatabase()
})

afterEach(async () => {
  await database.delete()
})

describe('sample deck seeding', () => {
  it('creates three decks with six immediately studyable cards each', async () => {
    await expect(seedSampleDecks(database)).resolves.toBe(true)

    const decks = await database.decks.toArray()
    const cards = await database.cards.toArray()
    const today = new Date().toISOString().split('T')[0]

    expect(decks.map((deck) => deck.name).sort()).toEqual(
      SAMPLE_DECKS.map((deck) => deck.name).sort()
    )
    expect(decks).toHaveLength(3)
    expect(cards).toHaveLength(18)

    for (const deck of decks) {
      expect(cards.filter((card) => card.deckId === deck.id)).toHaveLength(6)
    }

    for (const card of cards) {
      expect(card).toMatchObject({
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: today,
        hint: null,
        note: null,
        deletedAt: null,
      })
    }
  })

  it('does not add samples when a deck already exists', async () => {
    const now = new Date().toISOString()
    const existingDeck: Deck = {
      id: 'existing-deck',
      name: 'My Deck',
      description: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    await database.decks.add(existingDeck)

    await expect(seedSampleDecks(database)).resolves.toBe(false)
    expect(await database.decks.toArray()).toEqual([existingDeck])
    expect(await database.cards.count()).toBe(0)
  })

  it('rolls back deck creation when card creation fails', async () => {
    vi.spyOn(database.cards, 'bulkAdd').mockRejectedValueOnce(new Error('Card insert failed'))

    await expect(seedSampleDecks(database)).rejects.toThrow('Card insert failed')
    expect(await database.decks.count()).toBe(0)
    expect(await database.cards.count()).toBe(0)
  })

  it('contains no emoji characters in the sample content', () => {
    expect(JSON.stringify(SAMPLE_DECKS)).not.toMatch(/\p{Extended_Pictographic}/u)
  })
})
