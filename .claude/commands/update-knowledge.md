# Command: /update-knowledge

**Purpose:** Update knowledge files after implementation

**Agent:** Knowledge Maintainer

---

## Usage

```
/update-knowledge [scope]
```

**Scope options:**
- `feature-map` — Update feature map only
- `schema` — Update database schema only
- `module:<name>` — Update module knowledge
- `all` — Update all knowledge files (default)

**Examples:**
```
/update-knowledge
/update-knowledge feature-map
/update-knowledge module:client
```

---

## What This Does

1. Invokes **Knowledge Maintainer Agent**
2. Detects changes in codebase
3. Updates relevant knowledge files
4. Records architectural decisions
5. Detects knowledge drift

---

## Knowledge Files Updated

### feature-map.md
- Add new features
- Update status (📋 → ✅)
- Include implementation locations
- Update feature count

### database-schema.md
- Add new tables/columns
- Update RLS policies
- Add indexes
- Update schema version history

### modules/*.md
- Document module responsibilities
- Update public API
- Add usage examples
- List dependencies

---

## Output

You will receive:

```markdown
# Knowledge Update Report

## Files Updated

### knowledge/feature-map.md
- ✅ Added "Client Management" module features
- ✅ Updated status: 📋 Planned → ✅ Implemented
- ✅ Added implementation locations

### knowledge/modules/client.md
- ✅ Created module knowledge file
- ✅ Documented public API
- ✅ Added usage examples

## Knowledge Drift Detected

### Undocumented Features
- Client export to CSV (found in code but not in feature-map)

### Recommended Actions
1. Add "Client export" to feature-map.md
2. Consider if this should be documented separately
```

---

## When to Use

**Required:**
- After implementing features (Step 8 of workflow)
- After creating migrations
- After architectural decisions

**Optional:**
- Weekly knowledge sync review
- When knowledge drift suspected

---

## Knowledge Drift Detection

The agent will check for:

**Undocumented Features**
- Code exists but not in feature-map.md

**Unimplemented Features**
- Marked as ✅ Implemented but no code found

**Inconsistencies**
- Status doesn't match reality
- Missing module knowledge files

---

## Preventing Drift

**Best practices:**
1. Run `/update-knowledge` immediately after implementation
2. Don't defer knowledge updates
3. Review knowledge files weekly
4. Keep feature-map.md accurate

---

## Related Commands

- `/implement-feature` — Implement first, then update knowledge
- `/check-architecture` — Validate implementation
- `/plan-feature` — Planning uses knowledge files
