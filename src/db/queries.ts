import { db } from '../database/dexie'
import type { Deck, Flashcard } from '../models'

export async function getDeckById(id: string): Promise<Deck | undefined> {
  return db.decks.get(id)
}

export async function getCardsByDeckId(deckId: string): Promise<Flashcard[]> {
  return db.cards.where('deckId').equals(deckId).toArray()
}

export async function getDueCardsByDeckId(deckId: string): Promise<Flashcard[]> {
  const today = new Date().toISOString().split('T')[0]
  const cards = await db.cards.where('deckId').equals(deckId).toArray()
  return cards.filter((c) => c.dueDate <= today)
}

export async function getDueCount(deckId: string): Promise<number> {
  const cards = await getDueCardsByDeckId(deckId)
  return cards.length
}

export async function getTotalCardsCount(deckId: string): Promise<number> {
  return db.cards.where('deckId').equals(deckId).count()
}

export async function getAllDecks(): Promise<Deck[]> {
  return db.decks.toArray()
}
