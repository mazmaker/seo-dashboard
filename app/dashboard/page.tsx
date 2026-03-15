import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from './LogoutButton'

export default async function DashboardPage() {
  const supabase = createClient()

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                SEO Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.email}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            🎉 Authentication Complete!
          </h2>

          <div className="space-y-4 text-gray-600">
            <p>
              ✅ You are now logged in with Google OAuth
            </p>
            <p>
              ✅ Session management is working
            </p>
            <p>
              ✅ Protected routes are functional
            </p>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">User Info:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>ID:</strong> {user.id}</li>
                <li><strong>Provider:</strong> Google</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Next Steps:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>📋 Phase 3: Client Management</li>
                <li>📊 Phase 4: Dashboard & Analytics</li>
                <li>🎯 Phase 5: Focus Keywords</li>
                <li>📄 Phase 6: Reports</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
