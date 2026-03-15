# SEO Dashboard - Master Implementation Plan

**Project:** Multi-Client SEO Report Dashboard
**Last Updated:** 2026-03-16
**Status:** Phase 2 - Core Infrastructure ✅ Complete

---

## 📊 Project Overview

**Goal:** Build a multi-client SEO analytics platform that aggregates data from Google Search Console and Google Analytics 4.

**Target Users:** SEO agencies, marketing teams, freelance SEO consultants

**Key Features:** Multi-client management, SEO dashboards, keyword tracking, focus keywords, traffic analytics, reports

---

## 🎯 Success Criteria

- ✅ Support 100+ clients per user
- ✅ Dashboard load < 2 seconds
- ✅ Multi-tenant security (RLS enforced)
- ✅ Data cached (reduce API calls)
- ✅ Responsive UI (mobile-friendly)
- ✅ Export reports (CSV)

---

## 📈 Project Phases

```
Phase 1: Foundation (✅ Complete)
  └─ Devatar system setup
  └─ Database migrations

Phase 2: Core Infrastructure (Current)
  └─ Next.js setup
  └─ Supabase connection
  └─ Authentication

Phase 3: Client Management
  └─ CRUD operations
  └─ Client UI

Phase 4: Dashboard & Analytics
  └─ SEO dashboard
  └─ Keyword ranking
  └─ Traffic analytics

Phase 5: Focus Keywords
  └─ Keyword groups
  └─ Keyword tracking
  └─ Trend visualization

Phase 6: Reports
  └─ Report builder
  └─ CSV export
  └─ (Future: PDF export)

Phase 7: Polish & Optimization
  └─ Performance tuning
  └─ Error handling
  └─ Testing

Phase 8: Future Features
  └─ AI SEO insights
  └─ Automated reports
  └─ Advanced analytics
```

---

## ✅ Phase 1: Foundation (COMPLETE)

### 1.1 Devatar System Setup ✅
- [x] Knowledge system created
- [x] Architecture rules defined
- [x] Workflow documented
- [x] Safety guardrails set
- [x] Runtime rules configured

### 1.2 Database Design ✅
- [x] Database schema defined
- [x] Migrations created (5 tables)
- [x] RLS policies defined
- [x] Indexes planned
- [x] Documentation complete

**Duration:** ~4 hours
**Status:** ✅ Complete

---

## ✅ Phase 2: Core Infrastructure (COMPLETE)

### 2.1 Next.js Project Setup ✅

**Tasks:**
- [x] Initialize Next.js 14 with App Router
- [x] Configure TypeScript
- [x] Setup Tailwind CSS
- [x] Install dependencies
- [x] Configure environment variables
- [x] Create directory structure

**Files:**
```
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── (auth)/
│       └── login/
├── lib/
│   ├── supabase/
│   └── utils/
├── types/
│   └── database.types.ts
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

**Estimated Duration:** 30 minutes
**Dependencies:** None
**Priority:** 🔴 HIGH
**Status:** ✅ Complete

---

### 2.2 Supabase Connection Setup ✅

**Tasks:**
- [x] Create Supabase project (Manual - see SETUP-GUIDE.md)
- [x] Configure environment variables
- [x] Create Supabase client utilities
- [x] Test database connection
- [x] Run migrations (Manual - see SETUP-GUIDE.md)

**Files:**
```
lib/supabase/
├── client.ts       (Client-side Supabase client)
├── server.ts       (Server-side Supabase client)
└── middleware.ts   (Auth middleware)
```

**Estimated Duration:** 30 minutes
**Dependencies:** 2.1
**Priority:** 🔴 HIGH
**Status:** ✅ Complete
**Guide:** See [SETUP-GUIDE.md](./SETUP-GUIDE.md)

---

### 2.3 Authentication Module ✅

**Tasks:**
- [x] Google OAuth configuration in Supabase (Manual - see OAUTH-SETUP-GUIDE.md)
- [x] Create login page
- [x] Create auth callback handler
- [x] Implement session management
- [x] Create auth middleware (protected routes)
- [x] Create logout functionality
- [x] Add auth UI components

**Files:**
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── auth/
│       └── callback/
│           └── route.ts
├── api/
│   └── auth/
│       └── logout/
│           └── route.ts
lib/modules/auth/
├── hooks/
│   └── useAuth.ts
├── components/
│   └── AuthProvider.tsx
└── middleware.ts
```

