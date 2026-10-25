import type { Deck, Flashcard, StudySession } from '../models'

export interface SyncPayload {
  decks: Deck[]
  flashcards: Flashcard[]
  studySessions: StudySession[]
}

export interface CloudUser {
  id: string
  email: string
}

export interface CloudProvider {
  login(): Promise<void>
  logout(): Promise<void>
  deleteAccount(): Promise<void>
  getUser(): CloudUser | null
  onAuthChange(callback: (user: CloudUser | null) => void): () => void
  uploadAll(data: SyncPayload): Promise<void>
  downloadAll(): Promise<SyncPayload>
}
