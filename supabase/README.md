# Supabase Database Setup

## Overview

This directory contains Supabase database migrations for the SEO Report Dashboard.

**Database:** PostgreSQL (Supabase)
**Migration Tool:** Supabase CLI

---

## Tables

| Table | Purpose | RLS Enabled |
|---|---|---|
| `clients` | Client websites tracked by users | ✅ |
| `focus_keyword_groups` | Keyword groups | ✅ |
| `focus_keywords` | Tracked keywords | ✅ |
| `keyword_snapshots` | Historical keyword data (GSC) | ✅ |
| `traffic_snapshots` | Historical traffic data (GA4) | ✅ |

---

## Setup Instructions

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase (if not done):**
   ```bash
   supabase init
   ```

3. **Link to your Supabase project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Run migrations:**
   ```bash
   supabase db push
   ```

---

### Option 2: Manual Setup via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - `20260315000001_create_clients_table.sql`
   - `20260315000002_create_focus_keyword_groups_table.sql`
   - `20260315000003_create_focus_keywords_table.sql`
   - `20260315000004_create_keyword_snapshots_table.sql`
   - `20260315000005_create_traffic_snapshots_table.sql`

---

## Migration Files

### 20260315000001_create_clients_table.sql
- Creates `clients` table
- Adds RLS policy: Users can only access their own clients
- Indexes: `user_id`, `slug`, `status`

### 20260315000002_create_focus_keyword_groups_table.sql
- Creates `focus_keyword_groups` table
- Foreign key: `client_id` → `clients.id`
- RLS policy: Access via client ownership

### 20260315000003_create_focus_keywords_table.sql
- Creates `focus_keywords` table
- Foreign key: `group_id` → `focus_keyword_groups.id`
- RLS policy: Access via group → client chain

### 20260315000004_create_keyword_snapshots_table.sql
- Creates `keyword_snapshots` table
- Foreign key: `client_id` → `clients.id`
- Unique constraint: `(client_id, keyword, date)`
- Composite index for trend queries

### 20260315000005_create_traffic_snapshots_table.sql
- Creates `traffic_snapshots` table
- Foreign key: `client_id` → `clients.id`
- Unique constraint: `(client_id, date)`
- Composite index for trend queries

---

## Row Level Security (RLS)

**Foundation:** All data access is scoped via `clients.user_id = auth.uid()`

### Access Control

| Table | RLS Policy | Access Rule |
|---|---|---|
| `clients` | Direct ownership | `user_id = auth.uid()` |
| `focus_keyword_groups` | Via client | JOIN clients WHERE user_id = auth.uid() |
| `focus_keywords` | Via group → client | JOIN groups JOIN clients WHERE user_id = auth.uid() |
| `keyword_snapshots` | Via client | JOIN clients WHERE user_id = auth.uid() |
| `traffic_snapshots` | Via client | JOIN clients WHERE user_id = auth.uid() |

**Critical:** Users can ONLY access data they own. Multi-tenant isolation is enforced at the database level.

---

## Testing RLS Policies

After running migrations, test multi-tenant isolation:

```sql
-- Test 1: Create test users
-- Use Supabase Auth to create 2 test users

-- Test 2: User A creates client
INSERT INTO clients (user_id, name, slug)
VALUES (auth.uid(), 'Test Client A', 'test-a');

-- Test 3: Switch to User B, try to access User A's client
SELECT * FROM clients WHERE slug = 'test-a';
-- Should return empty (RLS blocks access)

-- Test 4: User A can see their own client
-- Switch to User A
SELECT * FROM clients WHERE slug = 'test-a';
-- Should return the client
```

---

## Common Queries

### Get all clients for current user
```sql
SELECT * FROM clients
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Get focus keywords for a client
```sql
SELECT fk.*, fkg.name as group_name, fkg.color as group_color
FROM focus_keywords fk
JOIN focus_keyword_groups fkg ON fkg.id = fk.group_id
JOIN clients c ON c.id = fkg.client_id
WHERE c.slug = 'client-slug'
  AND c.user_id = auth.uid()
ORDER BY fk.created_at DESC;
```

### Get keyword trend (last 30 days)
```sql
SELECT keyword, date, position, clicks, impressions, ctr
FROM keyword_snapshots
WHERE client_id = 'client-uuid'
  AND keyword = 'target keyword'
  AND date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date ASC;
```

---

## Indexes

All tables have indexes for:
- Foreign keys (fast JOINs)
- Common query patterns (trend queries)
- Date columns (time-series queries)

**Composite Indexes:**
- `keyword_snapshots(client_id, keyword, date DESC)` — Keyword trend queries
- `traffic_snapshots(client_id, date DESC)` — Traffic trend queries

---

## Data Retention

**Recommended:**
- `keyword_snapshots` — Keep 2 years of data
- `traffic_snapshots` — Keep 2 years of data

**Cleanup Script (Future):**
```sql
-- Delete snapshots older than 2 years
DELETE FROM keyword_snapshots
WHERE date < CURRENT_DATE - INTERVAL '2 years';

DELETE FROM traffic_snapshots
WHERE date < CURRENT_DATE - INTERVAL '2 years';
```

---

## Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Related Documentation

- [Database Schema](../knowledge/database-schema.md) — Complete schema reference
- [Domain Model](../knowledge/domain-model.md) — Entity relationships
- [Multi-Tenant Safety](../.claude/rules/multi-tenant-safety.md) — RLS security rules
