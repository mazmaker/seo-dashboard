# Devatar AI Development System

**Version:** 1.0
**Activation Level:** Level 2 (Growing System)
**Last Updated:** 2026-03-15

---

## System Overview

This repository uses the **Devatar Framework** — an adaptive AI engineering system that enforces structured development workflows, prevents architectural drift, and protects multi-tenant security.

**Devatar** = **Dev** + **Avatar** — *"See the system before you code"*

Like Jake Sully learning Pandora before his mission, AI must fully understand the system (features, architecture, schema, rules) before generating a single line of code.

---

## Current Activation: Level 2

**Project Metrics:**
- **Feature Count:** ~8 features
- **Module Count:** ~7 modules
- **Engineer Count:** 1
- **Architecture Complexity:** MEDIUM-HIGH (Multi-tenant RLS, external APIs)

**Activation Level:** Level 2 (Growing System)

**Why Level 2?**
Even though numeric metrics suggest Level 0-1, the architecture complexity (multi-tenant RLS, external API dependencies, pre-defined database schema) triggered an override to Level 2 for earlier enforcement of architecture rules and safety guardrails.

---

## System Structure

```
SEO Dashboard/
│
├── doc/                          ← 🟢 SOURCE OF TRUTH (human-authored)
│   ├── PRD.md                        Product requirements
│   ├── ARCHITECTURE.md               System architecture
│   ├── DATA-MODEL.md                 Database design
│   ├── AI-SEO-ENGINE.md              Future AI features
│   └── The-Devatar-Framework.md      Framework specification
│
├── knowledge/                    ← ✅ SYSTEM STATE (AI reads before coding)
│   ├── index.md                      AI entry point
│   ├── product.md                    Product context
│   ├── architecture-overview.md      Architecture summary
│   ├── domain-model.md               Core entities & relationships
│   ├── feature-map.md                All system capabilities
│   ├── database-schema.md            Database structure (tables, RLS, indexes)
│   └── modules/                      Per-module knowledge (created as needed)
│
├── constraints/                  ← ✅ ARCHITECTURE RULES (enforceable)
│   └── architecture-rules.md         Module boundaries, data access, API patterns
│
├── workflow/                     ← ✅ DEVELOPMENT LIFECYCLE (required process)
│   └── dev-workflow.md               8-step workflow (Understand → Plan → Execute → Verify → Learn)
│
├── safety/                       ← ✅ AI SAFETY GUARDRAILS (behavioral constraints)
│   └── safety-guardrails.md          Mandatory safety rules
│
├── .claude/                      ← ✅ RUNTIME RULES (loaded into Claude Code)
│   └── rules/
│       ├── architecture-enforcement.md   Quick reference for workflow
│       ├── schema-awareness.md           Database code safety
│       └── multi-tenant-safety.md        RLS and security rules
│
└── DEVATAR-README.md             ← This file
```

---

## The Devatar Runtime Loop

Every feature follows this cycle:

```
Understand → Plan → Execute → Verify → Learn
```

### Understand
- Read `knowledge/index.md` for orientation
- Read `knowledge/feature-map.md` to see existing features
- Read `knowledge/database-schema.md` if feature involves database
- Read `knowledge/architecture-overview.md` for system design

### Plan
- Run collision detection (search feature-map for duplicates)
- Check `constraints/architecture-rules.md` for violations
- Analyze architecture impact (which module owns this?)
- Create implementation plan

### Execute
- Write code following the plan
- Follow module boundaries
- Use exact table/column names from schema
- Handle errors gracefully

### Verify
- Test functionality (happy path + edge cases)
- Validate architecture (no rule violations)
- Test multi-tenant security (RLS isolation)
- Check performance (indexes, caching)

### Learn
- Update `knowledge/feature-map.md` with new feature
- Update `knowledge/database-schema.md` if schema changed
- Update module knowledge files if API changed
- Document decisions

---

## Quick Start for Developers

### Before Implementing ANY Feature

1. ✅ **Read** `knowledge/index.md` — Understand the knowledge system
2. ✅ **Read** `knowledge/feature-map.md` — Check if feature already exists
3. ✅ **Read** `knowledge/database-schema.md` — If database involved
4. ✅ **Read** `workflow/dev-workflow.md` — Understand required process
5. ✅ **Follow** the 8-step workflow

### Development Workflow (Quick Reference)

```markdown
Step 1: Feature Request           → Clarify requirements
Step 2: Capability Awareness       → Read knowledge files
Step 2b: Schema Awareness          → Read database schema (if DB involved)
Step 3: Collision Detection        → Check for duplicate features
Step 4: Architecture Analysis      → Determine module placement
Step 5: Implementation Plan        → Define approach before coding
Step 6: Code Generation            → Write code following plan
Step 7: Validation                 → Test + architecture check
Step 8: Knowledge Update           → Update feature-map, schema, modules
```

**Time Investment:** 1-2 hours for medium feature (including implementation)
**Time Saved:** Hours to days (by preventing mistakes)

---

## Key Files to Know

### For AI/Developers

