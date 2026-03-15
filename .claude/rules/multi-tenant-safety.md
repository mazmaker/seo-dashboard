# Multi-Tenant Safety Rules

**Purpose:** Enforce security guardrails for multi-tenant architecture

---

## Critical Security Foundation

This is a **multi-tenant system** where:
- One user CANNOT access another user's data
- ONE mistake = data breach
- Row Level Security (RLS) is the foundation

**Access Control Rule:** `clients.user_id = auth.uid()`

---

## Multi-Tenant Architecture

```
User A                          User B
  │                               │
  └── Clients (user_id = A)       └── Clients (user_id = B)
          │                               │
          ├── Client A1                   ├── Client B1
          │   ├── Keywords                │   ├── Keywords
          │   ├── Snapshots               │   ├── Snapshots
          │   └── Focus Keywords          │   └── Focus Keywords
          │                               │
          └── Client A2                   └── Client B2
              ├── Keywords                    ├── Keywords
              ├── Snapshots                   ├── Snapshots
              └── Focus Keywords              └── Focus Keywords
```

**Critical:** User A CANNOT access Client B1, Client B2, or any of their data.

---

## Row Level Security (RLS) Foundation

### What is RLS?

**Row Level Security (RLS)** is a PostgreSQL feature that filters database rows based on the current user.

**Enabled on all tables:**
```sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_keyword_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_snapshots ENABLE ROW LEVEL SECURITY;
```

### How RLS Works

**Without RLS:**
```sql
SELECT * FROM clients;
-- Returns ALL clients (security breach!)
```

**With RLS:**
```sql
SELECT * FROM clients;
-- Returns ONLY clients where user_id = auth.uid()
```

### RLS is Automatic (But Not Perfect)

**Important:** RLS filters rows automatically, BUT:
- Service key bypasses RLS (NEVER use in client code)
- Logic errors can still occur
- Explicit ownership checks provide defense-in-depth

---

## Mandatory Security Rules

### SEC-01: ALL Queries Must Respect RLS

**Rule:** Every database query MUST run in user context (authenticated session).

**Correct:**
```typescript
// User is authenticated via Supabase session
const { data } = await supabase
  .from('clients')
  .select('*');
// RLS automatically filters to user's clients
```

**Wrong:**
```typescript
// Using service key (bypasses RLS!)
const supabaseAdmin = createClient(url, SERVICE_KEY);
const { data } = await supabaseAdmin
  .from('clients')
  .select('*');
// Returns ALL clients from ALL users (security breach!)
```

**Enforcement:**
- NEVER use service key in client-facing code
- Service key ONLY for admin/cron jobs
- Always use user-authenticated client

---

### SEC-02: Verify Ownership Before Mutations

**Rule:** Before UPDATE or DELETE, explicitly verify user owns the resource.

**Why:** Defense-in-depth. RLS prevents the query, but explicit checks prevent logic errors.

**Pattern:**
```typescript
// ✅ Correct: Explicit ownership check
async function updateClient(slug: string, updates: any, userId: string) {
  // Step 1: Verify ownership
  const { data: client, error } = await supabase
    .from('clients')
    .select('id')
    .eq('slug', slug)
    .eq('user_id', userId) // Explicit check
    .single();

  if (error || !client) {
    throw new Error('Client not found or unauthorized');
  }

  // Step 2: Perform mutation (RLS provides second layer of protection)
  const { data, error: updateError } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', client.id)
    .single();

  if (updateError) throw updateError;
  return data;
}
```

```typescript
// ❌ Wrong: No ownership verification
async function updateClient(slug: string, updates: any) {
  // Directly update without checking ownership first
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('slug', slug); // RLS will block, but better to check explicitly

  // If RLS blocks, error is generic (confusing for debugging)
  if (error) throw error;
  return data;
}
```

**Enforcement:**
- Every mutation includes ownership verification step
- Code review: Check ownership checks exist

---

### SEC-03: Test Multi-Tenant Isolation

**Rule:** Test that users CANNOT access each other's data.

**Required Tests:**

#### Test 1: User A Cannot See User B's Clients
```typescript
// User A authenticated
const { data: clientsA } = await supabase
  .from('clients')
  .select('*');

// Should ONLY return User A's clients
// Should NOT include User B's clients
```

#### Test 2: User A Cannot Modify User B's Clients
```typescript
// User A authenticated
// Try to update User B's client
const { error } = await supabase
  .from('clients')
  .update({ name: 'Hacked!' })
  .eq('slug', 'user-b-client');

// Should fail (RLS blocks)
// error.code === 'PGRST116' (no rows matched)
```

#### Test 3: User A Cannot Access User B's Focus Keywords
```typescript
// User A authenticated
// Try to access User B's keywords
const { data } = await supabase
  .from('focus_keywords')
  .select('*')
  .eq('group_id', 'user-b-group-id');

// Should return empty array (RLS blocks)
```

