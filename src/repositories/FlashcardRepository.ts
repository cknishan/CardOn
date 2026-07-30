import { db } from '../database/dexie'
import type { Flashcard } from '../models'

export const FlashcardRepository = {
  async getByDeckId(deckId: string): Promise<Flashcard[]> {
    return db.cards.where('deckId').equals(deckId).toArray()
  },

  async getDueByDeckId(deckId: string): Promise<Flashcard[]> {
    const today = new Date().toISOString().split('T')[0]
    const cards = await db.cards.where('deckId').equals(deckId).toArray()
    return cards.filter((c) => c.dueDate <= today)
  },

  async getDueCount(deckId: string): Promise<number> {
    const cards = await this.getDueByDeckId(deckId)
    return cards.length
  },

  async getTotalCount(deckId: string): Promise<number> {
    return db.cards.where('deckId').equals(deckId).count()
  },

  async getById(id: string): Promise<Flashcard | undefined> {
    return db.cards.get(id)
  },

  async create(data: {
    deckId: string
    question: string
    answer: string
    hint: string | null
    note: string | null
  }): Promise<string> {
    const now = new Date().toISOString()
    const today = now.split('T')[0]
    return db.cards.add({
      id: crypto.randomUUID(),
      deckId: data.deckId,
      question: data.question,
      answer: data.answer,
      hint: data.hint,
      note: data.note,
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: today,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    })
  },

  async update(
    id: string,
    changes: Partial<Omit<Flashcard, 'id' | 'deckId' | 'createdAt'>>
  ): Promise<void> {
    await db.cards.update(id, { ...changes, updatedAt: new Date().toISOString() })
  },

  async delete(id: string): Promise<void> {
    await db.cards.update(id, {
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  async hardDelete(id: string): Promise<void> {
    await db.cards.delete(id)
  },

  async bulkAdd(
    cards: Array<{
      deckId: string
      question: string
      answer: string
      hint: string | null
      note: string | null
    }>
  ): Promise<void> {
    const now = new Date().toISOString()
    const today = now.split('T')[0]
    const records = cards.map((card) => ({
      id: crypto.randomUUID(),
      deckId: card.deckId,
      question: card.question,
      answer: card.answer,
      hint: card.hint,
      note: card.note,
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: today,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }))
    await db.cards.bulkAdd(records)
  },
}
