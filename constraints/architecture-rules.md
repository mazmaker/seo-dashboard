# Architecture Rules

**Last Updated:** 2026-03-15
**Purpose:** Machine-verifiable architecture constraints to prevent drift

---

## Purpose

These rules are **enforceable architectural constraints** — not suggestions.

**Why rules exist:**
- Prevent architecture drift as codebase grows
- Maintain clear module boundaries
- Protect multi-tenant security model
- Ensure consistent patterns across codebase

**Enforcement:**
- Manual review (Level 2 — current)
- Automated CI checks (Level 3 — when team > 3 engineers)
- Pre-implementation hooks (Level 3)

---

## Rule Categories

- **ARCH** — Architecture & Module Boundaries
- **DATA** — Database & Data Access
- **API** — External API Integration
- **SEC** — Security & Multi-Tenancy
- **MOD** — Module Creation & Modification

---

## Architecture & Module Boundaries

### ARCH-01: Single Responsibility Per Module

**Rule:** Each module must have ONE clearly defined responsibility.

**Rationale:** Prevents overlapping concerns and module bloat.

**Examples:**
- ✅ **Auth Module** — Authentication and session management ONLY
- ✅ **Client Module** — Client CRUD operations ONLY
- ❌ **Auth Module** handling both authentication AND client management

**Enforcement:**
- Before creating a module, document its single responsibility
- If a module's description uses "AND", consider splitting

---

### ARCH-02: No Duplicate Responsibilities

**Rule:** Two modules MUST NOT provide the same capability.

**Rationale:** Prevents duplication like `task-service`, `task-engine`, `task-manager` doing the same thing.

**Enforcement:**
- Run collision detection against `knowledge/feature-map.md` before implementation
- If overlap detected, extend existing module instead of creating new

---

### ARCH-03: Modules Must Not Leak Concerns

**Rule:** Module A must not contain logic that belongs to Module B.

**Examples:**
- ❌ Client management code inside Dashboard Module
- ❌ Authentication logic inside Keyword Module
- ✅ Dashboard Module calls Client Module API to fetch client data

**Enforcement:**
- Code review: Check file locations match module boundaries
- If a file is in the wrong module, refactor before merging

---

### ARCH-04: Cross-Module Communication via Defined Interfaces

**Rule:** Modules communicate through explicit APIs (functions, React hooks, API routes), never via direct data access.

**Examples:**
- ✅ Dashboard Module calls `useClient()` hook from Client Module
- ✅ Keyword Module calls `/api/clients/:id` to verify client ownership
- ❌ Dashboard Module directly imports Client Module's internal utilities

**Enforcement:**
- Each module exposes a public API (index.ts or hooks)
- Internal implementation files are not imported cross-module

---

### ARCH-05: New Modules Require Justification

**Rule:** Creating a new module requires written justification explaining:
1. Why existing modules cannot handle this responsibility
2. What specific responsibility this module owns
3. What modules it depends on
4. What APIs it exposes

**Rationale:** Prevents proliferation of unnecessary modules.

**Enforcement:**
- Add justification to `knowledge/modules/[module-name].md` before implementation
- Review justification before approving module creation

---

## Database & Data Access

### DATA-01: Database Schema Awareness is Mandatory

**Rule:** NEVER write database code (queries, migrations, models) without reading `knowledge/database-schema.md` first.

**Rationale:** Prevents guessing table/column names, wrong types, duplicate tables.

**Enforcement:**
- Before writing any database code, read schema file
- Reference exact table and column names from schema
- If unsure, check schema file again

---

### DATA-02: Database Access is Scoped Per Module

**Rule:** Each module accesses ONLY the tables it owns. Cross-module data access goes through APIs.

**Module → Table Ownership:**
- **Auth Module** → `users` (managed by Supabase Auth)
- **Client Module** → `clients`
- **Focus Keywords Module** → `focus_keyword_groups`, `focus_keywords`
- **Analytics Module** → `keyword_snapshots`, `traffic_snapshots`
- **AI Module** (future) → `seo_insights`

