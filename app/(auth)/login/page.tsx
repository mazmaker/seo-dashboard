import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginButton } from './LoginButton'

export default async function LoginPage() {
  const supabase = createClient()

  // Check if already logged in
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SEO Dashboard
          </h1>
          <p className="text-gray-600">
            Multi-Client SEO Analytics Platform
          </p>
        </div>

        <div className="space-y-4">
          <LoginButton />

          <div className="text-center text-sm text-gray-500">
            <p>Sign in to manage your SEO clients</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div>
              <div className="font-semibold text-gray-700">Multi-Client</div>
              <div>Manage 100+ clients</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Real-time</div>
              <div>GSC + GA4 data</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Secure</div>
              <div>RLS protected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
