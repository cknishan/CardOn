import { db } from '../database/dexie'
import { DeckRepository } from '../repositories/DeckRepository'
import { FlashcardRepository } from '../repositories/FlashcardRepository'
import type { CloudProvider } from '../providers/CloudProvider'
import type { Deck, Flashcard, StudySession } from '../models'

export class SyncService {
  private provider: CloudProvider

  constructor(provider: CloudProvider) {
    this.provider = provider
  }

  async push(): Promise<void> {
    const [decks, flashcards, studySessions] = await Promise.all([
      DeckRepository.getAll(),
      db.cards.toArray(),
      db.studySessions.toArray(),
    ])

    await this.provider.uploadAll({ decks, flashcards, studySessions })
  }

  async pullAndMerge(): Promise<void> {
    const remote = await this.provider.downloadAll()

    await this.mergeDecks(remote.decks)
    await this.mergeFlashcards(remote.flashcards)
    await this.mergeStudySessions(remote.studySessions)
  }

  private async mergeDecks(remote: Deck[]) {
    for (const remoteDeck of remote) {
      const local = await DeckRepository.getById(remoteDeck.id)
      if (!local) {
        if (!remoteDeck.deletedAt) {
          await DeckRepository.upsert(remoteDeck)
        }
      } else if (remoteDeck.updatedAt > local.updatedAt) {
        if (remoteDeck.deletedAt) {
          await DeckRepository.hardDelete(remoteDeck.id)
        } else {
          await DeckRepository.update(remoteDeck.id, {
            name: remoteDeck.name,
            description: remoteDeck.description ?? null,
            deletedAt: remoteDeck.deletedAt,
          })
        }
      }
    }
  }

  private async mergeFlashcards(remote: Flashcard[]) {
    for (const remoteCard of remote) {
      const local = await FlashcardRepository.getById(remoteCard.id)
      if (!local) {
        if (!remoteCard.deletedAt) {
          await FlashcardRepository.upsert(remoteCard)
        }
      } else if (remoteCard.updatedAt > local.updatedAt) {
        if (remoteCard.deletedAt) {
          await FlashcardRepository.hardDelete(remoteCard.id)
        } else {
          await FlashcardRepository.update(remoteCard.id, {
            question: remoteCard.question,
            answer: remoteCard.answer,
            hint: remoteCard.hint,
            note: remoteCard.note,
            interval: remoteCard.interval,
            repetitions: remoteCard.repetitions,
            easeFactor: remoteCard.easeFactor,
            dueDate: remoteCard.dueDate,
            deletedAt: remoteCard.deletedAt,
          })
        }
      }
    }
  }

  private async mergeStudySessions(remote: StudySession[]) {
    for (const remoteSession of remote) {
      const local = await db.studySessions.get(remoteSession.id)
      if (!local) {
        await db.studySessions.add(remoteSession)
      }
    }
  }
}
