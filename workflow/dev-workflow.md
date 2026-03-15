# Development Workflow

**Last Updated:** 2026-03-15
**Purpose:** Required development lifecycle for every feature

---

## Purpose

This document defines the **mandatory workflow** for implementing features in the SEO Report Dashboard.

**Why workflow matters:**
- Prevents duplicate features
- Ensures database schema awareness
- Maintains architecture integrity
- Protects multi-tenant security

**Critical Rule:** Steps 1-5 MUST complete BEFORE Step 6 (Code Generation).

---

## The Devatar Runtime Loop

Every feature follows this cycle:

```
Understand → Plan → Execute → Verify → Learn
```

Mapped to workflow steps:
- **Understand** → Steps 1-3 (Read knowledge, detect collisions, understand schema)
- **Plan** → Steps 4-5 (Analyze architecture, create implementation plan)
- **Execute** → Step 6 (Write code)
- **Verify** → Step 7 (Architecture validation, tests)
- **Learn** → Step 8 (Update knowledge files)

---

## Standard Feature Implementation Pipeline

### Step 1: Feature Request

**Input:** User or stakeholder describes desired feature

**Actions:**
1. Clarify requirements
2. Understand expected behavior
3. Identify success criteria
4. Confirm scope (what's included, what's not)

**Output:** Clear feature description

**Time Investment:** 5-10 minutes

---

### Step 2: Capability Awareness

**Purpose:** Understand what the system already does

**Actions:**
1. Read `knowledge/index.md` for orientation
2. Read `knowledge/feature-map.md` to see all existing features
3. Read `knowledge/product.md` for product context
4. Read `knowledge/architecture-overview.md` for system design
5. Read relevant `knowledge/modules/*.md` files

**Output:** Understanding of system capabilities

**Time Investment:** 10-15 minutes (first time), 2-5 minutes (subsequent)

**Critical:**
- DO NOT skip this step
- DO NOT assume you know what exists
- The feature map is the **source of truth**

---

### Step 2b: Schema Awareness (If Database Involved)

**Trigger:** Feature involves database queries, migrations, or data models

**Actions:**
1. Read `knowledge/database-schema.md` completely
2. Identify relevant tables
3. Note exact column names and types
4. Check foreign key relationships
5. Review RLS policies
6. Understand indexes

**Output:** Exact knowledge of database structure

**Time Investment:** 5-10 minutes

**Critical Rules:**
- **NEVER** guess table or column names
- **NEVER** write database code without reading schema
- **ALWAYS** reference exact names from schema file

**Common mistakes prevented:**
- Guessing `user_id` vs `userId` vs `owner_id`
- Creating duplicate tables
- Writing queries with wrong types (`string` vs `uuid`)
- Ignoring RLS policies

---

### Step 3: Feature Collision Detection

**Purpose:** Detect duplicate features and overlapping capabilities BEFORE implementation

**Actions:**
1. Search `knowledge/feature-map.md` for:
   - Exact feature match (already exists)
   - Similar features (partial overlap)
   - Related capabilities in other modules
2. Check `constraints/architecture-rules.md` for conflicts
3. Determine if feature should:
   - **EXTEND** existing capability
   - **MODIFY** existing feature
   - **CREATE** new feature (requires justification)

**Output:** Collision detection report

**Report Format:**
```markdown
## Collision Detection Report

### Existing Related Features
- [List any related features found in feature-map.md]

### Duplication Risk
- **Level:** HIGH / MEDIUM / LOW
- **Explanation:** [Why duplication risk exists or doesn't]

### Architecture Conflicts
- [List any rule violations from architecture-rules.md]

### Recommendation
- **Action:** EXTEND / MODIFY / CREATE
- **Target Module:** [module name]
- **Justification:** [reasoning]
```

**Time Investment:** 5-10 minutes

**Critical:**
- DO NOT skip collision detection
- If duplication detected, EXTEND instead of creating new
- If unsure, ask for clarification

---

### Step 4: Architecture Impact Analysis

