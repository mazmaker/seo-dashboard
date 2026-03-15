# Domain Model

**Source:** [../doc/DATA-MODEL.md](../doc/DATA-MODEL.md)
**Last Updated:** 2026-03-15

---

## Core Entities

The SEO Report Dashboard has 6 core entities:

```
User
  │
  └── Client
          │
          ├── FocusKeywordGroup
          │       │
          │       └── FocusKeyword
          │
          ├── KeywordSnapshot
          │
          └── TrafficSnapshot
```

---

## Entity Descriptions

### User
**Managed by:** Supabase Auth

**Description:** A user of the platform (SEO agency, marketing team, freelancer)

**Key Attributes:**
- `id` (uuid) — Primary key
- `email` — User email address
- `created_at` — Account creation timestamp

**Relationships:**
- One user has **many** clients

---

### Client
**Description:** A website that the user tracks SEO performance for

**Key Attributes:**
- `id` (uuid) — Primary key
- `user_id` (uuid) — Foreign key to users.id
- `name` — Client name (e.g., "Acme Corp")
- `slug` — URL-friendly identifier (e.g., "acme-corp")
- `website` — Client website URL
- `logo_url` — Client logo (optional)
- `theme_color` — Brand color (optional)
- `gsc_site_url` — Google Search Console site URL
- `ga4_property_id` — Google Analytics 4 property ID
- `status` — Active, inactive, paused
- `contract_start` — Contract start date (optional)
- `contract_end` — Contract end date (optional)
- `notes` — Internal notes (optional)

**Relationships:**
- Belongs to **one** user
- Has **many** focus keyword groups
- Has **many** keyword snapshots
- Has **many** traffic snapshots

**Security:**
- RLS enforces: `client.user_id = auth.uid()`
- Users can **only** access their own clients

---

### FocusKeywordGroup
**Description:** A named group of keywords that the user wants to track closely

**Example Groups:**
- "Brand Keywords"
- "Commercial Keywords"
- "Blog Keywords"
- "Product Page Keywords"

**Key Attributes:**
- `id` (uuid) — Primary key
- `client_id` (uuid) — Foreign key to clients.id
- `name` — Group name
- `color` — Color code for UI (e.g., "#3B82F6")

**Relationships:**
- Belongs to **one** client
- Has **many** focus keywords

---

### FocusKeyword
**Description:** A keyword that the user actively monitors

**Key Attributes:**
- `id` (uuid) — Primary key
- `group_id` (uuid) — Foreign key to focus_keyword_groups.id
- `keyword` — The keyword phrase (e.g., "solar panels thailand")
- `target_position` — Desired ranking position (optional)
- `priority` — High, medium, low
- `notes` — Notes about this keyword (optional)

**Relationships:**
- Belongs to **one** focus keyword group

---

### KeywordSnapshot
**Description:** Historical keyword performance data (captured daily from Google Search Console)

**Purpose:** Enable trend analysis, ranking change detection, and historical reporting

**Key Attributes:**
- `id` (uuid) — Primary key
- `client_id` (uuid) — Foreign key to clients.id
- `keyword` — Keyword phrase
- `date` — Snapshot date
- `position` — Average position (float)
- `clicks` — Number of clicks (integer)
- `impressions` — Number of impressions (integer)
- `ctr` — Click-through rate (float)

**Relationships:**
- Belongs to **one** client

**Data Retention:** 2 years (recommended)

**Use Cases:**
- Ranking change detection
- Trend charts
- Week-over-week comparison
- Month-over-month comparison
- AI analysis input

---

### TrafficSnapshot
**Description:** Historical Google Analytics 4 traffic data (captured daily)

**Purpose:** Enable traffic trend analysis and anomaly detection

**Key Attributes:**
- `id` (uuid) — Primary key
- `client_id` (uuid) — Foreign key to clients.id
- `date` — Snapshot date
- `sessions` — Total sessions (integer)
- `users` — Total users (integer)
- `new_users` — New users (integer)
- `pageviews` — Total pageviews (integer)
- `bounce_rate` — Bounce rate (float, 0-1)
- `avg_session_duration` — Average session duration in seconds (float)

