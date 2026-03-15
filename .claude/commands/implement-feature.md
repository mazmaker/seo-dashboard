# Command: /implement-feature

**Purpose:** Implement a feature following approved plan

**Agent:** Implementation Agent

---

## Usage

```
/implement-feature <feature name or plan reference>
```

**Example:**
```
/implement-feature Client Management CRUD
```

---

## Prerequisites

Before running this command:

1. ✅ Feature has been planned (`/plan-feature`)
2. ✅ Plan has been approved
3. ✅ Architecture impact understood
4. ✅ Database schema read (if DB involved)

---

## What This Does

1. Invokes **Implementation Agent**
2. Follows implementation plan step-by-step
3. Writes code according to architecture rules
4. Implements error handling and validation
5. Tests functionality
6. Updates knowledge files

---

## Implementation Steps

The agent will:

### 1. Understand Phase
- Read implementation plan
- Verify all dependencies exist
- Confirm database schema (if needed)

### 2. Execute Phase
- Create files in correct locations
- Write clean, typed code
- Implement proper error handling
- Follow security best practices

### 3. Verify Phase
- Test happy path
- Test error cases
- Validate architecture compliance
- Check RLS policies (if DB involved)

### 4. Learn Phase
- Update `knowledge/feature-map.md`
- Update `knowledge/database-schema.md` (if changed)
- Update module knowledge files

---

## Output

You will receive:

```markdown
# Implementation Complete

## Files Created/Modified
[List of files with descriptions]

## Testing Results
[Validation outcomes]

## Knowledge Updates
[Which files were updated]

## Next Steps
[What to do next]
```

---

## After Implementation

1. **Review code** — Check quality and correctness
2. **Test manually** — Try the feature in browser
3. **Run tests** — Execute test suite
4. **Commit** — Git commit with descriptive message

---

## Related Commands

- `/plan-feature` — Plan before implementing
- `/check-architecture` — Validate after implementation
- `/update-knowledge` — Update docs if missed