**Purpose:** Determine correct module placement and dependencies

**Actions:**
1. Identify which module owns this feature (check `constraints/architecture-rules.md`)
2. Check if module exists (see `knowledge/modules/`)
3. If new module needed:
   - Write justification (ARCH-05)
   - Define single responsibility
   - List dependencies
   - Document API surface
4. Identify dependencies on other modules
5. Verify no circular dependencies

**Output:** Module placement decision + dependency map

**Decision Format:**
```markdown
## Architecture Impact Analysis

### Module Placement
- **Module:** [module name]
- **Reason:** [why this module owns this feature]
- **New Module?** YES / NO

### Dependencies
- Depends on: [list of modules this feature needs]
- Used by: [list of modules that will use this feature]

### Architecture Rules Check
- ✅ ARCH-01: Single responsibility maintained
- ✅ ARCH-02: No duplicate responsibilities
- ✅ ARCH-03: No concern leakage
- ✅ ARCH-04: Cross-module communication via APIs
```

**Time Investment:** 10-15 minutes (new module), 2-5 minutes (existing module)

---

### Step 5: Implementation Plan

**Purpose:** Define HOW to build the feature before writing code

**Actions:**
1. Break feature into implementation steps
2. Identify files to create or modify
3. Define API contracts (if exposing new APIs)
4. Plan database migrations (if schema changes)
5. Consider error handling and edge cases
6. Plan tests

**Output:** Step-by-step implementation plan

**Plan Format:**
```markdown
## Implementation Plan

### Overview
[1-2 sentence summary of implementation approach]

### Steps
1. **Database Migration** (if needed)
   - Create migration for [table]
   - Add columns: [list]
   - Update RLS policies

2. **Backend Implementation**
   - Create service: `lib/services/[name].ts`
   - Create API route: `app/api/[route]/route.ts`
   - Implement business logic

3. **Frontend Implementation**
   - Create hook: `lib/modules/[module]/hooks/use[Name].ts`
   - Create component: `app/components/[Name].tsx`
   - Integrate with UI

4. **Testing**
   - Unit tests for service
   - E2E tests for user flow

### Files to Create/Modify
- `lib/services/clientService.ts` — Add new function
- `app/api/clients/route.ts` — Add new endpoint
- `knowledge/feature-map.md` — Add new feature
- `knowledge/database-schema.md` — Update if schema changed

### API Contracts
[Define request/response formats for new APIs]

### Edge Cases
- What happens if API fails?
- What happens if user lacks permission?
- What happens if data is missing?
```

**Time Investment:** 15-30 minutes

**Critical:**
- Plan BEFORE coding
- Consider all edge cases
- Document expected behavior

---

### Step 6: Code Generation

**Purpose:** Implement the feature following the plan

**Actions:**
1. Follow implementation plan step-by-step
2. Reference `knowledge/database-schema.md` for exact names
3. Follow `constraints/architecture-rules.md`
4. Write clean, readable code
5. Handle errors gracefully
6. Add comments where logic is complex

**Output:** Working code

**Time Investment:** Varies by feature complexity

**Critical Rules:**
- DO NOT deviate from plan without reason
- DO NOT skip error handling
- DO NOT bypass RLS policies
- DO NOT hardcode credentials

---

### Step 7: Validation

**Purpose:** Verify implementation is correct and follows rules

**Actions:**
1. **Functional Testing**
   - Test happy path
   - Test error cases
   - Test edge cases

2. **Architecture Validation**
   - Check code is in correct module
   - Verify no architecture rule violations
   - Check no circular dependencies

3. **Security Validation** (if database involved)
   - Test RLS policies work correctly
   - Verify user cannot access other users' data
   - Check ownership verification in mutations

4. **Performance Check**
   - Check query performance (use indexes)
   - Verify caching works (if applicable)

**Output:** Validated, working implementation

**Time Investment:** 15-30 minutes

---

### Step 8: Knowledge Update

**Purpose:** Keep system knowledge synchronized with code

