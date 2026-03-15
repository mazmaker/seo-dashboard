# Architecture Overview

**Source:** [../doc/ARCHITECTURE.md](../doc/ARCHITECTURE.md)
**Last Updated:** 2026-03-15

---

## System Architecture

The SEO Report Dashboard uses a **modern full-stack web architecture** with Next.js as both frontend and backend.

```
┌─────────────────────────────────────────────┐
│              Browser (User)                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Next.js 14 Frontend                 │
│    (React + TailwindCSS + Recharts)         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Next.js API Routes                  │
│         (Backend API Layer)                 │
└─────┬───────────────────────────┬───────────┘
      │                           │
      │                           │
┌─────▼──────────┐      ┌─────────▼──────────┐
│  Service Layer │      │  Supabase Database │
│  (API Wrappers)│      │    (PostgreSQL)    │
└─────┬──────────┘      └────────────────────┘
      │
      │
┌─────▼──────────────────────────────────────┐
│         External APIs                      │
│  • Google Search Console API               │
│  • Google Analytics Data API (GA4)         │
└────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **State Management:** React Query (for server state)

### Backend
- **API Layer:** Next.js API Routes
- **Runtime:** Node.js

### Authentication
- **Provider:** Supabase Auth
- **Method:** Google OAuth 2.0

### Database
- **Provider:** Supabase
- **Engine:** PostgreSQL
- **Security:** Row Level Security (RLS)

### External APIs
- **Google Search Console API** — Keyword data, clicks, impressions, CTR, position
- **Google Analytics Data API (GA4)** — Sessions, users, traffic sources, device breakdown

### Testing
- **E2E Testing:** Playwright

### Deployment
- **Platform:** Vercel
- **Database Hosting:** Supabase Cloud

---

## System Components

### 1. Frontend Layer

**Technology:** React (Next.js)

**Responsibilities:**
- Render dashboard UI
- Display KPI cards and charts
- Keyword ranking tables
- Client management interface
- Date range selection
- Report generation UI

**Key Libraries:**
- `recharts` — Chart rendering
- `tailwindcss` — Styling
- `react-query` — Server state management

---

### 2. API Layer

**Technology:** Next.js API Routes

**Responsibilities:**
- Call Google APIs (GSC, GA4)
- Handle authentication and authorization
- Transform API responses
- Implement caching logic
- Error handling and fallbacks

**Example Endpoints:**
```
/api/gsc/performance    → Google Search Console data
/api/ga/traffic         → Google Analytics 4 data
/api/clients            → Client CRUD operations
/api/focus-keywords     → Focus keyword management
```

---

### 3. Service Layer

**Technology:** TypeScript modules

**Responsibilities:**
- Wrap external APIs (Google, Supabase)
- Data transformation and normalization
- Caching logic
- Error handling

**Example Services:**
```
searchConsoleService    → GSC API wrapper
analyticsService        → GA4 API wrapper
clientService           → Client database operations
focusKeywordService     → Focus keyword CRUD
```

**Location:** `lib/services/` (recommended structure)

---

### 4. Database Layer

**Technology:** Supabase PostgreSQL

**Core Tables:**
- `clients` — Client website configuration
- `focus_keyword_groups` — Keyword groupings
- `focus_keywords` — Tracked keywords
- `keyword_snapshots` — Historical keyword performance
- `traffic_snapshots` — Historical GA4 traffic

**Security:**
- Row Level Security (RLS) enforced
- Users can **only** access clients they own
- Policy: `client.user_id = auth.uid()`

See [database-schema.md](database-schema.md) for complete schema.

---

## Authentication Flow

```
User clicks "Sign in with Google"
    ↓
Redirect to Google OAuth consent screen
    ↓
User authorizes app
    ↓
Google returns OAuth token
    ↓
Supabase Auth creates session
    ↓
Session stored in cookie
    ↓
User redirected to dashboard
    ↓
Frontend includes session in API requests
    ↓
API validates session via Supabase
    ↓
RLS policies enforce data access
```

---

## Data Flow

### Example: Loading Dashboard KPIs

```
1. User navigates to /dashboard/[clientSlug]
2. React component calls useQuery hook
3. Hook sends GET request to /api/gsc/performance?clientSlug=xyz
4. API route:
   a. Validates user session
   b. Fetches client from database (RLS checks ownership)
   c. Retrieves GSC site URL from client record
   d. Calls Google Search Console API
   e. Transforms response data
   f. Returns JSON to frontend