#### Test 4: User A Cannot Access User B's Snapshots
```typescript
// User A authenticated
// Try to access User B's snapshots
const { data } = await supabase
  .from('keyword_snapshots')
  .select('*')
  .eq('client_id', 'user-b-client-id');

// Should return empty array (RLS blocks)
```

**Enforcement:**
- Manual testing (Level 2 — current)
- Automated E2E tests (Level 3 — when team > 3)

---

### SEC-04: NEVER Use Service Key in Client-Facing Code

**Rule:** Supabase service key bypasses RLS and MUST ONLY be used in secure contexts.

**Allowed Usage:**
- ✅ Server-side admin functions (rare)
- ✅ Cron jobs (data sync, cleanup)
- ✅ Backend scripts (migrations, seeding)

**Forbidden Usage:**
- ❌ API routes accessible to users
- ❌ Frontend code
- ❌ Any code that handles user requests

**Why:**
```typescript
// Service key bypasses RLS!
const supabaseAdmin = createClient(url, SERVICE_KEY);

const { data } = await supabaseAdmin
  .from('clients')
  .select('*');

// Returns ALL clients from ALL users (data breach!)
```

**Enforcement:**
- Code review: Reject service key in user-facing code
- Environment variable naming: `SUPABASE_SERVICE_ROLE_KEY` (clearly marked)

---

## RLS Policy Reference

From `knowledge/database-schema.md`:

### clients Table

```sql
CREATE POLICY "users_access_own_clients"
ON clients FOR ALL
USING (user_id = auth.uid());
```

**Effect:** User can only access rows where `user_id` matches their auth UID.

---

### focus_keyword_groups Table

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

**Effect:** User can access groups if they own the parent client.

---

### focus_keywords Table

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

**Effect:** User can access keywords if they own the client (via group → client chain).

---

### keyword_snapshots & traffic_snapshots Tables

```sql
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

**Effect:** User can access snapshots if they own the client.

---

## Common Security Mistakes

### ❌ Mistake 1: Using Service Key in API Route

```typescript
// app/api/clients/route.ts
import { createClient } from '@supabase/supabase-js';

// ❌ WRONG: Service key in user-facing API
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypasses RLS!
);

export async function GET(request: Request) {
  const { data } = await supabase.from('clients').select('*');
  // Returns ALL clients from ALL users (security breach!)
  return Response.json(data);
}
```

```typescript
// ✅ CORRECT: Use user session
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Query with RLS (automatically filtered to user's clients)
  const { data } = await supabase.from('clients').select('*');
  return Response.json(data);
}
```

---

### ❌ Mistake 2: No Ownership Check Before Mutation

```typescript
// ❌ WRONG: Direct mutation without ownership check
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const updates = await request.json();

  const { data } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', params.id); // RLS will block, but error is generic

  return Response.json(data);
}
```

```typescript
// ✅ CORRECT: Verify ownership first
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const updates = await request.json();

  // Step 1: Verify ownership
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (!client) {
    return Response.json({ error: 'Not found or unauthorized' }, { status: 404 });
  }

  // Step 2: Perform mutation
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', params.id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
```

---

### ❌ Mistake 3: Exposing All Clients in API

```typescript
// ❌ WRONG: No user filter (even though RLS will apply)
export async function GET(request: Request) {
  const { data } = await supabase
    .from('clients')
    .select('*'); // Relies only on RLS

  return Response.json(data);
}
```

```typescript
// ✅ CORRECT: Explicit user filter + RLS defense-in-depth
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', session.user.id); // Explicit + RLS

  return Response.json(data);
}
```

---

## Security Testing Checklist

Before merging any feature that touches the database:

- [ ] **Test 1:** User A cannot see User B's clients
- [ ] **Test 2:** User A cannot modify User B's clients
- [ ] **Test 3:** User A cannot delete User B's clients
- [ ] **Test 4:** User A cannot access User B's focus keywords
- [ ] **Test 5:** User A cannot access User B's snapshots
- [ ] **Test 6:** Unauthenticated requests are rejected
- [ ] **Test 7:** Expired sessions are rejected

**How to Test:**
1. Create two test users (User A, User B)
2. User A creates clients, keywords, etc.
3. User B creates clients, keywords, etc.
4. Try to access User B's data while authenticated as User A
5. Verify all attempts fail

---

## When in Doubt

**If unsure about security:**

1. ✅ **Read RLS policies** in `knowledge/database-schema.md`
2. ✅ **Add explicit ownership checks** before mutations
3. ✅ **Test with multiple users**
4. ✅ **Ask for security review**

**Better safe than sorry. ONE mistake = data breach.**

---

## Related Documents

- [Database Schema](../../knowledge/database-schema.md) — RLS policies
- [Architecture Rules](../../constraints/architecture-rules.md) — SEC-01 to SEC-04
- [Safety Guardrails](../../safety/safety-guardrails.md) — SEC-GUARD-01 to SEC-GUARD-04
