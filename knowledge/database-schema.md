# Database Schema

**Source:** [../doc/DATA-MODEL.md](../doc/DATA-MODEL.md)
**Last Updated:** 2026-03-15 21:20
**Database:** Supabase PostgreSQL
**Migrations:** ✅ Created in `supabase/migrations/`

---

## ⚠️ CRITICAL: Read This Before Writing ANY Database Code

This file contains the **exact database schema** — tables, columns, types, constraints, relationships, and RLS policies.

**NEVER guess table or column names. ALWAYS reference this file.**

**Common AI mistakes without schema awareness:**
- Guessing column names (`user_id` vs `userId` vs `owner_id`)
- Creating duplicate tables
- Writing queries with wrong types (`string` vs `uuid`)
- Missing foreign key constraints
- Ignoring RLS policies

**Solution:** Reference this file for every query, migration, or data model code.

---

## Schema Update Process

### Current State (Level 2)
- **Manual updates** — Developer manually updates this file after migrations
- **No automation** — Schema sync script activated at Level 4

### When to Update
- After running a database migration
- After adding/modifying tables
- After changing RLS policies

### Future (Level 4)
- Automated schema extraction from Supabase
- CI validation (schema drift detection)

---

## Tables

### users
**Managed by:** Supabase Auth (do NOT create manually)

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `email` | `text` | NO | — | UNIQUE |
| `created_at` | `timestamptz` | NO | `now()` | Account creation time |

**Indexes:**
- `users_pkey` PRIMARY KEY (`id`)
- `users_email_key` UNIQUE (`email`)

**RLS Policies:**
- Managed by Supabase Auth

---

### clients
**Description:** Client websites tracked by users

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `user_id` | `uuid` | NO | — | FK → `users.id` |
| `name` | `text` | NO | — | Client name (e.g., "Acme Corp") |
| `slug` | `text` | NO | — | URL-friendly identifier (UNIQUE) |
| `website` | `text` | YES | — | Client website URL |
| `logo_url` | `text` | YES | — | Client logo URL |
| `theme_color` | `text` | YES | `'#3B82F6'` | Hex color code |
| `gsc_site_url` | `text` | YES | — | Google Search Console site URL |
| `ga4_property_id` | `text` | YES | — | Google Analytics 4 property ID |
| `status` | `text` | NO | `'active'` | Enum: `active`, `inactive`, `paused` |
| `contract_start` | `date` | YES | — | Contract start date |
| `contract_end` | `date` | YES | — | Contract end date |
| `notes` | `text` | YES | — | Internal notes |
| `created_at` | `timestamptz` | NO | `now()` | Record creation time |
| `updated_at` | `timestamptz` | NO | `now()` | Last update time |

**Indexes:**
- `clients_pkey` PRIMARY KEY (`id`)
- `clients_slug_key` UNIQUE (`slug`)
- `clients_user_id_idx` INDEX (`user_id`)

**Foreign Keys:**
- `clients.user_id` → `users.id` (ON DELETE CASCADE)

**RLS Policies:**
```sql
-- Policy: Users can only access clients they own
CREATE POLICY "users_access_own_clients"
ON clients FOR ALL
USING (user_id = auth.uid());
```

**Critical Security Rule:**
- Users can **ONLY** access clients where `user_id = auth.uid()`
- This is the foundation of multi-tenant isolation

---

### focus_keyword_groups
**Description:** Named groups for organizing focus keywords

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `client_id` | `uuid` | NO | — | FK → `clients.id` |
| `name` | `text` | NO | — | Group name (e.g., "Brand Keywords") |
| `color` | `text` | NO | `'#6B7280'` | Hex color code for UI |
| `created_at` | `timestamptz` | NO | `now()` | Record creation time |

**Indexes:**
- `focus_keyword_groups_pkey` PRIMARY KEY (`id`)
- `focus_keyword_groups_client_id_idx` INDEX (`client_id`)

**Foreign Keys:**
- `focus_keyword_groups.client_id` → `clients.id` (ON DELETE CASCADE)

**RLS Policies:**
```sql
-- Policy: Users can access groups via client ownership
CREATE POLICY "users_access_groups_via_clients"
ON focus_keyword_groups FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = focus_keyword_groups.client_id
    AND clients.user_id = auth.uid()
  )
);
```

---

