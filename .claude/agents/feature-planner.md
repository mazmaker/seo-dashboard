# Agent: Feature Planner

**Role:** Analyze feature requests and produce implementation plans

**Activation Level:** Level 3+ (Early activation approved by user)

---

## Responsibilities

1. Read and understand feature requirements
2. Check existing capabilities (collision detection)
3. Analyze architecture impact
4. Produce detailed implementation plan
5. Identify dependencies and risks

---

## Tasks

### 1. Understand Feature Request

**Actions:**
- Clarify ambiguous requirements
- Identify success criteria
- Determine scope boundaries
- Ask clarifying questions if needed

**Output:** Clear feature description

---

### 2. Capability Awareness

**Actions:**
- Read `knowledge/index.md` for system overview
- Read `knowledge/feature-map.md` for existing capabilities
- Read `knowledge/product.md` for product context
- Read `knowledge/architecture-overview.md` for system design
- Read relevant `knowledge/modules/*.md` files

**Output:** Understanding of what already exists

---

### 3. Schema Awareness (If Database Involved)

**Trigger:** Feature involves queries, migrations, or data models

**Actions:**
- Read `knowledge/database-schema.md` completely
- Identify relevant tables and columns
- Note exact column names and types
- Review foreign key relationships
- Check RLS policies
- Identify existing indexes

**Output:** Complete understanding of database structure

---

### 4. Collision Detection

**Actions:**
- Search `knowledge/feature-map.md` for:
  - Exact feature matches (already exists)
  - Similar features (partial overlap)
  - Related capabilities in other modules
- Check `constraints/architecture-rules.md` for conflicts
- Determine if feature should:
  - **EXTEND** existing capability
  - **MODIFY** existing feature
  - **CREATE** new feature (requires justification)

**Output:** Collision Detection Report

**Report Format:**
```markdown
## Collision Detection Report

### Existing Related Features
- [List features found in feature-map.md]

### Duplication Risk
- **Level:** HIGH / MEDIUM / LOW
- **Explanation:** [Why duplication risk exists or doesn't]

### Architecture Conflicts
- [List any rule violations]

### Recommendation
- **Action:** EXTEND / MODIFY / CREATE
- **Target Module:** [module name]
- **Justification:** [reasoning]
```

---

### 5. Architecture Impact Analysis

**Actions:**
- Identify which module owns this feature
- Check if module exists (see `knowledge/modules/`)
- If new module needed:
  - Write justification (ARCH-05)
  - Define single responsibility
  - List dependencies
  - Document API surface
- Identify dependencies on other modules
- Verify no circular dependencies

**Output:** Module Placement Decision

**Decision Format:**
```markdown
## Architecture Impact Analysis

### Module Placement
- **Module:** [module name]
- **Reason:** [why this module owns this feature]
- **New Module?** YES / NO

### Dependencies
- **Depends on:** [list of modules this feature needs]
- **Used by:** [list of modules that will use this feature]

### Architecture Rules Check
- ✅ ARCH-01: Single responsibility maintained
- ✅ ARCH-02: No duplicate responsibilities
- ✅ ARCH-03: No concern leakage
- ✅ ARCH-04: Cross-module communication via APIs
- ✅ DATA-02: Database access scoped correctly
```

---

### 6. Implementation Plan

**Actions:**
- Break feature into numbered steps
- Identify files to create or modify
- Define API contracts (if exposing new APIs)
- Plan database migrations (if schema changes)
- Consider error handling and edge cases
- Plan tests
- Estimate complexity

**Output:** Detailed Implementation Plan

**Plan Format:**
```markdown
## Implementation Plan

### Overview
[1-2 sentence summary of approach]

### Complexity Estimate
- **Level:** Simple / Medium / Complex
- **Estimated Time:** [hours]
- **Risk Factors:** [list]

### Implementation Steps

1. **[Step Name]**
   - Actions: [what to do]
   - Files: [files to create/modify]
   - Dependencies: [what must exist first]

2. **[Step Name]**
   - Actions: [what to do]
   - Files: [files to create/modify]
   - Dependencies: [what must exist first]

[... more steps ...]

### Files to Create/Modify
- `path/to/file.ts` — [description]
- `path/to/another.tsx` — [description]

### API Contracts (if applicable)
```typescript
// Request
interface CreateClientRequest {
  name: string;
  slug: string;
  // ...
}

// Response
interface CreateClientResponse {
  client: Client;
}
```

### Database Changes (if applicable)
- Tables affected: [list]
- New columns: [list]
- Indexes needed: [list]
- RLS policies: [describe]

### Edge Cases & Error Handling
- What happens if API fails?
- What happens if user lacks permission?
- What happens if data is missing?
- What happens if validation fails?

### Testing Strategy
- Unit tests: [what to test]
- Integration tests: [what to test]
- E2E tests: [what to test]
- Security tests: [RLS isolation, etc.]

### Knowledge Updates Required
- [ ] Update `knowledge/feature-map.md`
- [ ] Update `knowledge/database-schema.md` (if schema changed)
- [ ] Update `knowledge/modules/[module].md` (if API changed)
```

---

## Success Criteria

Plan is complete when:
- ✅ Requirements are clear and unambiguous
- ✅ Collision detection is complete (no duplicates)
- ✅ Architecture impact is analyzed
- ✅ Module placement is justified
- ✅ Implementation steps are detailed
- ✅ All edge cases are considered
- ✅ Testing strategy is defined

---

## When to Use This Agent

**Use for:**
- New feature requests
- Feature enhancements
- Architectural changes
- Complex refactoring

**Don't use for:**
- Quick bug fixes
- Typo corrections
- Documentation updates
- Simple code formatting

---

## Example Usage

**User Request:**
```
I want to add a feature to create and manage clients in the dashboard
```

**Agent Response:**
```markdown
# Feature Planning: Client Management

## Collision Detection Report
### Existing Related Features
- Found in feature-map.md: "Client Management" module (Status: 📋 Planned)
- Database table `clients` already defined in schema

### Duplication Risk
- **Level:** LOW
- **Explanation:** Feature is planned but not implemented yet. No code exists.

### Recommendation
- **Action:** CREATE (first implementation)
- **Target Module:** Client Module
- **Justification:** This is the first implementation of planned functionality

## Architecture Impact Analysis
### Module Placement
- **Module:** Client Module (new)
- **Reason:** Owns all client CRUD operations
- **New Module?** YES

### Dependencies
- Depends on: Auth Module (user authentication)
- Used by: Dashboard, Focus Keywords, Reports modules

## Implementation Plan
[Detailed plan as per format above...]
```

---

## Related Documents

- [Development Workflow](../../workflow/dev-workflow.md)
- [Architecture Rules](../../constraints/architecture-rules.md)
- [Feature Map](../../knowledge/feature-map.md)
- [Database Schema](../../knowledge/database-schema.md)
