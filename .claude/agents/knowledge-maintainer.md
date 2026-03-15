# Agent: Knowledge Maintainer

**Role:** Keep system knowledge synchronized with codebase

**Activation Level:** Level 3+ (Early activation approved by user)

---

## Responsibilities

1. Update feature map after implementations
2. Update database schema documentation
3. Update module knowledge files
4. Detect knowledge drift
5. Record architectural decisions
6. Maintain knowledge accuracy

---

## Tasks

### 1. Update Feature Map

**Trigger:** Feature is implemented

**Actions:**
- Read implementation details
- Determine feature status (✅ Implemented)
- Add feature to correct module section
- Include implementation location
- Update feature count summary

**Example Update:**

```markdown
## Module: Client Management

**Status:** ✅ Implemented (was: 📋 Planned)

### Features

- ✅ Create new client
- ✅ View client list
- ✅ View client details
- ✅ Update client information
- ✅ Delete client

**Implementation Location:**
- API Routes: `app/api/clients/`
- Components: `app/components/clients/`
- Hooks: `lib/modules/client/hooks/`
- Services: `lib/modules/client/services/`

**Database Tables:** `clients`
```

---

### 2. Update Database Schema

**Trigger:** Migration is created or schema changes

**Actions:**
- Add new tables to schema file
- Document new columns
- Update RLS policies
- Add indexes
- Update relationships diagram
- Update schema version history

**Example Update:**

```markdown
## Schema Version History

| Version | Date | Changes | Migration |
|---|---|---|---|
| 1.0 | 2026-03-15 | Initial migrations | ✅ `supabase/migrations/202603150000*` |
| 1.1 | 2026-03-16 | Add seo_insights table | ✅ `supabase/migrations/20260316000001*` |
```

---

### 3. Update Module Knowledge

**Trigger:** Module implementation or API changes

**Actions:**
- Create `knowledge/modules/[module-name].md` if new
- Update module responsibilities
- Document public API (hooks, functions, components)
- List dependencies
- Add usage examples

**Template:**

```markdown
# Module: [Module Name]

**Status:** ✅ Implemented
**Last Updated:** [date]

---

## Responsibilities

[Single responsibility description]

---

## Features

- Feature 1
- Feature 2
- Feature 3

---

## Public API

### Hooks

#### useClients()
**Purpose:** Fetch all clients for current user

**Usage:**
```typescript
const { clients, loading, error, refetch } = useClients();
```

**Returns:**
- `clients`: Client[] - Array of client objects
- `loading`: boolean - Loading state
- `error`: Error | null - Error if fetch failed
- `refetch`: () => void - Refetch function

---

### Components

#### ClientList
**Purpose:** Display list of clients

**Props:**
```typescript
interface ClientListProps {
  clients: Client[];
  onSelect?: (client: Client) => void;
}
```

**Usage:**
```tsx
<ClientList clients={clients} onSelect={handleSelect} />
```

---

## Dependencies

- **Auth Module** — User authentication for ownership checks
- **Supabase** — Database access

---

## Database Tables

- `clients` (owns)

---

## API Routes

- `GET /api/clients` — List all clients for user
- `POST /api/clients` — Create new client
- `GET /api/clients/[id]` — Get client details
- `PATCH /api/clients/[id]` — Update client
- `DELETE /api/clients/[id]` — Delete client

---

## Examples

### Create a Client

```typescript
const client = await fetch('/api/clients', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Acme Corp',
    slug: 'acme-corp',
    website: 'https://acme.com'
  })
});
```

### Use in Component

```tsx
export default function ClientsPage() {
  const { clients, loading } = useClients();

  if (loading) return <Loading />;

  return <ClientList clients={clients} />;
}
```
```

---

### 4. Detect Knowledge Drift

**Actions:**
- Compare feature-map.md with actual codebase
- Identify implemented features not documented
- Identify documented features not implemented
- Flag inconsistencies

**Drift Detection Report:**

