import { db } from './index'
import type { Card, Deck } from '../types'

export async function getDeckById(id: string): Promise<Deck | undefined> {
  return db.decks.get(id)
}

export async function getCardsByDeckId(deckId: string): Promise<Card[]> {
  return db.cards.where('deckId').equals(deckId).toArray()
}

export async function getDueCardsByDeckId(deckId: string): Promise<Card[]> {
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