**Actions:**
1. **Update feature-map.md**
   - Add new feature to correct module
   - Mark status as ✅ Implemented
   - Include file location

2. **Update database-schema.md** (if schema changed)
   - Add new tables/columns
   - Update RLS policies
   - Add indexes

3. **Update module knowledge** (if new module or significant change)
   - Create/update `knowledge/modules/[module-name].md`
   - Document responsibilities
   - Document public API

4. **Record decisions** (if architectural decision made)
   - Document why approach was chosen
   - Note any trade-offs

**Output:** Updated knowledge files

**Time Investment:** 10-20 minutes

**Critical:**
- DO NOT skip knowledge updates
- Knowledge drift = future mistakes
- Updated knowledge helps next implementation

---

## Workflow Enforcement

### Current (Level 2)
- **Manual compliance** — Developer follows workflow consciously
- **Code review** — Reviewer checks workflow was followed

### Future (Level 3+)
- **Pre-implementation hooks** — Block code generation if Steps 1-5 skipped
- **Post-implementation hooks** — Auto-update knowledge files
- **CI validation** — Automated architecture and schema checks

---

## Workflow Variations

### Quick Bug Fix (No New Features)

If fixing a bug without adding capabilities:
1. ✅ Read schema (if database involved)
2. ✅ Fix bug
3. ✅ Test fix
4. ⏭️ Skip collision detection (no new feature)
5. ⏭️ Skip knowledge update (no new capability)

### Refactoring (No New Features)

If refactoring existing code without changing behavior:
1. ✅ Document refactoring goal
2. ✅ Check architecture rules (ensure refactor improves, not breaks)
3. ✅ Implement refactor
4. ✅ Test (ensure behavior unchanged)
5. ⏭️ Skip feature map update (no new feature)
6. ✅ Update module knowledge (if module structure changed)

### Experimental/Prototype Feature

If building a prototype or spike:
1. ⏭️ Can skip full workflow during prototyping
2. ✅ MUST follow full workflow if promoting to production
3. ✅ Delete prototype code if not promoted (don't leave experimental code in codebase)

---

## Common Workflow Mistakes

### ❌ Skipping Schema Awareness

**Mistake:** Writing database code without reading `database-schema.md`

**Result:** Guessed column names, wrong types, duplicate tables

**Solution:** Always read schema file BEFORE writing database code

---

### ❌ Skipping Collision Detection

**Mistake:** Implementing feature without checking `feature-map.md`

**Result:** Duplicate features, overlapping modules (`task-service`, `task-engine`, `task-manager`)

**Solution:** Run collision detection BEFORE implementation

---

### ❌ Coding Before Planning

**Mistake:** Jump straight to code generation without Steps 1-5

**Result:** Wrong architecture, need to refactor, wasted time

**Solution:** Plan first, code second

---

### ❌ Forgetting Knowledge Updates

**Mistake:** Implement feature but don't update `feature-map.md`

**Result:** Next developer doesn't know feature exists, creates duplicate

**Solution:** Update knowledge files immediately after implementation

---

## Workflow Checklist

Use this checklist for every feature:

```markdown
- [ ] Step 1: Feature request clarified
- [ ] Step 2: Read knowledge files (index, feature-map, product, architecture)
- [ ] Step 2b: Read database-schema.md (if database involved)
- [ ] Step 3: Run collision detection
- [ ] Step 4: Analyze architecture impact
- [ ] Step 5: Create implementation plan
- [ ] Step 6: Implement code following plan
- [ ] Step 7: Validate (functional, architecture, security, performance)
- [ ] Step 8: Update knowledge files
```

**Time to complete full workflow:** 1-2 hours for medium feature (including implementation)

**Time saved by preventing mistakes:** Hours to days

---

## Related Documents

- [Architecture Rules](../constraints/architecture-rules.md)
- [Safety Guardrails](../safety/safety-guardrails.md)
- [Feature Map](../knowledge/feature-map.md)
- [Database Schema](../knowledge/database-schema.md)
- [Devatar Framework](../doc/The-Devatar-Framework.md)
