import { useState, useEffect, type ReactNode } from 'react'
import { AuthService } from '../services/AuthService'
import type { CloudProvider, CloudUser } from '../providers/CloudProvider'
import { AuthContext } from './authContext'

interface AuthProviderProps {
  children?: ReactNode
  provider: CloudProvider
}

function AuthProvider({ children, provider }: AuthProviderProps) {
  const [auth] = useState(() => new AuthService(provider))
  const [user, setUser] = useState<CloudUser | null>(() => auth.getUser())

  useEffect(() => {
    return auth.onAuthChange(setUser)
  }, [auth])

  const login = async () => {
    await auth.login()
  }

  const logout = async () => {
    await auth.logout()
  }

  const deleteAccount = async () => {
    await auth.deleteAccount()
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
