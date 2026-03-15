# Database Schema Awareness Rules

**Purpose:** Prevent database code mistakes through mandatory schema awareness

---

## Critical Rule

**NEVER write database code without reading `knowledge/database-schema.md` first.**

---

## Common AI Mistakes (Without Schema Awareness)

### ❌ Mistake 1: Guessing Column Names

```typescript
// ❌ Wrong: Guessing column name
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('userId', user.id); // Is it userId? user_id? owner_id?
```

```typescript
// ✅ Correct: Using exact name from schema
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('user_id', user.id); // Exact column name from schema
```

---

### ❌ Mistake 2: Wrong Column Types

```typescript
// ❌ Wrong: Using string for UUID
const clientId = '12345'; // Wrong type
```

```typescript
// ✅ Correct: UUID type from schema
const clientId = '550e8400-e29b-41d4-a716-446655440000'; // UUID
```

---

### ❌ Mistake 3: Creating Duplicate Tables

```typescript
// ❌ Wrong: Creating table without checking schema
CREATE TABLE client_data (...); // Duplicate of 'clients' table
```

```typescript
// ✅ Correct: Check schema first, use existing table
// Schema says 'clients' table already exists
```

---

### ❌ Mistake 4: Missing Foreign Keys

```typescript
// ❌ Wrong: No foreign key constraint
CREATE TABLE keywords (
  id uuid PRIMARY KEY,
  client_id uuid -- Missing FK constraint
);
```

```typescript
// ✅ Correct: Foreign key from schema
CREATE TABLE keywords (
  id uuid PRIMARY KEY,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE
);
```

---

### ❌ Mistake 5: Ignoring RLS Policies

```typescript
// ❌ Wrong: No RLS consideration
const { data } = await supabase
  .from('clients')
  .select('*'); // No user filter (relies only on RLS)
```

```typescript
// ✅ Correct: Explicit ownership check + RLS
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('user_id', user.id); // Explicit + RLS defense-in-depth
```

---

## Mandatory Process Before Database Code

### Step 1: Read Schema File

```
Open: knowledge/database-schema.md
Read: Complete schema for relevant tables
```

### Step 2: Identify Tables

**Ask:**
- Which tables does this feature need?
- What are the EXACT table names? (check schema)

### Step 3: Identify Columns

**Ask:**
- What are the EXACT column names? (check schema)
- What are the data types? (`uuid`, `text`, `integer`, `float`, `timestamptz`, etc.)
- Which columns are nullable?
- What are the default values?

### Step 4: Identify Relationships

**Ask:**
- What foreign keys exist?
- What is the ON DELETE behavior? (CASCADE, SET NULL, etc.)
- What tables must be joined?

### Step 5: Check RLS Policies

**Ask:**
- What RLS policies are defined?
- How does this table inherit access? (direct or via JOIN)
- Do I need explicit ownership checks?

### Step 6: Check Indexes

**Ask:**
- What indexes exist?
- Should I use existing indexes for my query?
- Do I need a new index? (rare, requires justification)

---

## Schema Reference (Quick Lookup)

### Tables

| Table | Purpose |
|---|---|
| `users` | User accounts (Supabase Auth) |
| `clients` | Client websites |
| `focus_keyword_groups` | Keyword groups |
| `focus_keywords` | Tracked keywords |
| `keyword_snapshots` | Historical keyword data (GSC) |
| `traffic_snapshots` | Historical traffic data (GA4) |

### Core Columns (Always Present)

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `created_at` | `timestamptz` | Record creation time |

### Multi-Tenant Access

**Foundation:** `clients.user_id = auth.uid()`

All other tables inherit access via `client_id` → `clients.id`.

---

## Query Patterns from Schema

### Pattern 1: Get User's Clients

```typescript
const { data: clients } = await supabase
  .from('clients')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

**Schema reference:** `clients.user_id` (uuid, FK → users.id)

---

### Pattern 2: Get Focus Keywords for Client

```typescript
const { data: keywords } = await supabase
  .from('focus_keywords')
  .select(`
    *,
    group:focus_keyword_groups!inner(
      name,
      color,
      client:clients!inner(
        slug,
        user_id
      )
    )
  `)
  .eq('group.client.slug', clientSlug)
  .eq('group.client.user_id', user.id);
```

**Schema reference:**
- `focus_keywords.group_id` → `focus_keyword_groups.id`
- `focus_keyword_groups.client_id` → `clients.id`
- `clients.user_id` → `users.id`

---

### Pattern 3: Get Keyword Trend (Last 30 Days)

```typescript
const { data: snapshots } = await supabase
  .from('keyword_snapshots')
  .select('keyword, date, position, clicks, impressions, ctr')
  .eq('client_id', clientId)
  .eq('keyword', keyword)
  .gte('date', thirtyDaysAgo)
  .order('date', { ascending: true });
```

**Schema reference:**
- `keyword_snapshots.client_id` (uuid, FK → clients.id)
- `keyword_snapshots.date` (date)
- Index: `keyword_snapshots_client_keyword_date_idx`

---

## Migration Checklist (From Schema)

When creating a migration:

1. ✅ **Table Name**
   - Use exact naming convention from schema (snake_case)
   - Singular or plural? (Check existing tables: `clients`, not `client`)

2. ✅ **Columns**
   - `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
   - `created_at timestamptz DEFAULT now()`
   - All other columns with correct types from schema

3. ✅ **Foreign Keys**
   - Add constraints: `REFERENCES table(column) ON DELETE CASCADE`
   - Match existing patterns from schema

4. ✅ **Indexes**
   - Add indexes for foreign keys
   - Add indexes for common query patterns

5. ✅ **RLS Policies**
   - `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
   - Create policies matching existing patterns
   - Test policies work correctly

6. ✅ **Update Schema File**
   - Add new table/columns to `knowledge/database-schema.md`
   - Document RLS policies
   - Update relationships diagram

---

## RLS Policy Patterns (From Schema)

### Direct Ownership (clients table)

```sql
CREATE POLICY "users_access_own_clients"
ON clients FOR ALL
USING (user_id = auth.uid());
```

### Inherited via JOIN (focus_keyword_groups)

```sql
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

### Inherited via Multi-level JOIN (focus_keywords)

```sql
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

## When to Update Schema File

**Triggers:**
1. After running a migration
2. After adding/modifying tables
3. After changing RLS policies
4. After adding indexes

**Process:**
1. Run migration
2. **Immediately** update `knowledge/database-schema.md`
3. Commit schema file with migration

**Future (Level 4):** Automated schema sync from Supabase.

---

## Emergency: If Schema File is Outdated

If you suspect schema file is out of sync with actual database:

1. **Do NOT guess** — Stop implementation
2. **Flag the issue** — Notify team
3. **Update schema file** manually
4. **Verify accuracy** against actual database
5. **Proceed** only after schema is current

---

## Related Documents

- [Database Schema (Full)](../../knowledge/database-schema.md) — Complete schema reference
- [Domain Model](../../knowledge/domain-model.md) — Entity relationships
- [Architecture Rules](../../constraints/architecture-rules.md) — DATA-01, DATA-02, DATA-03
- [Multi-Tenant Safety](multi-tenant-safety.md) — RLS enforcement
