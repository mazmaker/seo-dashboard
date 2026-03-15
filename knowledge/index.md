# System Knowledge Index

**Last Updated:** 2026-03-15
**Project:** SEO Report Dashboard (Multi-Client SEO Analytics Platform)
**Devatar Level:** 2 (Growing System)

---

## Purpose

This directory contains the **authoritative system knowledge** for the SEO Report Dashboard.

**CRITICAL:** AI must read these files **before any implementation work**.

---

## Essential Files

### 📋 Product & Architecture
- **[product.md](product.md)** → Product goals, features, and user context
- **[architecture-overview.md](architecture-overview.md)** → System architecture and tech stack
- **[domain-model.md](domain-model.md)** → Core entities and relationships

### 🗺️ Capability Awareness
- **[feature-map.md](feature-map.md)** → All existing system capabilities (prevents duplicate features)
- **[database-schema.md](database-schema.md)** → Live database schema (tables, columns, types, RLS policies)

### 📦 Module Knowledge
- **[modules/](modules/)** → Per-module implementation details (populated as modules are created)

---

## How to Use This Knowledge

### Before Implementing ANY Feature

1. **Read this file** (index.md) to understand the knowledge structure
2. **Read [product.md](product.md)** to understand product goals
3. **Read [architecture-overview.md](architecture-overview.md)** to understand system design
4. **Read [feature-map.md](feature-map.md)** to check if the feature already exists
5. **Read [database-schema.md](database-schema.md)** if the feature involves database operations
6. **Read relevant [modules/](modules/)** files to understand existing module responsibilities

### After Implementing a Feature

1. **Update [feature-map.md](feature-map.md)** with the new capability
2. **Update relevant [modules/](modules/)** files with implementation details
3. **Update [database-schema.md](database-schema.md)** if schema changed

---

## Critical Rules

### Database Schema Awareness

**NEVER** write database code without reading `database-schema.md` first.

AI commonly makes these mistakes:
- Guessing column names (`user_id` vs `userId` vs `owner_id`)
- Creating duplicate tables
- Writing queries with wrong types (`string` vs `uuid`)
- Missing existing indexes, constraints, and RLS policies

**Solution:** Always reference exact table and column names from `database-schema.md`.

### Feature Collision Prevention

**NEVER** implement a feature without checking `feature-map.md` first.

Without this check, AI tends to create:
- Duplicate features with different names
- Redundant modules (`task-service`, `task-engine`, `task-manager`)
- Overlapping capabilities across modules

**Solution:** Run collision detection against `feature-map.md` before implementation.

### Multi-Tenant Security

This is a **multi-tenant system** with Supabase Row Level Security (RLS).

**Every database query** must respect RLS policies:
- Users can **only** access clients they own
- Policy: `client.user_id = auth.uid()`

**One mistake = data breach.**

---

## Knowledge Maintenance

### Current State
- **Manual updates** — AI must manually update knowledge files after implementation
- **No automation** — No sync scripts (activated at Level 4)

### Future (Level 4+)
- Automated knowledge-code sync detection
- Schema auto-generation from Supabase
- Feature detection scripts

---

## Knowledge Structure Philosophy

> **Knowledge files represent live system state — not static documentation.**

They must:
- Stay synchronized with code, features, and architecture
- Be structured and versioned
- Be the **single source of truth** for AI

---

## Related Documentation

### Source Documents (Human-Authored)
- [../doc/PRD.md](../doc/PRD.md) → Product Requirements Document
- [../doc/ARCHITECTURE.md](../doc/ARCHITECTURE.md) → System Architecture
- [../doc/DATA-MODEL.md](../doc/DATA-MODEL.md) → Database Design
- [../doc/AI-SEO-ENGINE.md](../doc/AI-SEO-ENGINE.md) → Future AI Analysis Engine

### Governance Documents
- [../constraints/architecture-rules.md](../constraints/architecture-rules.md) → Architecture rules
- [../workflow/dev-workflow.md](../workflow/dev-workflow.md) → Development lifecycle
- [../safety/safety-guardrails.md](../safety/safety-guardrails.md) → AI safety rules

---

## Questions?

If you encounter outdated information or missing knowledge, flag it immediately and update the relevant file.

**The knowledge system is only as good as its accuracy.**
