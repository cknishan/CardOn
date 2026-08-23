export interface Flashcard {
  id: string
  deckId: string
  question: string
  answer: string
  hint: string | null
  note: string | null
  interval: number
  repetitions: number
  easeFactor: number
  dueDate: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