| File | Purpose | When to Read |
|---|---|---|
| `knowledge/index.md` | AI entry point | Before any work |
| `knowledge/feature-map.md` | All existing features | Before implementing feature |
| `knowledge/database-schema.md` | Database structure | Before writing database code |
| `knowledge/architecture-overview.md` | System design | Before architectural decisions |
| `constraints/architecture-rules.md` | Enforceable rules | Before module/API design |
| `workflow/dev-workflow.md` | Required process | Before starting feature |
| `safety/safety-guardrails.md` | Safety constraints | Review periodically |

### For Project Owners

| File | Purpose | When to Update |
|---|---|---|
| `doc/PRD.md` | Product requirements | When requirements change |
| `doc/ARCHITECTURE.md` | System architecture | When architecture evolves |
| `doc/DATA-MODEL.md` | Database design | When schema design changes |
| `DEVATAR-README.md` | Devatar documentation | When activation level changes |

---

## Components Activated (Level 2)

### ✅ knowledge/ — System State Awareness
**Why:** Project has no code yet — perfect time to establish knowledge foundation.

**Prevents:**
- Building features that already exist
- Guessing database table/column names
- Creating redundant modules

### ✅ constraints/ — Architecture Rules
**Why:** Multi-tenant system requires strict module isolation and RLS enforcement.

**Prevents:**
- Architecture drift
- Module boundary violations
- RLS policy bypasses

### ✅ workflow/ — Development Lifecycle
**Why:** Database schema is pre-defined — must be referenced for every query/migration.

**Prevents:**
- Implementing duplicate features
- Writing queries with guessed names
- Skipping security checks

### ✅ safety/ — AI Behavioral Constraints
**Why:** Multi-tenant RLS is security-critical — one mistake = data breach.

**Prevents:**
- Creating modules without justification
- Bypassing collision detection
- Hardcoding credentials

### ✅ .claude/rules/ — Runtime Enforcement
**Why:** Provides consistent behavior across all Claude Code sessions.

**Prevents:**
- Inconsistent development patterns
- Forgetting to check schema
- Skipping workflow steps

---

## Components Deferred (Future Levels)

### ⏸️ Level 3: Scaling Team (When engineers > 3)

**Activate:**
```
.claude/
  agents/
    feature-planner.md
    architecture-analyzer.md
    knowledge-maintainer.md
  commands/
    plan-feature.md
    check-feature.md
    implement-feature.md
  hooks/
    pre-implementation-check.md
    post-implementation-update.md

.github/workflows/
  devatar-ci.yml                    ← CI checks for architecture violations
```

**Trigger:**
- Features exceed 20
- Modules exceed 15
- Engineers exceed 3
- First architecture violation occurs

**Why Deferred:**
- Current scale (1 engineer, <10 features) doesn't warrant automation overhead
- Manual workflow compliance is manageable

**Risk:** MEDIUM — Relies on manual compliance, but mitigated by documentation

---

### ⏸️ Level 4: Large System (When features > 50)

**Activate:**
```
automation/
  architecture-check/
    validate-boundaries.ts          ← Detect cross-module violations
  knowledge-sync/
    detect-drift.ts                 ← Compare feature-map vs actual code
  schema-sync/
    generate-schema.ts              ← Auto-generate from Supabase
  feature-detection/
    find-undocumented.ts            ← Detect features missing from feature-map
```

**Trigger:**
- Features exceed 50
- Modules exceed 25
- Engineers exceed 5
- Knowledge drift detected
- Schema changes frequently

**Why Deferred:**
- No code exists yet to validate
- Manual schema sync is manageable for 1 developer
- Automation overhead not justified at current scale

**Risk:** MEDIUM — Manual schema sync required, but mitigated by database-schema.md documentation

---

### ⏸️ Level 5: Platform Scale (When features > 100)

**Activate:**
```
metrics/
  ai-dev-metrics.md                 ← Track collision checks, violations, accuracy

.claude/
  skills/                           ← Reusable capabilities
  agents/ (full multi-agent)        ← Orchestrated agent system
```

**Trigger:**
- Features exceed 100
- Modules exceed 40
- Engineers exceed 10
- Need to measure AI code quality

**Why Deferred:**
- Platform scale not relevant yet
- Metrics infrastructure overhead too high

**Risk:** LOW — Not critical for early-stage development

---

## Future Expansion Triggers

### Level-Up to Level 3

**Trigger:** ANY of these conditions:
- ✅ Features exceed 20 (currently ~8)
- ✅ Modules exceed 15 (currently ~7)
- ✅ Engineers exceed 3 (currently 1)
- ✅ First architecture violation occurs
- ✅ Knowledge drift detected (feature-map vs actual code)

**Actions:**
1. Activate `.claude/agents/`, `.claude/commands/`, `.claude/hooks/`
2. Set up CI pipeline (`.github/workflows/devatar-ci.yml`)
3. Implement pre-implementation hooks (block code generation if workflow skipped)
4. Implement post-implementation hooks (auto-update knowledge files)
5. Update this README with new activation level

---

### Level-Up to Level 4

**Trigger:** ANY of these conditions:
- ✅ Features exceed 50
- ✅ Modules exceed 25
- ✅ Engineers exceed 5
- ✅ Manual knowledge updates become bottleneck
- ✅ Schema changes frequently (>2x per week)