**Estimated Duration:** 2 hours
**Dependencies:** 2.2
**Priority:** 🔴 HIGH
**Status:** ✅ Complete
**Guide:** See [OAUTH-SETUP-GUIDE.md](./OAUTH-SETUP-GUIDE.md)

**Implementation Files:**
- ✅ `app/(auth)/login/page.tsx` - Login page
- ✅ `app/(auth)/login/LoginButton.tsx` - Google OAuth button
- ✅ `app/auth/callback/route.ts` - OAuth callback handler
- ✅ `app/api/auth/logout/route.ts` - Logout API
- ✅ `app/dashboard/page.tsx` - Protected dashboard
- ✅ `app/dashboard/LogoutButton.tsx` - Logout button
- ✅ `lib/modules/auth/hooks/useAuth.ts` - Auth hook
- ✅ `lib/modules/auth/components/AuthProvider.tsx` - Auth context
- ✅ `lib/modules/auth/components/ProtectedRoute.tsx` - Route protection

**Duration:** ~2 hours
**Status:** ✅ Complete

---

## 📁 Phase 3: Client Management (PLANNED)

### 3.1 Client Data Layer

**Tasks:**
- [ ] Create Client type definitions
- [ ] Create Supabase client service
- [ ] Implement CRUD operations
- [ ] Add validation
- [ ] Add error handling

**Files:**
```
types/
└── client.ts

lib/modules/client/
├── services/
│   └── clientService.ts
├── hooks/
│   ├── useClients.ts
│   ├── useClient.ts
│   ├── useCreateClient.ts
│   ├── useUpdateClient.ts
│   └── useDeleteClient.ts
└── types.ts
```

**Estimated Duration:** 2 hours
**Dependencies:** 2.3 (Auth)
**Priority:** 🔴 HIGH

---

### 3.2 Client API Routes

**Tasks:**
- [ ] GET /api/clients - List clients
- [ ] POST /api/clients - Create client
- [ ] GET /api/clients/[id] - Get client
- [ ] PATCH /api/clients/[id] - Update client
- [ ] DELETE /api/clients/[id] - Delete client
- [ ] Add RLS validation
- [ ] Add ownership checks

**Files:**
```
app/api/clients/
├── route.ts              (GET, POST)
└── [id]/
    └── route.ts          (GET, PATCH, DELETE)
```

**Estimated Duration:** 2 hours
**Dependencies:** 3.1
**Priority:** 🔴 HIGH

---

### 3.3 Client UI Components

**Tasks:**
- [ ] ClientList component
- [ ] ClientCard component
- [ ] ClientForm component (create/edit)
- [ ] ClientDeleteConfirm component
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

**Files:**
```
app/components/clients/
├── ClientList.tsx
├── ClientCard.tsx
├── ClientForm.tsx
├── ClientDeleteConfirm.tsx
└── index.ts
```

**Estimated Duration:** 3 hours
**Dependencies:** 3.2
**Priority:** 🔴 HIGH

---

### 3.4 Client Pages

**Tasks:**
- [ ] Clients list page (/dashboard)
- [ ] Client detail page (/dashboard/[slug])
- [ ] Create client page
- [ ] Edit client page
- [ ] Layout components

**Files:**
```
app/
├── dashboard/
│   ├── page.tsx                (Client list)
│   ├── new/
│   │   └── page.tsx            (Create client)
│   └── [slug]/
│       ├── page.tsx            (Client detail)
│       └── edit/
│           └── page.tsx        (Edit client)
└── layout.tsx
```

**Estimated Duration:** 3 hours
**Dependencies:** 3.3
**Priority:** 🔴 HIGH

---

### 3.5 Demo Data Seeding