### focus_keywords
**Description:** Keywords that users actively track

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `group_id` | `uuid` | NO | — | FK → `focus_keyword_groups.id` |
| `keyword` | `text` | NO | — | Keyword phrase (e.g., "solar panels thailand") |
| `target_position` | `integer` | YES | — | Desired ranking position |
| `priority` | `text` | NO | `'medium'` | Enum: `high`, `medium`, `low` |
| `notes` | `text` | YES | — | Notes about this keyword |
| `created_at` | `timestamptz` | NO | `now()` | Record creation time |

**Indexes:**
- `focus_keywords_pkey` PRIMARY KEY (`id`)
- `focus_keywords_group_id_idx` INDEX (`group_id`)

**Foreign Keys:**
- `focus_keywords.group_id` → `focus_keyword_groups.id` (ON DELETE CASCADE)

**RLS Policies:**
```sql
-- Policy: Users can access keywords via group → client chain
CREATE POLICY "users_access_keywords_via_groups"
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

### keyword_snapshots
**Description:** Historical keyword performance data from Google Search Console

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `client_id` | `uuid` | NO | — | FK → `clients.id` |
| `keyword` | `text` | NO | — | Keyword phrase |
| `date` | `date` | NO | — | Snapshot date |
| `position` | `float` | YES | — | Average position (can be NULL if no data) |
| `clicks` | `integer` | NO | `0` | Number of clicks |
| `impressions` | `integer` | NO | `0` | Number of impressions |
| `ctr` | `float` | NO | `0` | Click-through rate (0-1) |
| `created_at` | `timestamptz` | NO | `now()` | Record creation time |

**Indexes:**
- `keyword_snapshots_pkey` PRIMARY KEY (`id`)
- `keyword_snapshots_client_id_idx` INDEX (`client_id`)
- `keyword_snapshots_date_idx` INDEX (`date`)
- `keyword_snapshots_client_keyword_date_idx` INDEX (`client_id`, `keyword`, `date`)
  - **Purpose:** Fast trend queries for specific keywords

**Foreign Keys:**
- `keyword_snapshots.client_id` → `clients.id` (ON DELETE CASCADE)

**RLS Policies:**
```sql
-- Policy: Users can access snapshots via client ownership
CREATE POLICY "users_access_snapshots_via_clients"
ON keyword_snapshots FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = keyword_snapshots.client_id
    AND clients.user_id = auth.uid()
  )
);
```

**Data Retention:** 2 years (recommended)

**Unique Constraint:**
- **Recommended:** Add unique constraint on (`client_id`, `keyword`, `date`) to prevent duplicate snapshots

---

### traffic_snapshots
**Description:** Historical Google Analytics 4 traffic data

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `client_id` | `uuid` | NO | — | FK → `clients.id` |
| `date` | `date` | NO | — | Snapshot date |
| `sessions` | `integer` | NO | `0` | Total sessions |
| `users` | `integer` | NO | `0` | Total users |
| `new_users` | `integer` | NO | `0` | New users |
| `pageviews` | `integer` | NO | `0` | Total pageviews |
| `bounce_rate` | `float` | YES | — | Bounce rate (0-1, can be NULL) |
| `avg_session_duration` | `float` | YES | — | Avg session duration in seconds |
| `created_at` | `timestamptz` | NO | `now()` | Record creation time |

**Indexes:**
- `traffic_snapshots_pkey` PRIMARY KEY (`id`)
- `traffic_snapshots_client_id_idx` INDEX (`client_id`)
- `traffic_snapshots_date_idx` INDEX (`date`)
- `traffic_snapshots_client_date_idx` INDEX (`client_id`, `date`)
  - **Purpose:** Fast trend queries

**Foreign Keys:**
- `traffic_snapshots.client_id` → `clients.id` (ON DELETE CASCADE)

**RLS Policies:**
```sql
-- Policy: Users can access traffic snapshots via client ownership
CREATE POLICY "users_access_traffic_via_clients"
ON traffic_snapshots FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = traffic_snapshots.client_id
    AND clients.user_id = auth.uid()
  )
);
```

**Data Retention:** 2 years (recommended)

**Unique Constraint:**
- **Recommended:** Add unique constraint on (`client_id`, `date`) to prevent duplicate daily snapshots

---

## Relationships Diagram

```
users (managed by Supabase Auth)
  │
  └── clients (user_id → users.id)
          │
          ├── focus_keyword_groups (client_id → clients.id)
          │       │
          │       └── focus_keywords (group_id → focus_keyword_groups.id)
          │
          ├── keyword_snapshots (client_id → clients.id)
          │
          └── traffic_snapshots (client_id → clients.id)
