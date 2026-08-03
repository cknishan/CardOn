import type { CloudProvider, CloudUser } from '../providers/CloudProvider'

export class AuthService {
  private provider: CloudProvider
  private listeners: Array<(user: CloudUser | null) => void> = []

  constructor(provider: CloudProvider) {
    this.provider = provider
  }

  async login(): Promise<CloudUser> {
    const user = await this.provider.login()
    this.notify(user)
    return user
  }

  async logout(): Promise<void> {
    await this.provider.logout()
    this.notify(null)
  }

  getUser(): CloudUser | null {
    return this.provider.getUser()
  }

  onAuthChange(callback: (user: CloudUser | null) => void): () => void {
    this.listeners.push(callback)
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
