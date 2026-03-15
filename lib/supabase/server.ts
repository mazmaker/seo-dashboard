import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

/**
 * Create a Supabase client for server-side operations
 *
 * Usage in Server Components:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function ServerComponent() {
 *   const supabase = createClient()
 *   const { data } = await supabase.from('clients').select()
 *   return <div>{JSON.stringify(data)}</div>
 * }
 * ```
 *
 * Usage in Route Handlers:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 *
 * export async function GET(request: Request) {
 *   const supabase = createClient()
 *   const { data } = await supabase.from('clients').select()
 *   return Response.json(data)
 * }
 * ```
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