```

---

## Row Level Security (RLS) Summary

### Access Control Foundation

**All data access is scoped via the `clients` table:**
- `clients.user_id = auth.uid()` is the foundation
- All other tables inherit access via foreign key relationships

### Policy Summary

| Table | RLS Policy | Access Rule |
|---|---|---|
| `clients` | Direct ownership | `user_id = auth.uid()` |
| `focus_keyword_groups` | Via client | `JOIN clients WHERE user_id = auth.uid()` |
| `focus_keywords` | Via group → client | `JOIN groups JOIN clients WHERE user_id = auth.uid()` |
| `keyword_snapshots` | Via client | `JOIN clients WHERE user_id = auth.uid()` |
| `traffic_snapshots` | Via client | `JOIN clients WHERE user_id = auth.uid()` |

### Critical Security Requirements

1. **NEVER bypass RLS** — Always query through user context
2. **NEVER use service key in client-facing code** — Service key bypasses RLS
3. **ALWAYS verify user owns client** before operations
4. **Test RLS policies** — Ensure users cannot access other users' data

---

## Common Query Patterns

### Get all clients for current user
```sql
SELECT * FROM clients
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Get focus keywords for a client (with RLS)
```sql
SELECT fk.*, fkg.name as group_name, fkg.color as group_color
FROM focus_keywords fk
JOIN focus_keyword_groups fkg ON fkg.id = fk.group_id
JOIN clients c ON c.id = fkg.client_id
WHERE c.slug = $1
  AND c.user_id = auth.uid()
ORDER BY fk.created_at DESC;
```

### Get keyword trend (last 30 days)
```sql
SELECT keyword, date, position, clicks, impressions, ctr
FROM keyword_snapshots
WHERE client_id = $1
  AND keyword = $2
  AND date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date ASC;
```
**Important:** RLS automatically enforces `client_id` ownership check.

### Get traffic trend (last 7 days)
```sql
SELECT date, sessions, users, pageviews, bounce_rate
FROM traffic_snapshots
WHERE client_id = $1
  AND date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date ASC;
```

---

## Migration Checklist

When creating migrations:

- [ ] Define table with correct column types (reference this file)
- [ ] Add `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- [ ] Add `created_at timestamptz DEFAULT now()`
- [ ] Add foreign key constraints with `ON DELETE CASCADE`
- [ ] Add indexes for foreign keys and common queries
- [ ] Enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- [ ] Create RLS policies (reference examples above)
- [ ] Test RLS policies with different users
- [ ] Update this file after migration runs

---

## Future Tables (AI Module)

### seo_insights (Planned)
**Description:** AI-generated SEO insights and recommendations

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `uuid` | NO | PK |
| `client_id` | `uuid` | NO | FK → `clients.id` |
| `type` | `text` | NO | Enum: `ranking_drop`, `ctr_low`, `opportunity`, `traffic_anomaly` |
| `keyword` | `text` | YES | Related keyword (if applicable) |
| `severity` | `text` | NO | Enum: `high`, `medium`, `low` |
| `title` | `text` | NO | Insight title |
| `description` | `text` | NO | AI-generated description |
| `recommendation` | `text` | YES | AI-generated recommendation |
| `data` | `jsonb` | YES | Supporting data (positions, clicks, etc.) |
| `status` | `text` | NO | Enum: `active`, `dismissed`, `resolved` |
| `created_at` | `timestamptz` | NO | Insight generation time |

**Status:** 🔮 Future (AI module not yet implemented)

---

## Schema Version History

| Version | Date | Changes | Migration |
|---|---|---|---|
| 0.1 | 2026-03-15 | Initial schema design (from DATA-MODEL.md) | TBD |

---

## Related Documents

- [DATA-MODEL.md (Source)](../doc/DATA-MODEL.md)
- [Domain Model](domain-model.md)
- [Architecture Overview](architecture-overview.md)
- [Multi-Tenant Safety Rules](../.claude/rules/multi-tenant-safety.md)
