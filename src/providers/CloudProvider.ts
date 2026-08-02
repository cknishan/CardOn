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
  login(): Promise<CloudUser>
  logout(): Promise<void>
  getUser(): CloudUser | null
  uploadAll(data: SyncPayload): Promise<void>
  downloadAll(): Promise<SyncPayload>
}