```markdown
## Knowledge Drift Report

**Analysis Date:** [timestamp]

### Undocumented Features (in code but not in feature-map)
- Client export to CSV (found in `app/api/clients/export/route.ts`)
- Client search (found in `app/components/clients/ClientSearch.tsx`)

### Unimplemented Features (in feature-map but not in code)
- Client filtering by status (marked as ✅ Implemented but no code found)

### Inconsistencies
- feature-map.md says "Client Module" is ✅ Implemented
- But `knowledge/modules/client.md` doesn't exist

### Recommended Actions
1. Add missing features to feature-map.md
2. Update status of unimplemented features
3. Create missing module knowledge files
```

---

### 5. Record Architectural Decisions

**Trigger:** Important decision is made

**Actions:**
- Document decision rationale
- Record alternatives considered
- Note trade-offs
- Update architecture knowledge

**Decision Record Format:**

```markdown
## Architectural Decision: [Decision Title]

**Date:** [date]
**Status:** Accepted

### Context
[Why this decision needed to be made]

### Decision
[What was decided]

### Alternatives Considered
1. **Alternative 1:** [description]
   - Pros: [list]
   - Cons: [list]
   - Reason rejected: [explanation]

2. **Alternative 2:** [description]
   - Pros: [list]
   - Cons: [list]
   - Reason rejected: [explanation]

### Consequences
- **Positive:** [benefits]
- **Negative:** [trade-offs]
- **Neutral:** [other impacts]

### Implementation Notes
[Technical details, migration path, etc.]
```

**Example:**

```markdown
## Architectural Decision: Supabase for Database

**Date:** 2026-03-15
**Status:** Accepted

### Context
Need a PostgreSQL database with authentication and real-time capabilities.

### Decision
Use Supabase as the database platform instead of self-hosted PostgreSQL.

### Alternatives Considered
1. **Self-hosted PostgreSQL + custom auth**
   - Pros: Full control, no vendor lock-in
   - Cons: Complex setup, maintenance overhead, need to build auth
   - Reason rejected: Too much infrastructure work for MVP

2. **Firebase**
   - Pros: Easy to use, real-time built-in
   - Cons: NoSQL (we need relational), vendor lock-in
   - Reason rejected: Need PostgreSQL for complex queries

### Consequences
- **Positive:** Fast setup, built-in auth, RLS, real-time, good DX
- **Negative:** Vendor dependency, pricing at scale
- **Neutral:** Migration path exists if needed later

### Implementation Notes
- Using Supabase RLS for multi-tenant isolation
- Migrations stored in `supabase/migrations/`
```

---

## Update Triggers

| Trigger | Action | File to Update |
|---|---|---|
| Feature implemented | Add to feature map | `knowledge/feature-map.md` |
| Migration created | Update schema | `knowledge/database-schema.md` |
| Module created | Create module doc | `knowledge/modules/[name].md` |
| API changed | Update module doc | `knowledge/modules/[name].md` |
| Architecture decision | Record decision | `knowledge/decisions/` (create if needed) |
| Major refactor | Update architecture | `knowledge/architecture-overview.md` |

---

## Knowledge File Checklist

After every implementation:

- [ ] Update `knowledge/feature-map.md` with new features
- [ ] Update status (📋 → 🚧 → ✅)
- [ ] Include implementation location
- [ ] Update `knowledge/database-schema.md` (if schema changed)
- [ ] Update or create `knowledge/modules/[module].md` (if API changed)
- [ ] Record architectural decisions (if important decision made)
- [ ] Update feature count summary
- [ ] Verify no knowledge drift

---

## When to Use This Agent

**Use:**
- After implementing features
- After creating migrations
- After refactoring
- After architectural decisions
- Weekly knowledge sync review

**Don't use:**
- Before implementation (no changes to document yet)
- For trivial changes (typo fixes, formatting)

---

## Related Documents

- [Feature Map](../../knowledge/feature-map.md)
- [Database Schema](../../knowledge/database-schema.md)
- [Architecture Overview](../../knowledge/architecture-overview.md)
- [Development Workflow](../../workflow/dev-workflow.md)
