# Feature Map

**Last Updated:** 2026-03-15 22:00
**Purpose:** Comprehensive list of all system capabilities to prevent duplicate features

---

## ⚠️ CRITICAL: Read This Before Implementing ANY Feature

This file contains **every feature** the system provides.

**Before implementing a new feature:**
1. Search this file for related capabilities
2. Check if the feature already exists (exact or similar)
3. If overlap detected, **extend** existing feature instead of creating duplicate

**After implementing a feature:**
1. Add it to this file under the correct module
2. Include implementation location (file path)

---

## Status Legend

- ✅ **Implemented** — Feature is live in codebase
- 🚧 **In Progress** — Feature is being implemented
- 📋 **Planned** — Feature is documented but not started
- 🔮 **Future** — Feature planned for future release

---

## Module: Project Infrastructure

**Status:** ✅ Implemented

### Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Supabase client utilities
  - Client-side client
  - Server-side client
  - Middleware for session refresh
- ✅ Database type definitions
- ✅ Common utility functions
- ✅ Environment configuration template
- ✅ Project documentation (README.md)

**Implementation Location:**
- Configuration: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`
- Supabase: `lib/supabase/`
  - `client.ts` (client-side)
  - `server.ts` (server-side)
  - `middleware.ts` (session refresh)
- Types: `types/`
  - `database.types.ts` (database schema types)
  - `index.ts` (common type exports)
- Utils: `lib/utils.ts`
- App: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Middleware: `middleware.ts`

**Dependencies Installed:**
- next, react, react-dom
- @supabase/supabase-js, @supabase/auth-helpers-nextjs, @supabase/ssr
- typescript, tailwindcss
- recharts, date-fns

---

## Module: Database Infrastructure

**Status:** ✅ Implemented

### Features

- ✅ Database schema design
- ✅ Supabase migrations
  - `clients` table
  - `focus_keyword_groups` table
  - `focus_keywords` table
  - `keyword_snapshots` table
  - `traffic_snapshots` table
- ✅ Row Level Security (RLS) policies
  - Multi-tenant isolation via `clients.user_id`
  - Access control for all tables
- ✅ Foreign key constraints with CASCADE delete
- ✅ Database indexes
  - Foreign key indexes
  - Composite indexes for trend queries
- ✅ Unique constraints
  - Prevent duplicate snapshots
- ✅ Auto-update timestamps (`updated_at` trigger)

**Implementation Location:**
- Migrations: `supabase/migrations/`
  - `20260315000001_create_clients_table.sql`
  - `20260315000002_create_focus_keyword_groups_table.sql`
  - `20260315000003_create_focus_keywords_table.sql`
  - `20260315000004_create_keyword_snapshots_table.sql`
  - `20260315000005_create_traffic_snapshots_table.sql`
- Documentation: `supabase/README.md`

**Database Tables:** `clients`, `focus_keyword_groups`, `focus_keywords`, `keyword_snapshots`, `traffic_snapshots`

**Security:**
- ✅ RLS enabled on all tables
- ✅ Multi-tenant isolation enforced
- ✅ Users can only access their own data

---

## Module: Authentication

**Status:** ✅ Implemented

### Features

- ✅ User registration via Google OAuth
- ✅ User login via Google OAuth
- ✅ Session management (Supabase Auth)
- ✅ Logout
- ✅ Session persistence (HTTP-only cookies)
- ✅ Protected routes (redirect to login if not authenticated)

**Implementation Location:**
- Login Page: `app/(auth)/login/page.tsx`
- Login Button: `app/(auth)/login/LoginButton.tsx`
- OAuth Callback: `app/auth/callback/route.ts`
- Logout API: `app/api/auth/logout/route.ts`
- Auth Hook: `lib/modules/auth/hooks/useAuth.ts`
- Auth Context: `lib/modules/auth/components/AuthProvider.tsx`
- Protected Route: `lib/modules/auth/components/ProtectedRoute.tsx`
- Dashboard (Protected): `app/dashboard/page.tsx`
- Logout Button: `app/dashboard/LogoutButton.tsx`

**Public API:**
- `useAuth()` - Hook for auth state and signOut method
- `useAuthContext()` - Access auth context from any component
- `<AuthProvider>` - Context provider wrapping app
- `<ProtectedRoute>` - Component for protecting routes

**Security:**
- ✅ Google OAuth flow with callback
- ✅ Session stored in HTTP-only cookies
- ✅ Server-side session validation
- ✅ Protected routes redirect to login

---

## Module: Client Management

**Status:** 📋 Planned

### Features

- 📋 Create new client
- 📋 View client list
- 📋 View client details
- 📋 Update client information
  - Name, website URL
  - Logo, theme color
  - GSC site URL
  - GA4 property ID
  - Contract dates
  - Status (active/inactive)
  - Notes
- 📋 Delete client
- 📋 Client slug-based navigation (`/dashboard/[clientSlug]`)
- 📋 Client filtering and search

**Implementation Location:** TBD

**Database Tables:** `clients`

---

## Module: SEO Dashboard

**Status:** 📋 Planned

### KPI Metrics Display

- 📋 Total Clicks (from GSC)
- 📋 Total Impressions (from GSC)
- 📋 Average CTR (from GSC)
- 📋 Average Position (from GSC)
- 📋 Total Sessions (from GA4)
- 📋 Total Users (from GA4)
- 📋 Bounce Rate (from GA4)
- 📋 Average Session Duration (from GA4)

### Dashboard Features

- 📋 KPI cards with comparison (period-over-period)
- 📋 Trend charts (line charts over time)
- 📋 Date range selector
- 📋 Data refresh (pull latest from APIs)
- 📋 Loading states
- 📋 Error handling with fallback to demo data

**Implementation Location:** TBD

**API Endpoints:** `/api/gsc/performance`, `/api/ga/traffic`

---

## Module: Keyword Ranking

**Status:** 📋 Planned

### Features

- 📋 Display keyword ranking table
  - Keyword
  - Current position
  - Previous position
  - Position change (delta)
  - Clicks
  - Impressions
  - CTR
- 📋 Search keywords (filter table)
- 📋 Sort by column (position, clicks, impressions, CTR)
- 📋 Filter by position range
- 📋 Pagination (for large datasets)
- 📋 Export to CSV
- 📋 Position change indicators (up/down arrows)

**Implementation Location:** TBD

**API Endpoints:** `/api/gsc/keywords`

**Database Tables:** `keyword_snapshots` (historical data)

---

## Module: Traffic Analytics

**Status:** 📋 Planned

### Charts

- 📋 Sessions trend chart (line chart over time)
- 📋 Users trend chart
- 📋 Device breakdown chart (pie chart: mobile, desktop, tablet)
- 📋 Traffic source chart (bar chart: organic, direct, referral, social)
- 📋 Top landing pages (table)
- 📋 Top countries (table or map)

### Features

- 📋 Date range selector
- 📋 Chart export (image or CSV)
- 📋 Interactive tooltips on charts

**Implementation Location:** TBD

**API Endpoints:** `/api/ga/sessions`, `/api/ga/devices`, `/api/ga/sources`

**Database Tables:** `traffic_snapshots` (historical data)

---

## Module: Focus Keywords Tracking

**Status:** 📋 Planned

### Keyword Group Management

- 📋 Create keyword group
  - Name (e.g., "Brand Keywords")
  - Color (for UI categorization)
- 📋 View all groups for a client
- 📋 Update group (name, color)
- 📋 Delete group

### Focus Keyword Management

- 📋 Add keyword to group
  - Keyword phrase
  - Target position (optional)
  - Priority (high, medium, low)
  - Notes
- 📋 View keywords in group
- 📋 Update keyword (target, priority, notes)
- 📋 Remove keyword from group
- 📋 Move keyword to different group

### Tracking Features

- 📋 Display current ranking for each focus keyword
- 📋 Show ranking change (weekly)
- 📋 Show ranking change (monthly)
- 📋 Trend chart for keyword group
- 📋 Heatmap visualization (position over time)
- 📋 Keyword scoring (distance from target)
- 📋 Alert if ranking drops > 3 positions

**Implementation Location:** TBD

**API Endpoints:** `/api/focus-keywords`, `/api/focus-keyword-groups`

**Database Tables:** `focus_keyword_groups`, `focus_keywords`, `keyword_snapshots`

---

## Module: Reports

**Status:** 📋 Planned

### Report Builder Features

- 📋 Select date range
- 📋 Select report sections to include
  - SEO overview
  - Keyword rankings
  - Traffic analytics
  - Focus keywords
- 📋 Export to CSV
- 🔮 Export to PDF (future)
- 🔮 Schedule automated reports (future)
- 🔮 Custom report templates (future)

**Implementation Location:** TBD

**API Endpoints:** `/api/reports/generate`

---

## Module: AI SEO Analysis (Future)

**Status:** 🔮 Future

See [../doc/AI-SEO-ENGINE.md](../doc/AI-SEO-ENGINE.md) for detailed specifications.

### Analysis Features

- 🔮 Keyword ranking change analysis
  - Detect ranking drops
  - Detect ranking improvements
  - Generate insights
- 🔮 CTR optimization recommendations
  - Identify keywords with low CTR
  - Suggest title/meta improvements
- 🔮 Keyword opportunity detection
  - Find keywords on page 2 (position 11-20)
  - High impressions, low clicks
  - Recommend optimization
- 🔮 Traffic trend analysis
  - Detect traffic anomalies
  - Week-over-week comparison
  - Alert on drops > 20%
- 🔮 Focus keyword monitoring
  - Track position changes
  - Alert on ranking drops > 3 positions

### AI Insight Display

- 🔮 Insight feed (dashboard widget)
- 🔮 Insight details page
- 🔮 Insight severity indicators
- 🔮 AI recommendations
- 🔮 Insight history

**Implementation Location:** TBD (future)

**API Endpoints:** `/api/ai/insights`, `/api/ai/analyze`

**Database Tables:** `seo_insights` (future table)

---

## External API Integrations

### Google Search Console API

**Status:** 📋 Planned

**Features:**
- 📋 OAuth 2.0 authentication flow
- 📋 Fetch performance data
  - Date range query
  - Keyword-level data
  - Page-level data
- 📋 Handle rate limits
- 📋 Cache responses (1 hour TTL)
- 📋 Error handling and retries

**Implementation Location:** TBD

**Service:** `lib/services/searchConsoleService.ts` (recommended)

---

### Google Analytics 4 API

**Status:** 📋 Planned

**Features:**
- 📋 OAuth 2.0 authentication flow
- 📋 Fetch traffic data
  - Sessions, users, pageviews
  - Device breakdown
  - Traffic sources
  - Top pages, countries
- 📋 Handle rate limits
- 📋 Cache responses (1 hour TTL)
- 📋 Error handling and retries

**Implementation Location:** TBD

**Service:** `lib/services/analyticsService.ts` (recommended)

---

## Data Sync & Automation (Future)

**Status:** 🔮 Future

### Daily Data Sync (Cron Job)

- 🔮 Fetch GSC data for all active clients
- 🔮 Store keyword snapshots in database
- 🔮 Fetch GA4 data for all active clients
- 🔮 Store traffic snapshots in database
- 🔮 Run AI analysis on new data
- 🔮 Generate alerts

**Implementation Location:** TBD (future)

**Technology:** Vercel Cron Jobs or external scheduler

---

## Utility Features

### Caching

- 📋 Cache Google API responses
- 📋 Cache invalidation (time-based)
- 📋 Cache layer (Supabase table or Redis)

### Error Handling

- 📋 Fallback to demo data on API failure
- 📋 Error boundary components
- 📋 User-friendly error messages
- 📋 Retry mechanisms

### Demo Data

- 📋 Generate demo data for testing
- 📋 Seed demo clients
- 📋 Seed demo keywords
- 📋 Seed demo snapshots

---

## Feature Count Summary

| Module | Features | Status |
|---|---|---|
| Authentication | 6 | ✅ Implemented |
| Client Management | 7 | 📋 Planned |
| SEO Dashboard | 8 | 📋 Planned |
| Keyword Ranking | 7 | 📋 Planned |
| Traffic Analytics | 6 | 📋 Planned |
| Focus Keywords | 11 | 📋 Planned |
| Reports | 4 | 📋 Planned |
| AI Analysis | 5 | 🔮 Future |
| External APIs | 2 | 📋 Planned |
| **Total** | **56** | — |

---

## How to Update This File

### When Adding a Feature

1. Determine the correct module
2. Add feature with status emoji (📋 Planned → 🚧 In Progress → ✅ Implemented)
3. Include implementation location once known
4. Update feature count summary

### When Modifying a Feature

1. Update status if changed
2. Update description if behavior changed
3. Add deprecation note if feature is being removed

### When Deprecating a Feature

1. Change status to ⛔ **Deprecated**
2. Add deprecation reason
3. Link to replacement feature (if applicable)

---

## Collision Detection Rules

### Before Implementation

**Ask these questions:**
1. Does this feature already exist? (search this file)
2. Does this overlap with another feature? (partial duplication)
3. Should I **extend** an existing feature instead of creating new?
4. Which module should this belong to?

### If Collision Detected

**Actions:**
- **Exact duplicate** → Do NOT implement, use existing
- **Partial overlap** → Extend existing feature or refactor
- **Different module, same capability** → Architectural violation, consolidate

---

## Related Documents

- [Product Knowledge](product.md)
- [Architecture Overview](architecture-overview.md)
- [Domain Model](domain-model.md)
- [Architecture Rules](../constraints/architecture-rules.md)
