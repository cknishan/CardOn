import { db } from '../database/dexie'
import type { Deck } from '../models'

export const DeckRepository = {
  async getAll(): Promise<Deck[]> {
    return db.decks.toArray()
  },

  async getById(id: string): Promise<Deck | undefined> {
    return db.decks.get(id)
  },

  async create(data: { name: string }): Promise<string> {
    const now = new Date().toISOString()
    return db.decks.add({
      id: crypto.randomUUID(),
      name: data.name,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    })
  },

  async update(id: string, changes: Partial<Pick<Deck, 'name' | 'deletedAt'>>): Promise<void> {
    await db.decks.update(id, { ...changes, updatedAt: new Date().toISOString() })
  },

  async delete(id: string): Promise<void> {
    await db.decks.update(id, {
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  async hardDelete(id: string): Promise<void> {
    await db.cards.where('deckId').equals(id).delete()
    await db.decks.delete(id)
  },
}