5. React Query caches response
6. Component renders KPI cards with data
```

---

## External API Integration

### Google Search Console API

**Used For:**
- Keyword data
- Clicks
- Impressions
- CTR (Click-Through Rate)
- Average position

**API Endpoint:** `https://searchconsole.googleapis.com/v1`

**Authentication:** OAuth 2.0 (user grants access to their GSC properties)

---

### Google Analytics 4 Data API

**Used For:**
- Sessions
- Users
- New users
- Pageviews
- Bounce rate
- Average session duration
- Traffic sources
- Device breakdown
- Top pages
- Top countries

**API Endpoint:** `https://analyticsdata.googleapis.com/v1beta`

**Authentication:** OAuth 2.0 (user grants access to their GA4 properties)

---

## Caching Strategy

### Purpose
Reduce Google API calls and improve performance.

### Recommended Implementation

**Cache Layer:** Supabase table or Redis (future)

**Cache Duration:** 1 hour (configurable)

**Cache Invalidation:** Time-based (TTL)

**Cache Keys:**
```
gsc:{clientId}:{startDate}:{endDate}
ga4:{clientId}:{startDate}:{endDate}
```

---

## Error Handling Strategy

### Possible Errors
- Google API failure (rate limit, quota exceeded, network error)
- Authentication expired
- Invalid client configuration
- Network timeouts

### Fallback Strategy

**Primary:** Return cached data (if available)

**Secondary:** Return demo data (for testing/demo purposes)

**User Experience:**
- Display error banner
- Show partial data if available
- Provide retry button

---

## Security Considerations

### Authentication
- **Google OAuth** for user authentication
- **Supabase Auth** manages sessions
- Session tokens stored in HTTP-only cookies

### Authorization
- **Row Level Security (RLS)** enforced at database level
- Users can **only** access clients where `client.user_id = auth.uid()`
- API routes validate session before data access

### API Credentials
- Google API credentials stored in environment variables
- Never exposed to frontend
- Supabase service key stored securely

### Multi-Tenant Isolation
- **Critical:** Each client belongs to exactly one user
- RLS policies prevent cross-tenant data access
- One mistake = data breach

---

## Scalability

### Current Design
Supports **100+ clients** per user

### Bottlenecks
- Google API rate limits
- Database query performance on large datasets
- Frontend rendering of large keyword tables

### Future Improvements
- **Redis caching** — Reduce database load
- **Background data sync** — Scheduled jobs to pre-fetch data
- **Rate limiting** — Prevent API abuse
- **Data pagination** — Limit table row counts
- **Database indexing** — Optimize query performance

---

## Future Architecture: AI Layer

From [../doc/AI-SEO-ENGINE.md](../doc/AI-SEO-ENGINE.md):

```
Dashboard
    ↓
SEO Data Service
    ↓
Database (keyword_snapshots, traffic_snapshots)
    ↓
AI Analysis Engine
    ├── Keyword Ranking Analysis
    ├── CTR Optimization
    ├── Keyword Opportunity Detection
    ├── Traffic Trend Analysis
    └── Focus Keyword Monitoring
    ↓
SEO Insights (stored in database)
    ↓
Dashboard (displays insights)
```

**AI Features (Future):**
- Automated keyword insights
- Traffic anomaly detection
- SEO recommendations
- Predictive analytics

---

## Module Boundaries

The system is divided into logical modules:

1. **Auth Module** — User authentication and session management
2. **Client Module** — Client CRUD, configuration
3. **Dashboard Module** — KPI aggregation and display
4. **Keyword Module** — Keyword ranking and analysis
5. **Traffic Module** — GA4 traffic analytics
6. **Focus Keywords Module** — Focus keyword tracking
7. **Reports Module** — Report generation and export
8. **AI Analysis Module** (Future) — SEO insights and recommendations

**Critical Rule:** Modules must not duplicate responsibilities or leak concerns.

See [../constraints/architecture-rules.md](../constraints/architecture-rules.md) for enforcement.

---

## Related Documents

- [ARCHITECTURE.md (Source)](../doc/ARCHITECTURE.md)
- [DATA-MODEL.md](../doc/DATA-MODEL.md)
- [Database Schema](database-schema.md)
- [Architecture Rules](../constraints/architecture-rules.md)