**Tasks:**
- [ ] Create seed script for demo clients
- [ ] Create seed script for demo keywords
- [ ] Create seed script for demo snapshots
- [ ] Add seed command

**Files:**
```
lib/demo-data/
├── seedClients.ts
├── seedKeywords.ts
├── seedSnapshots.ts
└── seed.ts

scripts/
└── seed-demo-data.ts
```

**Estimated Duration:** 1.5 hours
**Dependencies:** 3.4
**Priority:** 🟡 MEDIUM

**Commands:**
```bash
# Plan
/plan-feature Client Management CRUD with list, create, edit, delete pages

# Implement
/implement-feature Client Management Module

# Validate
/check-architecture module:client

# Update docs
/update-knowledge module:client
```

**Phase 3 Total Duration:** ~12 hours

---

## 📊 Phase 4: Dashboard & Analytics (PLANNED)

### 4.1 External API Services

**Tasks:**
- [ ] Google Search Console service
- [ ] Google Analytics 4 service
- [ ] API error handling
- [ ] Response caching
- [ ] Rate limiting

**Files:**
```
lib/services/
├── searchConsoleService.ts
├── analyticsService.ts
└── cache.ts

app/api/
├── gsc/
│   └── performance/
│       └── route.ts
└── ga/
    └── traffic/
        └── route.ts
```

**Estimated Duration:** 4 hours
**Dependencies:** Phase 3
**Priority:** 🔴 HIGH

---

### 4.2 SEO Dashboard Module

**Tasks:**
- [ ] KPI card components
- [ ] Trend chart components
- [ ] Date range selector
- [ ] Data aggregation logic
- [ ] Loading/error states
- [ ] Dashboard layout

**Files:**
```
app/dashboard/[slug]/
└── page.tsx

app/components/dashboard/
├── KPICard.tsx
├── TrendChart.tsx
├── DateRangeSelector.tsx
└── DashboardLayout.tsx

lib/modules/dashboard/
├── hooks/
│   ├── useKPIs.ts
│   └── useTrendData.ts
└── services/
    └── dashboardService.ts
```

**Estimated Duration:** 5 hours
**Dependencies:** 4.1
**Priority:** 🔴 HIGH

---

### 4.3 Keyword Ranking Module

**Tasks:**
- [ ] Keyword table component
- [ ] Search/filter functionality
- [ ] Sort functionality
- [ ] Pagination
- [ ] Position change indicators
- [ ] Export to CSV

**Files:**
```
app/dashboard/[slug]/keywords/
└── page.tsx

app/components/keywords/
├── KeywordTable.tsx
├── KeywordRow.tsx
├── KeywordSearch.tsx
└── ExportButton.tsx

lib/modules/keywords/
├── hooks/
│   └── useKeywords.ts
└── services/
    └── keywordService.ts
```

**Estimated Duration:** 4 hours
**Dependencies:** 4.1
**Priority:** 🟡 MEDIUM

---

### 4.4 Traffic Analytics Module

**Tasks:**
- [ ] Traffic trend charts
- [ ] Device breakdown chart
- [ ] Traffic source chart
- [ ] Top pages table
- [ ] Top countries table

**Files:**
```
app/dashboard/[slug]/traffic/
└── page.tsx

app/components/traffic/
├── TrafficTrendChart.tsx
├── DeviceBreakdownChart.tsx
├── TrafficSourceChart.tsx
├── TopPagesTable.tsx
└── TopCountriesTable.tsx

lib/modules/traffic/
├── hooks/
│   └── useTrafficData.ts
└── services/
    └── trafficService.ts
```

**Estimated Duration:** 5 hours
**Dependencies:** 4.1
**Priority:** 🟡 MEDIUM

**Phase 4 Total Duration:** ~18 hours

---

## 🎯 Phase 5: Focus Keywords (PLANNED)

### 5.1 Focus Keyword Groups CRUD

**Tasks:**
- [ ] Create keyword group
- [ ] Update keyword group
- [ ] Delete keyword group
- [ ] List groups for client

