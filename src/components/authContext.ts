import { createContext, useContext } from 'react'
import type { CloudUser } from '../providers/CloudProvider'

export interface AuthContextValue {
  user: CloudUser | null
  isLoggedIn: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