**Actions:**
1. Implement `automation/schema-sync/` (auto-generate from Supabase)
2. Implement `automation/knowledge-sync/` (detect drift)
3. Implement `automation/architecture-check/` (validate boundaries)
4. Set up Supabase connection for schema extraction
5. Integrate automation into CI pipeline
6. Update this README with new activation level

---

## Critical Security Notes

### Multi-Tenant RLS

**Foundation:** `clients.user_id = auth.uid()`

**Critical Rules:**
1. ALL queries MUST respect RLS policies
2. Verify ownership before UPDATE/DELETE operations
3. NEVER use Supabase service key in client-facing code
4. Test multi-tenant isolation (User A cannot access User B's data)

**One RLS mistake = data breach.**

See `.claude/rules/multi-tenant-safety.md` for details.

---

### Database Schema Awareness

**NEVER write database code without reading `knowledge/database-schema.md` first.**

**Common Mistakes:**
- Guessing column names (`user_id` vs `userId` vs `owner_id`)
- Using wrong types (`string` vs `uuid`)
- Creating duplicate tables
- Missing foreign key constraints
- Ignoring RLS policies

See `.claude/rules/schema-awareness.md` for details.

---

## FAQ

### Q: Do I have to follow the workflow for every feature?
**A:** Yes. Steps 1-5 (Understand → Plan) MUST complete before Step 6 (Code Generation).

**Exception:** Quick bug fixes without new features can skip collision detection.

---

### Q: Can I skip reading the schema file?
**A:** No. NEVER write database code without reading `knowledge/database-schema.md`.

**Why:** Guessing table/column names leads to errors, duplicate tables, and RLS violations.

---

### Q: What if I find the feature already exists?
**A:** EXTEND the existing feature instead of creating a new one.

**Process:**
1. Identify the module that owns the feature
2. Read `knowledge/modules/[module-name].md` (if exists)
3. Extend the existing implementation
4. Update feature-map with enhancement details

---

### Q: What if I need to create a new module?
**A:** New modules require written justification (ARCH-05).

**Required:**
1. Create `knowledge/modules/[module-name].md`
2. Document single responsibility
3. List dependencies
4. Define public API
5. Justify why existing modules cannot handle this

---

### Q: How do I know when to level up?
**A:** Check "Future Expansion Triggers" section above.

**Level 3 Triggers:**
- Features > 20, Modules > 15, Engineers > 3, or first architecture violation

**Level 4 Triggers:**
- Features > 50, Modules > 25, Engineers > 5, or manual updates become bottleneck

---

### Q: What if knowledge files are outdated?
**A:** Update them immediately.

**Process:**
1. Flag the outdated information
2. Update the knowledge file
3. Commit the update
4. Notify team (if multi-person)

**Knowledge accuracy is critical.** Outdated knowledge leads to duplicate features and architectural mistakes.

---

## Support & Feedback

### Questions or Issues?

1. Read the relevant documentation:
   - `knowledge/index.md` — System overview
   - `workflow/dev-workflow.md` — Development process
   - `constraints/architecture-rules.md` — Architecture rules
   - `.claude/rules/` — Runtime rules

2. Check if knowledge files are current

3. If issue persists, update documentation or flag for review

### Reporting Issues

Create an issue with:
- Which document is unclear or incorrect
- What you expected vs what you found
- Suggested improvement

---

## Version History

| Version | Date | Changes | Activation Level |
|---|---|---|---|
| 1.0 | 2026-03-15 | Initial Devatar system bootstrap | Level 2 |

---

## Related Documents

### Source Documents (Human-Authored)
- [doc/PRD.md](doc/PRD.md) — Product Requirements
- [doc/ARCHITECTURE.md](doc/ARCHITECTURE.md) — System Architecture
- [doc/DATA-MODEL.md](doc/DATA-MODEL.md) — Database Design
- [doc/AI-SEO-ENGINE.md](doc/AI-SEO-ENGINE.md) — Future AI Features
- [doc/The-Devatar-Framework.md](doc/The-Devatar-Framework.md) — Framework Specification

### Knowledge Files
- [knowledge/index.md](knowledge/index.md) — AI Entry Point
- [knowledge/feature-map.md](knowledge/feature-map.md) — All System Capabilities
- [knowledge/database-schema.md](knowledge/database-schema.md) — Database Structure

### Governance Files
- [constraints/architecture-rules.md](constraints/architecture-rules.md) — Architecture Constraints
- [workflow/dev-workflow.md](workflow/dev-workflow.md) — Development Lifecycle
- [safety/safety-guardrails.md](safety/safety-guardrails.md) — AI Safety Rules

### Runtime Rules
- [.claude/rules/architecture-enforcement.md](.claude/rules/architecture-enforcement.md) — Quick Reference
- [.claude/rules/schema-awareness.md](.claude/rules/schema-awareness.md) — Database Safety
- [.claude/rules/multi-tenant-safety.md](.claude/rules/multi-tenant-safety.md) — RLS Security

---

**Remember:** *The framework grows with the project — never ahead of it, never behind it.*
