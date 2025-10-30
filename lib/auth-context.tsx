'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from './firebase'

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
    console.log('Auth Context - Initializing Firebase auth')
    
    if (!auth) {
      console.error('Firebase auth not initialized')
      setUser(null)
      setSession(null)
      setLoading(false)
      return
    }

    try {
      console.log('Setting up Firebase auth listener')
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'No user')
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

            console.log('User authenticated:', customUser.email)
            setUser(customUser)
            setSession(customSession)
          } else {
            console.log('No user authenticated')
            setUser(null)
            setSession(null)
          }
        } catch (error) {
          console.error('Error processing auth state change:', error)
          setUser(null)
          setSession(null)
        }
        setLoading(false)
      })

      return () => {
        console.log('Cleaning up auth listener')
        unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      setUser(null)
      setSession(null)
      setLoading(false)
    }
  }, [])

  const signOut = async () => {
    console.log('Signing out...')
    
    if (!auth) {
      console.error('Firebase auth not initialized')
      setSession(null)
      setUser(null)
      return
    }
    
    try {
      console.log('Firebase sign out')
      await firebaseSignOut(auth)
      setSession(null)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      // Clear state anyway
      setSession(null)
      setUser(null)
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