**Examples:**
- ✅ Client Module queries `clients` table
- ✅ Dashboard Module calls Client Module API to get client data
- ❌ Dashboard Module directly queries `clients` table

**Enforcement:**
- SQL queries must only touch tables owned by the module
- Cross-module data needs go through service APIs

---

### DATA-03: All Migrations Must Update Schema Documentation

**Rule:** After running a migration, immediately update `knowledge/database-schema.md`.

**Rationale:** Keeps schema documentation in sync with actual database.

**Enforcement:**
- Manual update (Level 2 — current)
- Automated schema sync (Level 4 — when features > 50)

---

## External API Integration

### API-01: External API Calls Must Be Centralized in Service Layer

**Rule:** All Google API calls (GSC, GA4) must go through service modules, not scattered across codebase.

**Recommended Services:**
- `lib/services/searchConsoleService.ts` — Google Search Console wrapper
- `lib/services/analyticsService.ts` — Google Analytics 4 wrapper

**Examples:**
- ✅ Dashboard calls `searchConsoleService.getPerformance()`
- ❌ Dashboard directly calls Google Search Console API

**Enforcement:**
- Grep codebase for direct API calls (should only exist in service files)
- Code review: Reject direct API calls outside service layer

---

### API-02: API Responses Must Be Cached

**Rule:** External API responses SHOULD be cached (1 hour TTL recommended).

**Rationale:** Reduces API quota usage, improves performance.

**Implementation:**
- Cache in Supabase table or Redis (future)
- Cache key format: `api:{source}:{clientId}:{params}`

**Enforcement:**
- Service layer implements caching logic
- No caching bypass unless explicitly justified

---

### API-03: API Errors Must Fallback Gracefully

**Rule:** If external API fails, system must:
1. Return cached data (if available)
2. Return demo data (if in development)
3. Display user-friendly error message

**Enforcement:**
- Service layer implements error handling
- UI displays fallback states

---

## Security & Multi-Tenancy

### SEC-01: Row Level Security (RLS) is Non-Negotiable

**Rule:** ALL database queries MUST respect Supabase Row Level Security policies.

**Foundation:** `clients.user_id = auth.uid()`

**Critical:**
- Users can **ONLY** access clients they own
- All other tables inherit access via `client_id` foreign key
- ONE RLS mistake = data breach

**Enforcement:**
- Test every query with different user contexts
- NEVER use Supabase service key in client-facing code
- Service key bypasses RLS — use ONLY in admin/cron jobs

---

### SEC-02: User Ownership Must Be Verified Before Mutations

**Rule:** Before UPDATE or DELETE operations, verify user owns the resource.

**Examples:**
```typescript
// ✅ Correct: Verify ownership before update
const { data: client } = await supabase
  .from('clients')
  .select('id')
  .eq('slug', clientSlug)
  .eq('user_id', user.id) // Ownership check
  .single();

if (!client) throw new Error('Not found or unauthorized');

await supabase
  .from('clients')
  .update({ name: newName })
  .eq('id', client.id);
```

```typescript
// ❌ Wrong: Update without ownership check
await supabase
  .from('clients')
  .update({ name: newName })
  .eq('slug', clientSlug); // No user_id check!
```

**Enforcement:**
- Code review: Check ownership verification in mutations
- RLS policies provide defense-in-depth, but explicit checks prevent logic errors

---

### SEC-03: API Credentials Must Never Be Exposed to Frontend

**Rule:** Google API credentials, Supabase service keys, and secrets must ONLY exist in:
- Environment variables (`.env.local`, Vercel environment)
- Server-side code (API routes, services)

**Never:**
- ❌ Hardcoded in frontend components
- ❌ Committed to git
- ❌ Exposed in client bundles

**Enforcement:**
- Code review: Reject hardcoded credentials
- Use environment variables for ALL secrets

---

### SEC-04: Multi-Tenant Isolation Must Be Tested

**Rule:** Test that users CANNOT access other users' data.

