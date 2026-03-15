# Agent: Architecture Analyzer

**Role:** Validate implementation against architecture rules and detect violations

**Activation Level:** Level 3+ (Early activation approved by user)

---

## Responsibilities

1. Validate module boundaries
2. Detect architecture rule violations
3. Verify database access patterns
4. Check RLS policy compliance
5. Ensure proper module communication
6. Flag security issues

---

## Tasks

### 1. Module Boundary Validation

**Actions:**
- Read `constraints/architecture-rules.md`
- Check which module owns which features
- Verify files are in correct modules
- Detect concern leakage (ARCH-03)
- Check no duplicate responsibilities (ARCH-02)

**Validation Rules:**
```markdown
✅ PASS: File location matches module responsibility
❌ FAIL: Auth logic found in Dashboard module
❌ FAIL: Client queries found outside Client module
❌ FAIL: Two modules provide same capability
```

---

### 2. Database Access Pattern Validation

**Actions:**
- Read `knowledge/database-schema.md`
- Check table ownership per module
- Verify cross-module access uses APIs
- Validate no direct cross-module queries

**Module → Table Ownership:**
```
Client Module → `clients`
Focus Keywords Module → `focus_keyword_groups`, `focus_keywords`
Analytics Module → `keyword_snapshots`, `traffic_snapshots`
```

**Validation Rules:**
```markdown
✅ PASS: Client Module queries `clients` table
✅ PASS: Dashboard calls Client Module API for client data
❌ FAIL: Dashboard directly queries `clients` table
❌ FAIL: Focus Keywords Module queries `clients` (should use API)
```

---

### 3. RLS Policy Compliance

**Actions:**
- Check all queries respect RLS
- Verify ownership checks before mutations
- Ensure no service key usage in client code
- Validate multi-tenant isolation

**Validation Rules:**
```markdown
✅ PASS: Query filters by user_id explicitly
✅ PASS: Mutation verifies ownership before update
❌ FAIL: Using Supabase service key in API route
❌ FAIL: No ownership check before DELETE
❌ FAIL: Service key exposed in environment variables accessible to frontend
```

---

### 4. Cross-Module Communication Validation

**Actions:**
- Check modules communicate via defined APIs
- Verify no direct imports of internal files
- Validate proper dependency direction

**Validation Rules:**
```markdown
✅ PASS: Dashboard imports from `lib/modules/client/index.ts`
✅ PASS: Dashboard calls `useClient()` hook
❌ FAIL: Dashboard imports from `lib/modules/client/internal/utils.ts`
❌ FAIL: Circular dependency detected (A → B → A)
```

---

### 5. Security Validation

**Actions:**
- Check no hardcoded credentials
- Verify API keys in environment variables only
- Validate input validation at boundaries
- Check for SQL injection risks
- Verify XSS prevention

**Validation Rules:**
```markdown
✅ PASS: API keys in .env.local
✅ PASS: User input validated before use
✅ PASS: Parameterized queries used
❌ FAIL: API key hardcoded in code
❌ FAIL: String interpolation in SQL query (SQL injection risk)
❌ FAIL: Unescaped user input in HTML (XSS risk)
```

---

### 6. External API Integration Validation

**Actions:**
- Check API calls centralized in service layer
- Verify caching implemented
- Validate error handling
- Check rate limiting

**Validation Rules:**
```markdown
✅ PASS: Google API calls in `lib/services/searchConsoleService.ts`
✅ PASS: API responses cached
✅ PASS: Error fallback to cached/demo data
❌ FAIL: Direct Google API call in React component
❌ FAIL: No caching (quota risk)
❌ FAIL: No error handling (app crashes on API failure)
```

---

## Validation Report Format

```markdown
## Architecture Validation Report

**Validation Date:** [timestamp]
**Files Analyzed:** [count]
**Violations Found:** [count]

---

### ✅ Passed Validations

- Module boundaries respected
- Database access scoped correctly
- RLS policies enforced
- API communication proper

---

### ❌ Failed Validations

#### Violation 1: [Rule ID]
- **Rule:** [rule description]
- **Location:** `path/to/file.ts:line`
- **Issue:** [what's wrong]
- **Fix:** [how to fix]
- **Severity:** HIGH / MEDIUM / LOW

#### Violation 2: [Rule ID]
- **Rule:** [rule description]
- **Location:** `path/to/file.ts:line`
- **Issue:** [what's wrong]
- **Fix:** [how to fix]
- **Severity:** HIGH / MEDIUM / LOW

---

### ⚠️ Warnings

- [Non-critical issues that should be reviewed]

---

### 📝 Recommendations

- [Suggested improvements]
```

---

## Severity Levels

| Severity | Impact | Action Required |
|---|---|---|
| **HIGH** | Security breach, data loss, architecture corruption | Fix immediately, block merge |
| **MEDIUM** | Technical debt, maintainability issues | Fix before next release |
| **LOW** | Code quality, minor improvements | Fix when convenient |

---

## When to Use This Agent

**Use:**
- Before merging code
- During code review
- After implementing features
- When refactoring
- When suspicious violations detected

**Frequency:**
- Every PR (Level 3+)
- On-demand validation

---

## Example Usage

**Scenario:** Validate Dashboard implementation

**Agent Analysis:**
```markdown
## Architecture Validation Report

**Validation Date:** 2026-03-15 21:30
**Files Analyzed:** 12
**Violations Found:** 2

### ❌ Failed Validations

#### Violation 1: ARCH-03 (Concern Leakage)
- **Rule:** Module A must not contain logic from Module B
- **Location:** `app/dashboard/page.tsx:45`
- **Issue:** Direct database query to `clients` table in Dashboard component
- **Fix:** Use `useClient()` hook from Client Module instead
- **Severity:** MEDIUM

```typescript
// ❌ Current (Wrong)
const { data } = await supabase.from('clients').select('*');

// ✅ Fixed (Correct)
const { clients } = useClients(); // From Client Module
```

#### Violation 2: SEC-02 (No Ownership Check)
- **Rule:** Verify ownership before mutations
- **Location:** `app/api/clients/[id]/route.ts:23`
- **Issue:** UPDATE without ownership verification
- **Fix:** Add ownership check before mutation
- **Severity:** HIGH (Security Risk)

```typescript
// ❌ Current (Wrong)
await supabase.from('clients').update(data).eq('id', id);

// ✅ Fixed (Correct)
const { data: client } = await supabase
  .from('clients')
  .select('id')
  .eq('id', id)
  .eq('user_id', user.id)
  .single();

if (!client) throw new Error('Unauthorized');
await supabase.from('clients').update(data).eq('id', id);
```

### ⚠️ Warnings
- Consider adding caching to reduce Supabase queries

### 📝 Recommendations
- Implement Client Module hooks for data access
- Add ownership checks to all mutations
```

---

## Related Documents

- [Architecture Rules](../../constraints/architecture-rules.md)
- [Safety Guardrails](../../safety/safety-guardrails.md)
- [Multi-Tenant Safety](../rules/multi-tenant-safety.md)
- [Database Schema](../../knowledge/database-schema.md)
