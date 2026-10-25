import { createClient, FunctionsHttpError, type SupabaseClient } from '@supabase/supabase-js'
import type { CloudProvider, CloudUser, SyncPayload } from './CloudProvider'

export class SupabaseProvider implements CloudProvider {
  private supabase: SupabaseClient
  private currentUser: CloudUser | null = null
  private authListeners: Array<(user: CloudUser | null) => void> = []

  constructor() {
    const url = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
      console.warn(
        'Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
      )
    }

    this.supabase = createClient(url, anonKey)

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser = session?.user
        ? { id: session.user.id, email: session.user.email ?? '' }
        : null
      this.notifyAuthListeners(this.currentUser)
    })
  }

  onAuthChange(callback: (user: CloudUser | null) => void): () => void {
    this.authListeners.push(callback)
    callback(this.currentUser)
    return () => {
      this.authListeners = this.authListeners.filter((l) => l !== callback)
    }
  }

  private notifyAuthListeners(user: CloudUser | null) {
    for (const listener of this.authListeners) {
      listener(user)
    }
  }

  private async ensureUser(): Promise<CloudUser> {
    if (this.currentUser) return this.currentUser
    const {
      data: { session },
    } = await this.supabase.auth.getSession()
    if (session?.user) {
      this.currentUser = { id: session.user.id, email: session.user.email ?? '' }
      return this.currentUser
    }
    throw new Error('Not authenticated')
  }

  async login(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    })
    if (error) throw error
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut()
    this.currentUser = null
    this.notifyAuthListeners(null)
  }

  async deleteAccount(): Promise<void> {
    await this.ensureUser()

    const { error } = await this.supabase.functions.invoke('delete-account', {
      method: 'POST',
    })

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const details = (await error.context.json().catch(() => null)) as {
          error?: unknown
        } | null
        if (typeof details?.error === 'string') {
          throw new Error(details.error)
        }
      }
      throw error
    }

    await this.supabase.auth.signOut({ scope: 'local' })
    this.currentUser = null
    this.notifyAuthListeners(null)
  }

  getUser(): CloudUser | null {
    return this.currentUser
  }

  async uploadAll(data: SyncPayload): Promise<void> {
    const user = await this.ensureUser()

    const decks = data.decks.map((d) => ({ ...d, user_id: user.id }))
    const flashcards = data.flashcards.map((c) => ({ ...c, user_id: user.id }))
    const studySessions = data.studySessions.map((s) => ({ ...s, user_id: user.id }))

    const deckResult = await this.supabase.from('decks').upsert(decks)
    if (deckResult.error) throw deckResult.error

    const [cardResult, sessionResult] = await Promise.all([
      this.supabase.from('flashcards').upsert(flashcards),
      this.supabase.from('study_sessions').upsert(studySessions),
    ])

    if (cardResult.error) throw cardResult.error
    if (sessionResult.error) throw sessionResult.error
  }

  async downloadAll(): Promise<SyncPayload> {
    const user = await this.ensureUser()

    const [decksRes, cardsRes, sessionsRes] = await Promise.all([
      this.supabase.from('decks').select('*').eq('user_id', user.id),
      this.supabase.from('flashcards').select('*').eq('user_id', user.id),
      this.supabase.from('study_sessions').select('*').eq('user_id', user.id),
    ])

    if (decksRes.error) throw decksRes.error
    if (cardsRes.error) throw cardsRes.error
    if (sessionsRes.error) throw sessionsRes.error

    return {
      decks: (decksRes.data ?? []).map(({ user_id: _u, ...rest }) => rest) as SyncPayload['decks'],
      flashcards: (cardsRes.data ?? []).map(
        ({ user_id: _u, ...rest }) => rest
      ) as SyncPayload['flashcards'],
      studySessions: (sessionsRes.data ?? []).map(
        ({ user_id: _u, ...rest }) => rest
      ) as SyncPayload['studySessions'],
    }
  }
}

export const supabaseProvider = new SupabaseProvider()
