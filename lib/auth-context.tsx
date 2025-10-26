'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from './firebase'
import { demoUser, demoSession } from './demo-mode'

interface User {
  id: string
  email: string
  displayName?: string
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
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                              process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    
    try {
      if (isDemoMode || !hasFirebaseConfig || !auth) {
        // Use demo mode
        setSession(demoSession as Session)
        setUser(demoUser as User)
        setLoading(false)
        return
      }

      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            // Convert Firebase user to our User interface
            const customUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || undefined,
              user_metadata: {
                full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
              }
            }

            // Get the ID token for API calls
            const idToken = await firebaseUser.getIdToken()
            
            const customSession: Session = {
              access_token: idToken,
              refresh_token: '',
              expires_in: 3600,
              token_type: 'Bearer',
              user: customUser
            }

            setUser(customUser)
            setSession(customSession)
          } else {
            setUser(null)
            setSession(null)
          }
        } catch (error) {
          console.error('Error processing auth state change:', error)
          // Fallback to demo mode on error
          setSession(demoSession as Session)
          setUser(demoUser as User)
        }
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      // Fallback to demo mode on any error
      setSession(demoSession as Session)
      setUser(demoUser as User)
      setLoading(false)
    }
  }, [])

  const signOut = async () => {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                              process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    
    if (isDemoMode || !hasFirebaseConfig || !auth) {
      // In demo mode, just clear the state
      setSession(null)
      setUser(null)
    } else {
      await firebaseSignOut(auth)
    }
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