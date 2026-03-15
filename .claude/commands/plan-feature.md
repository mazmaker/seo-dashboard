# Command: /plan-feature

**Purpose:** Analyze feature request and create implementation plan

**Agent:** Feature Planner

---

## Usage

```
/plan-feature <feature description>
```

**Example:**
```
/plan-feature Create client management CRUD with list, create, edit, delete
```

---

## What This Does

1. Invokes **Feature Planner Agent**
2. Runs collision detection
3. Analyzes architecture impact
4. Produces detailed implementation plan
5. Identifies risks and dependencies

---

## Output

You will receive:

```markdown
# Feature Planning Report

## Collision Detection
[Analysis of existing features]

## Architecture Impact
[Module placement and dependencies]

## Implementation Plan
[Step-by-step plan with files, APIs, tests]

## Risks & Considerations
[Potential issues to be aware of]
```

---

## Next Steps After Planning

1. **Review the plan** — Ensure it's correct
2. **Ask questions** — Clarify anything unclear
3. **Approve** — Give go-ahead to implement
4. **Implement** — Use Implementation Agent or manual coding

---

## Related Commands

- `/implement-feature` — Implement a planned feature
- `/check-architecture` — Validate architecture compliance
- `/update-knowledge` — Update knowledge files
