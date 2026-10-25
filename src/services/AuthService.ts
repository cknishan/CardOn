import type { CloudProvider, CloudUser } from '../providers/CloudProvider'

export class AuthService {
  private provider: CloudProvider
  private listeners: Array<(user: CloudUser | null) => void> = []

  constructor(provider: CloudProvider) {
    this.provider = provider
    this.provider.onAuthChange((user) => this.notify(user))
  }

  async login(): Promise<void> {
    await this.provider.login()
  }

  async logout(): Promise<void> {
    await this.provider.logout()
  }

  async deleteAccount(): Promise<void> {
    await this.provider.deleteAccount()
  }

  getUser(): CloudUser | null {
    return this.provider.getUser()
  }

  onAuthChange(callback: (user: CloudUser | null) => void): () => void {
    this.listeners.push(callback)
    callback(this.getUser())
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notify(user: CloudUser | null) {
    for (const listener of this.listeners) {
      listener(user)
    }
  }
}