**Files:**
```
app/api/focus-keywords/groups/
├── route.ts
└── [id]/
    └── route.ts

lib/modules/focus-keywords/
├── services/
│   └── groupService.ts
└── hooks/
    └── useKeywordGroups.ts
```

**Estimated Duration:** 2 hours
**Dependencies:** Phase 3
**Priority:** 🟡 MEDIUM

---

### 5.2 Focus Keywords CRUD

**Tasks:**
- [ ] Add keyword to group
- [ ] Update keyword
- [ ] Remove keyword
- [ ] Move keyword between groups
- [ ] List keywords by group

**Files:**
```
app/api/focus-keywords/
├── route.ts
└── [id]/
    └── route.ts

lib/modules/focus-keywords/
├── services/
│   └── keywordService.ts
└── hooks/
    └── useFocusKeywords.ts
```

**Estimated Duration:** 2 hours
**Dependencies:** 5.1
**Priority:** 🟡 MEDIUM

---

### 5.3 Focus Keywords UI

**Tasks:**
- [ ] Keyword groups list
- [ ] Keyword group form
- [ ] Keywords by group view
- [ ] Add keyword form
- [ ] Keyword trend chart
- [ ] Position heatmap
- [ ] Keyword scoring

**Files:**
```
app/dashboard/[slug]/focus-keywords/
└── page.tsx

app/components/focus-keywords/
├── KeywordGroupList.tsx
├── KeywordGroupForm.tsx
├── KeywordList.tsx
├── AddKeywordForm.tsx
├── KeywordTrendChart.tsx
└── PositionHeatmap.tsx
```

**Estimated Duration:** 5 hours
**Dependencies:** 5.2
**Priority:** 🟡 MEDIUM

**Phase 5 Total Duration:** ~9 hours

---

## 📄 Phase 6: Reports (PLANNED)

### 6.1 Report Builder

**Tasks:**
- [ ] Report configuration UI
- [ ] Section selection
- [ ] Date range selection
- [ ] Report generation logic
- [ ] CSV export functionality

**Files:**
```
app/dashboard/[slug]/reports/
└── page.tsx

app/components/reports/
├── ReportBuilder.tsx
├── SectionSelector.tsx
└── ExportButton.tsx

lib/modules/reports/
├── services/
│   └── reportService.ts
└── hooks/
    └── useReportBuilder.ts

app/api/reports/
└── generate/
    └── route.ts
```

**Estimated Duration:** 4 hours
**Dependencies:** Phase 4, Phase 5
**Priority:** 🟢 LOW

**Phase 6 Total Duration:** ~4 hours

---

## 🎨 Phase 7: Polish & Optimization (PLANNED)

### 7.1 Performance Optimization

**Tasks:**
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Add database indexes (verify)
- [ ] Lazy load components
- [ ] Optimize bundle size
- [ ] Implement data pagination

**Estimated Duration:** 3 hours
**Priority:** 🟡 MEDIUM

---

### 7.2 Error Handling & UX

**Tasks:**
- [ ] Comprehensive error handling
- [ ] User-friendly error messages
- [ ] Loading states everywhere
- [ ] Empty states
- [ ] Offline detection
- [ ] Retry mechanisms

**Estimated Duration:** 2 hours
**Priority:** 🟡 MEDIUM

---

### 7.3 Testing

**Tasks:**
- [ ] E2E tests (Playwright)
- [ ] RLS policy tests
- [ ] Multi-tenant isolation tests
- [ ] API route tests
- [ ] Component tests

**Estimated Duration:** 4 hours
**Priority:** 🟡 MEDIUM

---

### 7.4 Documentation

**Tasks:**
- [ ] User documentation
- [ ] API documentation
- [ ] Deployment guide
- [ ] Environment setup guide

**Estimated Duration:** 2 hours
**Priority:** 🟢 LOW

**Phase 7 Total Duration:** ~11 hours

---

## 🔮 Phase 8: Future Features (FUTURE)

### 8.1 AI SEO Analysis Engine

**Tasks:**
- [ ] Keyword ranking analysis
- [ ] CTR optimization recommendations
- [ ] Keyword opportunity detection
- [ ] Traffic trend analysis
- [ ] Focus keyword monitoring
- [ ] AI insights UI

