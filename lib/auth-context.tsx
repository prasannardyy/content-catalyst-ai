'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { demoUser, demoSession } from './demo-mode'

interface User {
  id: string
  email: string
  user_metadata: {
    full_name: string
  }
}

interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: User
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always use demo mode since we removed Supabase
    setSession(demoSession as Session)
    setUser(demoUser as User)
    setLoading(false)
  }, [])

  const signOut = async () => {
    // In demo mode, just clear the state
    setSession(null)
    setUser(null)
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}