**Relationships:**
- Belongs to **one** client

**Data Retention:** 2 years (recommended)

**Use Cases:**
- Traffic trend charts
- Traffic anomaly detection
- Period-over-period comparison
- AI analysis input

---

## Relationships Summary

| Entity | Parent | Children |
|---|---|---|
| User | — | Clients |
| Client | User | FocusKeywordGroups, KeywordSnapshots, TrafficSnapshots |
| FocusKeywordGroup | Client | FocusKeywords |
| FocusKeyword | FocusKeywordGroup | — |
| KeywordSnapshot | Client | — |
| TrafficSnapshot | Client | — |

---

## Multi-Tenant Isolation

**Critical Security Requirement:**

All entities (except User) are scoped to a specific user via the `user_id` column on the `clients` table.

**Access Control:**
- Direct: `clients.user_id = auth.uid()`
- Indirect: Other entities join through `clients` table

**Example RLS Policy:**
```sql
-- Users can only access clients they own
CREATE POLICY "Users can access own clients"
ON clients FOR ALL
USING (user_id = auth.uid());

-- Focus keywords inherit access via client
CREATE POLICY "Users can access focus keywords via client"
ON focus_keywords FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM focus_keyword_groups fkg
    JOIN clients c ON c.id = fkg.client_id
    WHERE fkg.id = focus_keywords.group_id
    AND c.user_id = auth.uid()
  )
);
```

---

## Data Sync Strategy

### Daily Snapshot Collection

**Cron Job (Future Implementation):**
1. Fetch Google Search Console data for all active clients
2. Store in `keyword_snapshots` table
3. Fetch Google Analytics 4 data for all active clients
4. Store in `traffic_snapshots` table

**Frequency:** Daily (runs overnight)

**Benefits:**
- Historical trend analysis
- Reduced real-time API calls
- AI analysis on historical data

---

## Domain Logic

### Keyword Ranking Change Detection
**Logic:**
```
previous_position = get_position(keyword, date - 7 days)
current_position = get_position(keyword, date)

change = previous_position - current_position

if change > 0:
    ranking_improved
else if change < 0:
    ranking_dropped
else:
    no_change
```

### Traffic Anomaly Detection
**Logic:**
```
current_week = sum(sessions, last 7 days)
previous_week = sum(sessions, 8-14 days ago)

delta = current_week - previous_week
percentage_change = (delta / previous_week) * 100

if percentage_change < -20%:
    traffic_drop_alert
else if percentage_change > 50%:
    traffic_spike_alert
```

See [../doc/AI-SEO-ENGINE.md](../doc/AI-SEO-ENGINE.md) for full AI analysis logic.

---

## Future Entities (AI Module)

### SeoInsight (Future)
**Description:** AI-generated SEO insights and recommendations

**Attributes:**
- `client_id` — Foreign key to clients.id
- `type` — Insight type (ranking_drop, ctr_low, opportunity, etc.)
- `keyword` — Related keyword (optional)
- `severity` — High, medium, low
- `recommendation` — AI-generated recommendation
- `created_at` — Insight generation timestamp

---

## Index Strategy

**Critical Indexes (for performance):**
- `clients(user_id)` — Fast user → clients lookup
- `focus_keyword_groups(client_id)` — Fast client → groups lookup
- `focus_keywords(group_id)` — Fast group → keywords lookup
- `keyword_snapshots(client_id, keyword, date)` — Fast trend queries
- `traffic_snapshots(client_id, date)` — Fast traffic queries

---

## Related Documents

- [DATA-MODEL.md (Source)](../doc/DATA-MODEL.md)
- [Database Schema](database-schema.md)
- [Architecture Overview](architecture-overview.md)
- [AI SEO Engine](../doc/AI-SEO-ENGINE.md)