**Reference:** [AI-SEO-ENGINE.md](doc/AI-SEO-ENGINE.md)

**Estimated Duration:** ~20 hours
**Priority:** 🔮 FUTURE

---

### 8.2 Advanced Features

**Tasks:**
- [ ] PDF report export
- [ ] Scheduled automated reports
- [ ] Email report delivery
- [ ] Custom report templates
- [ ] Team collaboration features
- [ ] White-label branding

**Estimated Duration:** ~30 hours
**Priority:** 🔮 FUTURE

---

## 📊 Time Estimates Summary

| Phase | Duration | Priority | Status |
|---|---|---|---|
| Phase 1: Foundation | 4 hours | 🔴 HIGH | ✅ Complete |
| Phase 2: Core Infrastructure | 3 hours | 🔴 HIGH | 🔄 In Progress |
| Phase 3: Client Management | 12 hours | 🔴 HIGH | 📋 Planned |
| Phase 4: Dashboard & Analytics | 18 hours | 🔴 HIGH | 📋 Planned |
| Phase 5: Focus Keywords | 9 hours | 🟡 MEDIUM | 📋 Planned |
| Phase 6: Reports | 4 hours | 🟢 LOW | 📋 Planned |
| Phase 7: Polish & Optimization | 11 hours | 🟡 MEDIUM | 📋 Planned |
| **Total MVP** | **61 hours** | — | — |
| Phase 8: AI Features | 20 hours | 🔮 FUTURE | 🔮 Future |
| Phase 8: Advanced Features | 30 hours | 🔮 FUTURE | 🔮 Future |
| **Grand Total** | **111 hours** | — | — |

**MVP to Launch:** ~61 hours (~8 working days at 8h/day)

---

## 🎯 Recommended Development Schedule

### Week 1: Foundation & Infrastructure
- ✅ Day 1: Devatar setup (done)
- ✅ Day 1: Database design (done)
- 🔄 Day 2: Next.js + Supabase setup
- 🔄 Day 2: Authentication module
- 📋 Day 3: Client Management (data layer + API)
- 📋 Day 4: Client Management (UI + pages)
- 📋 Day 5: Demo data seeding + testing

**Deliverable:** Working client management system with auth

---

### Week 2: Analytics & Dashboard
- 📋 Day 6-7: External API services (GSC + GA4)
- 📋 Day 8: SEO Dashboard module
- 📋 Day 9: Keyword ranking module
- 📋 Day 10: Traffic analytics module

**Deliverable:** Full analytics dashboard with real data

---

### Week 3: Focus Keywords & Reports
- 📋 Day 11-12: Focus keywords module
- 📋 Day 13: Reports module
- 📋 Day 14-15: Polish, optimization, testing

**Deliverable:** Complete MVP ready for production

---

## 🚀 Next Immediate Steps

### Right Now (Today)

1. **Setup Next.js project** (30 min)
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   npm install recharts date-fns
   ```

2. **Create Supabase project** (30 min)
   - Go to supabase.com
   - Create project
   - Configure `.env.local`

3. **Run migrations** (30 min)
   - Copy migrations to Supabase SQL Editor
   - Execute in order

---

### Tomorrow

4. **Implement Authentication** (2 hours)
   - Use `/plan-feature` command
   - Use `/implement-feature` command

5. **Start Client Management** (4 hours)
   - Data layer + API routes
   - Begin UI components

---

## 📋 Task Tracking

**Use these commands:**

```bash
# Plan a feature
/plan-feature <feature description>

# Implement a feature
/implement-feature <feature name>

# Check architecture
/check-architecture

# Update knowledge
/update-knowledge
```

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [Google Search Console API](https://developers.google.com/webmaster-tools/search-console-api-original)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)

---

## 🤝 Support

If you encounter issues:
1. Check knowledge files in `knowledge/`
2. Review architecture rules in `constraints/`
3. Follow development workflow in `workflow/`
4. Use agents and commands in `.claude/`

---

**Let's build this! 🚀**
