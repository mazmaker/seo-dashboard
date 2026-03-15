# AI Safety Guardrails

**Last Updated:** 2026-03-15
**Purpose:** Mandatory behavioral constraints for AI code generation

---

## Purpose

These guardrails enforce **safety constraints** on AI behavior beyond prompting alone.

**Why safety rules are needed:**
- Markdown instructions can be ignored or forgotten
- Multi-tenant RLS mistakes = data breach
- External API credentials must be protected
- Database schema must be respected

**Enforcement:**
- Manual compliance (Level 2 — current)
- Automated hooks (Level 3 — when team > 3)
- CI validation (Level 3)

---

## Critical Safety Rules

### SAFETY-01: Module Creation Requires Justification

**Rule:** AI MUST NOT create new modules without written architecture justification.

**Why:** Prevents module proliferation (`task-service`, `task-engine`, `task-manager`).

**Required Before Module Creation:**
1. Written justification in `knowledge/modules/[module-name].md`
2. Explanation of single responsibility
3. List of dependencies
4. Public API documentation

**Exception:** None. All modules require justification.

**Enforcement:**
- Code review: Check justification exists
- Reject PR if module lacks justification

---

### SAFETY-02: Collision Detection is Mandatory

**Rule:** AI MUST run collision detection against `knowledge/feature-map.md` BEFORE implementing any feature.

**Why:** Prevents duplicate features and overlapping capabilities.

**Process:**
1. Read `knowledge/feature-map.md`
2. Search for existing or similar features
3. Produce collision detection report
4. If collision detected, EXTEND existing instead of creating new

**Exception:** Bug fixes without new capabilities can skip collision detection.

**Enforcement:**
- Workflow Step 3 is mandatory
- Code review: Check collision detection was performed

---

### SAFETY-03: Architecture Rules Must Be Followed

**Rule:** AI MUST follow all rules defined in `constraints/architecture-rules.md`.

**Why:** Prevents architecture drift and maintains system integrity.

**Key Rules:**
- Single responsibility per module (ARCH-01)
- No duplicate responsibilities (ARCH-02)
- No concern leakage (ARCH-03)
- Cross-module communication via APIs (ARCH-04)
- Database access scoped per module (DATA-02)

**Exception:** If a rule must be violated, document why and update the rule.

**Enforcement:**
- Architecture validation in workflow Step 7
- Code review: Check rule compliance

---

### SAFETY-04: Knowledge Files Must Be Updated

**Rule:** AI MUST update knowledge files AFTER every implementation that adds or changes features.

**Why:** Knowledge drift leads to duplicate features and incorrect assumptions.

**Required Updates:**
1. `knowledge/feature-map.md` — Add new feature with status and location
2. `knowledge/database-schema.md` — Update if schema changed
3. `knowledge/modules/[name].md` — Update if module API changed

**Exception:** Bug fixes without new features can skip feature-map update.

**Enforcement:**
- Workflow Step 8 is mandatory
- Code review: Verify knowledge files updated

---

### SAFETY-05: Module Boundaries Must Not Be Modified Without Approval

**Rule:** AI MUST NOT modify module boundaries (move files between modules, merge modules, split modules) without explicit approval.

**Why:** Architecture changes affect entire codebase and team understanding.

**Process:**
1. Document proposed boundary change
2. Explain rationale
3. Request approval
4. Update architecture documentation

**Exception:** Moving a file to fix a clear ARCH-03 violation (concern leakage).

**Enforcement:**
- Code review: Flag unexpected file moves
- Architecture documentation must reflect structure

---

### SAFETY-06: Pre-Implementation Checks Must Not Be Bypassed

**Rule:** AI MUST NOT bypass workflow Steps 1-5 (Understand → Plan).

**Why:** Planning prevents wasted effort, architecture mistakes, and security issues.

**Mandatory Steps:**
1. Feature request clarification
2. Capability awareness (read knowledge files)
3. Schema awareness (if database involved)
4. Collision detection
5. Architecture impact analysis
6. Implementation plan

**Exception:** None. All features require planning.

**Enforcement:**
- Workflow checklist in PR description
- Code review: Verify planning occurred

---

### SAFETY-07: Database Schema Must Be Read Before Any Database Code

**Rule:** AI MUST read `knowledge/database-schema.md` BEFORE writing ANY query, migration, or data model code.

**Why:** Prevents guessing column names, wrong types, duplicate tables, and RLS violations.

**Process:**
1. Read schema file completely
2. Identify relevant tables
3. Note exact column names and types
4. Check RLS policies
5. Write code using exact names from schema

**Common Mistakes Prevented:**
- Guessing `user_id` vs `userId` vs `owner_id`
- Using `string` instead of `uuid`
- Creating duplicate tables
- Ignoring foreign key constraints
- Missing RLS policies

**Exception:** None. Schema awareness is mandatory for all database code.

**Enforcement:**
- Workflow Step 2b is mandatory if feature involves database
- Code review: Verify exact table/column names from schema

---

## Multi-Tenant Security Guardrails

### SEC-GUARD-01: RLS Policies Must Never Be Bypassed

**Rule:** ALL database queries MUST respect Row Level Security policies.

**Foundation:** `clients.user_id = auth.uid()`

**Critical:**
- Users can ONLY access clients they own
- ONE mistake = data breach
- Test with multiple users to verify isolation

**Forbidden Actions:**
- Using Supabase service key in client-facing code (bypasses RLS)
- Writing queries without RLS context
- Disabling RLS on tables

