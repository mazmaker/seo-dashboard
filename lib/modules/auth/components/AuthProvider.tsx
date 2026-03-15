'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 *
 * Provides authentication context to the app.
 *
 * Usage:
 * ```typescript
 * // In root layout
 * <AuthProvider>
 *   {children}
 * </AuthProvider>
 *
 * // In any component
 * const { user, signOut } = useAuthContext()
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuthContext Hook
 *
 * Access auth context from any component.
 * Must be used within AuthProvider.
 */
export function useAuthContext() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
