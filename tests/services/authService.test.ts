import { describe, expect, it, vi } from 'vitest'
import { AuthService } from '../../src/services/AuthService'
import type { CloudProvider, CloudUser, SyncPayload } from '../../src/providers/CloudProvider'

function createProvider(deleteAccount = vi.fn().mockResolvedValue(undefined)): CloudProvider {
  return {
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    deleteAccount,
    getUser: vi.fn().mockReturnValue(null),
    onAuthChange(callback: (user: CloudUser | null) => void) {
      callback(null)
      return () => undefined
    },
    uploadAll: vi.fn().mockResolvedValue(undefined),
    downloadAll: vi.fn().mockResolvedValue({
      decks: [],
      flashcards: [],
      studySessions: [],
    } satisfies SyncPayload),
  }
}

describe('AuthService account deletion', () => {
  it('delegates account deletion to the cloud provider', async () => {
    const deleteAccount = vi.fn().mockResolvedValue(undefined)
    const auth = new AuthService(createProvider(deleteAccount))

    await auth.deleteAccount()

    expect(deleteAccount).toHaveBeenCalledOnce()
  })

  it('propagates provider deletion failures', async () => {
    const failure = new Error('Deletion unavailable')
    const auth = new AuthService(createProvider(vi.fn().mockRejectedValue(failure)))

    await expect(auth.deleteAccount()).rejects.toBe(failure)
  })
})
