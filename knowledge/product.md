# Product Knowledge

**Source:** [../doc/PRD.md](../doc/PRD.md)
**Last Updated:** 2026-03-15

---

## Product Overview

**SEO Report Dashboard** is a multi-client SEO analytics platform that aggregates data from:
- Google Search Console (GSC)
- Google Analytics 4 (GA4)

**Purpose:** Help SEO agencies and marketing teams analyze, track, and report SEO performance across multiple client websites in a unified dashboard.

---

## Target Users

### Primary Users

1. **SEO Agencies**
   - Manage multiple client websites
   - Generate SEO reports
   - Track keyword performance

2. **Marketing Teams**
   - Analyze organic traffic trends
   - Monitor SEO KPIs
   - Track focus keywords

3. **Freelance SEO Consultants**
   - Monitor keyword rankings
   - Generate client reports
   - Track SEO progress

---

## Core Goals

### Primary Goals

1. **Centralized Data** — Aggregate SEO data from multiple sources in one dashboard
2. **Multi-Client Management** — Support SEO agencies managing 100+ client websites
3. **Report Automation** — Reduce time spent creating manual SEO reports
4. **Performance Insights** — Help users understand SEO performance at a glance

### Future Goals

- AI-powered SEO insights (see [../doc/AI-SEO-ENGINE.md](../doc/AI-SEO-ENGINE.md))
- Automated keyword opportunity detection
- AI-generated SEO reports
- Predictive SEO analytics

---

## Key Features

### 1. Multi-Client Management
- Support multiple client websites per user
- Each client has: website URL, GSC site URL, GA4 property ID
- Client-specific settings (logo, theme color, contract dates)
- Client navigation via slug-based URLs

### 2. SEO Dashboard
**KPI Metrics:**
- Total Clicks
- Total Impressions
- Average CTR
- Average Position
- Total Sessions
- Total Users
- Bounce Rate
- Avg Session Duration

**Features:**
- KPI comparison (period-over-period)
- Trend charts
- Date range selector

### 3. Keyword Ranking
**Table Columns:**
- Keyword
- Position
- Previous Position
- Position Change
- Clicks
- Impressions
- CTR

**Features:**
- Search, sort, filter
- CSV export
- Position change indicators

### 4. Traffic Analytics
**Charts:**
- Sessions trend over time
- Users trend
- Device breakdown (mobile, desktop, tablet)
- Traffic source analysis
- Top landing pages
- Top countries

### 5. Focus Keywords Tracking
**Concept:** Users define important keyword groups to monitor closely.

**Keyword Groups:** (e.g., "Brand Keywords", "Commercial Keywords", "Blog Keywords")

**Tracking:**
- Weekly ranking comparison
- Monthly ranking comparison
- Trend charts
- Heatmap visualization
- Keyword scoring/priority

### 6. Reports
**Report Builder:**
- Select date range
- Choose report sections
- Export CSV

**Future:**
- PDF export
- Scheduled automated reports
- Custom templates

---

## User Flow

```
User Login (Google OAuth)
    ↓
Dashboard (Client List)
    ↓
Select Client
    ↓
View SEO Overview (KPIs + Charts)
    ↓
Analyze Keywords (Ranking Table)
    ↓
Review Focus Keywords (Tracking)
    ↓
Generate Report (CSV Export)
```

---

## Non-Functional Requirements

### Performance
- Dashboard load time < 2 seconds
- API response time < 500ms
- Support 100+ clients per user

### Security
- Google OAuth authentication
- Supabase Row Level Security (RLS)
- Users can **only** access their own clients
- API credentials stored securely

### Scalability
- Support 100+ clients per user
- Support 10,000+ keywords per client
- Historical data retention: 2 years

### Reliability
- Fallback to demo data if API fails
- Graceful error handling for external APIs
- Cache layer to reduce API calls

---

## Success Metrics

- **Active Clients** — Number of client websites tracked
- **Dashboard Usage** — Daily active users
- **Report Exports** — Number of reports generated
- **SEO Agency Adoption** — Number of agencies using the platform

---

## Out of Scope (MVP)

The following features are **NOT** included in the initial version:
- Competitor tracking
- Backlink analysis
- Rank tracking outside GSC (no external rank tracking APIs)
- White-label custom branding
- Team collaboration features
- API for third-party integrations

---

## Future Roadmap

### Phase 1: AI SEO Insights (see [../doc/AI-SEO-ENGINE.md](../doc/AI-SEO-ENGINE.md))
- Keyword ranking analysis
- CTR optimization recommendations
- Keyword opportunity detection
- Traffic trend anomaly alerts
- Focus keyword monitoring

### Phase 2: Advanced Features
- Competitor analysis
- SERP analysis
- Content gap detection
- Backlink correlation analysis

### Phase 3: Platform Scale
- Team collaboration
- White-label branding
- API for integrations
- Custom dashboards

---

## Business Context

### Why This Product Exists

**Problem:** SEO agencies waste hours manually pulling data from Google Search Console and Google Analytics to create client reports.

**Solution:** Automated multi-client SEO dashboard that aggregates data, tracks performance, and generates reports automatically.

**Value Proposition:**
- Save 10+ hours per week on reporting
- Better SEO insights with historical tracking
- Professional client reports in seconds

---

## Related Documents

- [PRD (Source Document)](../doc/PRD.md)
- [Architecture Overview](architecture-overview.md)
- [Feature Map](feature-map.md)
- [Database Schema](database-schema.md)
