import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Logout API Route
 *
 * POST /api/auth/logout
 *
 * Logs out the current user and clears the session.
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: 'Failed to log out' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
