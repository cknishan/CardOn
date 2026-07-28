export interface StudySession {
  id: string
  deckId: string
  startedAt: string
  completedAt: string
  cardsReviewed: number
  againCount: number
  hardCount: number
  goodCount: number
  easyCount: number
  deletedAt: string | null
}
