import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { AuthService } from '../services/AuthService'
import type { CloudProvider, CloudUser } from '../providers/CloudProvider'

interface AuthContextValue {
  user: CloudUser | null
  isLoggedIn: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children?: ReactNode
  provider: CloudProvider
}

function AuthProvider({ children, provider }: AuthProviderProps) {
  const auth = new AuthService(provider)
  const [user, setUser] = useState<CloudUser | null>(auth.getUser())

  useEffect(() => {
    const unsub = auth.onAuthChange(setUser)
    return unsub
  }, [auth])

  const login = async () => {
    await auth.login()
  }

  const logout = async () => {
    await auth.logout()
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export { AuthProvider, useAuth }
export type { AuthContextValue }
