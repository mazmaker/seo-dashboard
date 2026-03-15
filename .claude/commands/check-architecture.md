# Command: /check-architecture

**Purpose:** Validate code against architecture rules

**Agent:** Architecture Analyzer

---

## Usage

```
/check-architecture [scope]
```

**Scope options:**
- `all` — Check entire codebase (default)
- `module:<name>` — Check specific module
- `file:<path>` — Check specific file

**Examples:**
```
/check-architecture
/check-architecture module:client
/check-architecture file:app/api/clients/route.ts
```

---

## What This Does

1. Invokes **Architecture Analyzer Agent**
2. Validates module boundaries
3. Checks database access patterns
4. Verifies RLS policy compliance
5. Detects security issues
6. Validates cross-module communication

---

## Validation Rules

The agent checks:

### Module Boundaries
- ✅ Files in correct modules
- ❌ Concern leakage detected

### Database Access
- ✅ Tables accessed by owner modules only
- ❌ Cross-module direct queries found

### Security
- ✅ RLS policies enforced
- ✅ Ownership checks before mutations
- ❌ Service key in client code
- ❌ Hardcoded credentials

### API Patterns
- ✅ External APIs centralized in services
- ❌ Direct API calls in components

---

## Output

You will receive:

```markdown
# Architecture Validation Report

## Summary
- Files Analyzed: 45
- Violations Found: 2
- Warnings: 1

## ❌ Violations

### HIGH: No ownership check before mutation
**Location:** `app/api/clients/[id]/route.ts:23`
**Fix:** Add user ownership verification

### MEDIUM: Concern leakage
**Location:** `app/dashboard/page.tsx:45`
**Fix:** Use Client Module API instead of direct query

## ⚠️ Warnings
- Consider adding caching to reduce queries

## ✅ Passed Checks
- Module boundaries respected
- External APIs centralized
```

---

## When to Use

**Use regularly:**
- Before committing code
- After implementing features
- During code review
- When refactoring

**Frequency:**
- Every PR (automated in CI at Level 3+)
- On-demand validation

---

## Fixing Violations

For each violation:

1. **Read the rule** — Understand why it exists
2. **Review the fix** — See recommended solution
3. **Implement fix** — Update code
4. **Re-run check** — Verify violation is gone

---

## Related Commands

- `/plan-feature` — Plan with architecture in mind
- `/implement-feature` — Implement following rules
- `/update-knowledge` — Keep docs in sync
