import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

/**
 * Create a Supabase client for client-side operations
 *
 * Usage in React components:
 * ```typescript
 * import { createClient } from '@/lib/supabase/client'
 *
 * export default function MyComponent() {
 *   const supabase = createClient()
 *   // Use supabase client
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
