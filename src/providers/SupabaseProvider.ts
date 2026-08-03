import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { CloudProvider, CloudUser, SyncPayload } from './CloudProvider'

export class SupabaseProvider implements CloudProvider {
  private supabase: SupabaseClient
  private currentUser: CloudUser | null = null

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
    })
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

  async login(): Promise<CloudUser> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error

    if (this.currentUser) return this.currentUser

    return new Promise<CloudUser>((resolve) => {
      const {
        data: { subscription },
      } = this.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          subscription.unsubscribe()
          const user: CloudUser = {
            id: session.user.id,
            email: session.user.email ?? '',
          }
          this.currentUser = user
          resolve(user)
        }
      })
    })
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut()
    this.currentUser = null
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