**Test Cases:**
1. User A creates client → User B cannot see it
2. User A cannot modify User B's clients
3. User A cannot access User B's focus keywords
4. User A cannot see User B's snapshots

**Enforcement:**
- Manual testing (Level 2 — current)
- Automated E2E tests (Level 3 — when team > 3)

---

## Module Creation & Modification

### MOD-01: Module Structure Must Follow Conventions

**Rule:** Each module follows a consistent structure.

**Recommended Structure:**
```
lib/modules/[module-name]/
├── index.ts              ← Public API (exports only)
├── types.ts              ← TypeScript types
├── hooks/                ← React hooks
│   └── useClient.ts
├── services/             ← Business logic
│   └── clientService.ts
├── components/           ← React components (optional)
└── utils/                ← Internal utilities
```

**Enforcement:**
- Code review: Check module structure matches convention
- Document exceptions in module knowledge file

---

### MOD-02: Modules Must Document Their API Surface

**Rule:** Each module must have a `knowledge/modules/[module-name].md` file documenting:
- Responsibilities
- Features provided
- Public API (hooks, functions, components)
- Dependencies on other modules

**Enforcement:**
- Module knowledge file created before module implementation
- Updated when API changes

---

### MOD-03: Modules Must Not Have Circular Dependencies

**Rule:** Module A depends on Module B → Module B CANNOT depend on Module A.

**Example:**
- ✅ Dashboard Module depends on Client Module (one direction)
- ❌ Dashboard depends on Client, Client depends on Dashboard (circular)

**Enforcement:**
- Document dependencies in module knowledge file
- Code review: Check import paths for circular dependencies
- Consider creating shared utilities module if needed

---

## Code Organization Rules

### ORG-01: API Routes Must Mirror Features

**Rule:** API route structure should reflect feature modules.

**Example:**
```
app/api/
├── clients/              ← Client Module API
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── focus-keywords/       ← Focus Keywords Module API
│   ├── route.ts
│   └── groups/
│       └── route.ts
├── gsc/                  ← Google Search Console integration
│   └── performance/
│       └── route.ts
└── ga/                   ← Google Analytics integration
    └── traffic/
        └── route.ts
```

**Enforcement:**
- Code review: Check API routes match module boundaries

---

### ORG-02: Shared Utilities Live in lib/utils/

**Rule:** Utilities used across multiple modules belong in `lib/utils/`, NOT inside specific modules.

**Examples:**
- ✅ `lib/utils/dateHelpers.ts` — Used by Dashboard, Keyword, Traffic modules
- ❌ `lib/modules/dashboard/utils/dateHelpers.ts` — Locked inside Dashboard module

**Enforcement:**
- If a utility is used in 2+ modules, move it to `lib/utils/`

---

## Future Architectural Decisions

### UI Component Library

**Decision Deferred:** Whether to use a component library (Shadcn, Radix, MUI) or build custom.

**Trigger:** Decided before implementing first UI component.

---

### State Management

**Current:** React Query for server state, React Context for client state (if needed)

**Re-evaluate:** If global state complexity increases, consider Zustand or Redux.

---

### Monorepo Structure

**Current:** Single Next.js app

**Future:** If AI module becomes large, consider splitting into separate package.

---

## Rule Violation Process

### If a Rule is Violated

1. **Identify the violation** — Which rule was broken?
2. **Assess impact** — Is data integrity or security at risk?
3. **Fix immediately** if security/data risk
4. **Refactor** if architecture drift
5. **Update rule** if rule is wrong or outdated

### If a Rule Needs to Change

1. **Document reasoning** — Why does the rule need to change?
2. **Update this file** with new rule
3. **Update affected code** to comply
4. **Update knowledge files** to reflect new pattern

---

## Related Documents

- [Architecture Overview](../knowledge/architecture-overview.md)
- [Development Workflow](../workflow/dev-workflow.md)
- [Safety Guardrails](../safety/safety-guardrails.md)
- [Schema Awareness Rules](../.claude/rules/schema-awareness.md)
