# Architecture Enforcement Rules

**Purpose:** Runtime rules loaded into Claude Code to enforce architecture

---

## Before ANY Implementation

You are operating within the **Devatar Framework** for the SEO Report Dashboard.

**Current Activation Level:** Level 2 (Growing System)

### You MUST follow this workflow for every feature:

1. ✅ **Read Knowledge Files**
   - `knowledge/index.md` — Orientation
   - `knowledge/feature-map.md` — All existing features
   - `knowledge/architecture-overview.md` — System design
   - `knowledge/database-schema.md` — Database structure (if feature involves database)

2. ✅ **Run Collision Detection**
   - Search `knowledge/feature-map.md` for similar features
   - Produce collision detection report
   - If overlap found, EXTEND existing feature instead of creating new

3. ✅ **Check Architecture Rules**
   - Read `constraints/architecture-rules.md`
   - Verify feature placement matches module boundaries
   - Ensure no rule violations

4. ✅ **Create Implementation Plan**
   - Follow `workflow/dev-workflow.md`
   - Document steps before coding
   - Consider edge cases and errors

5. ✅ **Write Code**
   - Follow the plan
   - Respect module boundaries
   - Use exact table/column names from schema

6. ✅ **Update Knowledge**
   - Update `knowledge/feature-map.md` with new feature
   - Update `knowledge/database-schema.md` if schema changed
   - Update module knowledge files if API changed

---

## Architecture Rules (Quick Reference)

### Module Boundaries

- **Auth Module** → Authentication and sessions ONLY
- **Client Module** → Client CRUD ONLY
- **Dashboard Module** → KPI aggregation and display ONLY
- **Keyword Module** → Keyword ranking analysis ONLY
- **Traffic Module** → GA4 traffic analytics ONLY
- **Focus Keywords Module** → Focus keyword tracking ONLY
- **Reports Module** → Report generation ONLY

**Rule:** Module A must NOT contain logic from Module B.

---

### Database Access

**Rule:** Each module accesses ONLY the tables it owns.

**Table Ownership:**
- Client Module → `clients`
- Focus Keywords Module → `focus_keyword_groups`, `focus_keywords`
- Analytics Module → `keyword_snapshots`, `traffic_snapshots`

**Cross-module data access:** Use service APIs, NOT direct queries.

---

### External API Calls

**Rule:** All Google API calls MUST go through service layer.

**Services:**
- `lib/services/searchConsoleService.ts` — Google Search Console
- `lib/services/analyticsService.ts` — Google Analytics 4

**Forbidden:** Direct API calls outside service layer.

---

## Multi-Tenant Security

**Foundation:** `clients.user_id = auth.uid()`

**Critical Rules:**

1. **ALL queries MUST respect RLS policies**
   - Test with multiple users
   - Verify users cannot access other users' data

2. **Verify ownership before mutations**
   ```typescript
   // Check user owns resource before UPDATE/DELETE
   const { data } = await supabase
     .from('clients')
     .select('id')
     .eq('slug', slug)
     .eq('user_id', user.id) // Ownership check
     .single();

   if (!data) throw new Error('Unauthorized');
   ```

3. **NEVER use service key in client-facing code**
   - Service key bypasses RLS
   - Use ONLY in server-side admin/cron jobs

---

## Code Generation Safety

### Forbidden Actions

❌ Create new modules without justification
❌ Skip collision detection
❌ Bypass workflow steps
❌ Guess database table/column names
❌ Hardcode API credentials
❌ Use service key in frontend
❌ Disable RLS policies
❌ Skip ownership verification in mutations

### Required Actions

✅ Read schema before writing database code
✅ Run collision detection before implementing features
✅ Follow workflow (Understand → Plan → Execute → Verify → Learn)
✅ Update knowledge files after implementation
✅ Test multi-tenant isolation
✅ Handle errors gracefully
✅ Cache external API responses

---

## When in Doubt

1. **Read knowledge files** — They are the source of truth
2. **Check architecture rules** — Verify no violations
3. **Ask for clarification** — Better to ask than assume
4. **Document decisions** — Update knowledge files

---

## Quick Workflow Checklist

For every feature:

```markdown
- [ ] Read knowledge/feature-map.md
- [ ] Read knowledge/database-schema.md (if database involved)
- [ ] Run collision detection
- [ ] Check constraints/architecture-rules.md
- [ ] Create implementation plan
- [ ] Write code following plan
- [ ] Test (functional, security, architecture)
- [ ] Update knowledge/feature-map.md
- [ ] Update knowledge/database-schema.md (if schema changed)
```

---

## Related Documents

- [Architecture Rules](../../constraints/architecture-rules.md) — Full architecture constraints
- [Development Workflow](../../workflow/dev-workflow.md) — Complete workflow guide
- [Safety Guardrails](../../safety/safety-guardrails.md) — AI safety rules
- [Feature Map](../../knowledge/feature-map.md) — All system capabilities
- [Database Schema](../../knowledge/database-schema.md) — Database structure