**Enforcement:**
- Code review: Check all queries respect RLS
- Security testing: Verify multi-tenant isolation

---

### SEC-GUARD-02: Ownership Verification Required for Mutations

**Rule:** Before UPDATE or DELETE operations, explicitly verify user owns the resource.

**Pattern:**
```typescript
// ✅ Correct
const { data: client } = await supabase
  .from('clients')
  .select('id')
  .eq('slug', slug)
  .eq('user_id', user.id) // Ownership check
  .single();

if (!client) throw new Error('Unauthorized');

// Proceed with mutation
```

```typescript
// ❌ Wrong
await supabase
  .from('clients')
  .update({ name })
  .eq('slug', slug); // No ownership check!
```

**Enforcement:**
- Code review: Verify ownership checks before mutations
- Security testing: Test unauthorized access attempts

---

### SEC-GUARD-03: API Credentials Must Never Be Exposed

**Rule:** Secrets MUST ONLY exist in environment variables and server-side code.

**Forbidden:**
- Hardcoded API keys in code
- Credentials in frontend code
- Secrets committed to git
- Service keys in client bundles

**Allowed:**
- Environment variables (`.env.local`, Vercel)
- Server-side API routes
- Secure secret management services

**Enforcement:**
- Code review: Reject hardcoded credentials
- Git hooks: Block commits with secrets (future Level 3)

---

### SEC-GUARD-04: Test Multi-Tenant Isolation

**Rule:** Test that users CANNOT access other users' data.

**Required Test Cases:**
1. User A creates client → User B cannot see it
2. User A cannot modify User B's clients
3. User A cannot access User B's focus keywords
4. User A cannot see User B's snapshots

**Enforcement:**
- Manual testing (Level 2 — current)
- Automated E2E tests (Level 3 — when team > 3)

---

## Code Generation Guardrails

### CODE-GUARD-01: No Feature Flags or Backward Compatibility Hacks

**Rule:** Write clean code. No feature flags for new features. No `_unused` variable renaming.

**Why:** Backward compatibility is not needed for a new codebase.

**Forbidden:**
- Feature flags for new features
- `// removed` comments for deleted code
- Renaming variables to `_varName` to avoid "unused" warnings
- Re-exporting types just for backward compatibility

**Allowed:**
- Delete unused code completely
- Refactor directly
- Update calling code if API changes

**Enforcement:**
- Code review: Reject unnecessary complexity

---

### CODE-GUARD-02: No Over-Engineering

**Rule:** Only make changes directly requested or clearly necessary.

**Forbidden:**
- Adding features beyond scope
- Refactoring code not being changed
- Adding error handling for impossible scenarios
- Creating abstractions for single-use code
- Adding docstrings/comments to unchanged code

**Allowed:**
- Simple, focused solutions
- Direct implementations
- Comments where logic is non-obvious

**Enforcement:**
- Code review: Reject scope creep

---

### CODE-GUARD-03: Security First

**Rule:** Prioritize security over convenience.

**Examples:**
- Input validation at system boundaries
- Parameterized queries (prevent SQL injection)
- XSS prevention in user-generated content
- Rate limiting for external APIs
- Secure session management

**Enforcement:**
- Code review: Security checklist
- OWASP Top 10 awareness

---

## Workflow Enforcement Guardrails

### WORKFLOW-GUARD-01: Planning Before Coding

**Rule:** AI MUST complete planning (Steps 1-5) BEFORE code generation (Step 6).

**Why:** Prevents architecture mistakes, wasted effort, and need for refactoring.

**Process:**
1. Understand (read knowledge)
2. Plan (collision detection, architecture analysis, implementation plan)
3. Execute (code generation)

**Enforcement:**
- Workflow checklist required
- Code review: Verify planning occurred

---

### WORKFLOW-GUARD-02: Knowledge Updates Cannot Be Deferred

**Rule:** Knowledge files MUST be updated immediately after implementation, not "later".

**Why:** Deferred updates never happen, leading to knowledge drift.

**Process:**
1. Implement feature
2. Test feature
3. Update knowledge files **immediately**
4. Commit knowledge updates with code

**Enforcement:**
- PR checklist: Knowledge files updated
- Code review: Verify knowledge commits

---

## Guardrail Violation Response

### If a Guardrail is Violated

1. **Stop implementation** — Do not proceed
2. **Assess risk:**
   - **Security violation** → Fix immediately, do not merge
   - **Architecture violation** → Refactor or justify exception
   - **Workflow violation** → Complete skipped steps
3. **Fix violation** before proceeding
4. **Document exception** if rule cannot be followed (rare)

### If a Guardrail Needs to Change

1. **Document why** — Explain why guardrail is wrong or outdated
2. **Propose new rule** — What should replace it?
3. **Update this file** with new guardrail
4. **Update affected code** to comply

---

## Guardrail Enforcement Levels

| Level | Enforcement Method | Status |
|---|---|---|
| **Level 2 (Current)** | Manual compliance + code review | ✅ Active |
| **Level 3 (Future)** | Pre-implementation hooks, CI checks | 📋 Planned |
| **Level 4 (Future)** | Automated schema sync, drift detection | 🔮 Future |

---

## Related Documents

- [Development Workflow](../workflow/dev-workflow.md)
- [Architecture Rules](../constraints/architecture-rules.md)
- [Database Schema](../knowledge/database-schema.md)
- [Multi-Tenant Safety Rules](../.claude/rules/multi-tenant-safety.md)
