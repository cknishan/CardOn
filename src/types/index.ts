// Deck model
export interface Deck {
  id: string;           // UUID
  name: string;         // max 100 chars
  createdAt: string;    // ISO date
  updatedAt: string;    // ISO date
}
// Card model
export interface Card {
  id: string;           // UUID
  deckId: string;       // references Deck.id
  question: string;     // required
  answer: string;       // required
  hint: string | null;  // optional
  note: string | null;  // optional
  
  // Spaced repetition fields
  interval: number;     // days until next review
  repetitions: number;  // times reviewed consecutively
  easeFactor: number;   // 1.3 to 2.5 (starting at 2.5)
  dueDate: string;      // ISO date YYYY-MM-DD
  
  createdAt: string;    // ISO date
  updatedAt: string;    // ISO date
}

// Study Session model
export interface StudySession {
  id: string;
  deckId: string;
  startedAt: string;    // ISO datetime
  completedAt: string;  // ISO datetime
  cardsReviewed: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
}