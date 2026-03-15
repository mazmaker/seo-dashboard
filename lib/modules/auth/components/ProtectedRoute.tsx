'use client'

import { useAuthContext } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * ProtectedRoute Component
 *
 * Protects routes that require authentication.
 * Redirects to /login if user is not authenticated.
 *
 * Usage:
 * ```typescript
 * <ProtectedRoute>
 *   <DashboardContent />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
