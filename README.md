# SEO Dashboard - Multi-Client SEO Analytics Platform

Track and analyze SEO performance across multiple client websites with Google Search Console and Google Analytics 4 integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase credentials to `.env.local`

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

Go to Supabase Dashboard → SQL Editor and run migrations in order:

1. `supabase/migrations/20260315000001_create_clients_table.sql`
2. `supabase/migrations/20260315000002_create_focus_keyword_groups_table.sql`
3. `supabase/migrations/20260315000003_create_focus_keywords_table.sql`
4. `supabase/migrations/20260315000004_create_keyword_snapshots_table.sql`
5. `supabase/migrations/20260315000005_create_traffic_snapshots_table.sql`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [DEVATAR-README.md](DEVATAR-README.md) — Devatar AI development system guide
- [MASTER-PLAN.md](MASTER-PLAN.md) — Complete project roadmap and task list
- [knowledge/](knowledge/) — System knowledge and architecture
- [doc/](doc/) — Product requirements and specifications

## 🏗️ Project Structure

```
├── app/                    Next.js App Router
├── lib/                    Libraries and utilities
│   ├── supabase/          Supabase client setup
│   └── utils.ts           Common utilities
├── types/                  TypeScript types
├── supabase/              Database migrations
├── knowledge/             System knowledge files
├── .claude/               AI agents and commands
└── doc/                   Documentation
```

## 🤖 AI Agents & Commands

This project uses the Devatar Framework with AI agents for development:

**Commands:**
- `/plan-feature` — Plan a new feature
- `/implement-feature` — Implement planned feature
- `/check-architecture` — Validate architecture
- `/update-knowledge` — Update documentation

**Agents:**
- Feature Planner
- Architecture Analyzer
- Knowledge Maintainer
- Implementation Agent

See [AGENTS-AND-PLAN-SUMMARY.md](AGENTS-AND-PLAN-SUMMARY.md) for details.

## 📋 Development Phases

- ✅ **Phase 1:** Foundation (Devatar + Database)
- ✅ **Phase 2.1:** Next.js Project Setup
- 📋 **Phase 2.2:** Supabase Connection
- 📋 **Phase 2.3:** Authentication Module
- 📋 **Phase 3:** Client Management
- 📋 **Phase 4:** Dashboard & Analytics
- 📋 **Phase 5:** Focus Keywords
- 📋 **Phase 6:** Reports
- 📋 **Phase 7:** Polish & Optimization

See [MASTER-PLAN.md](MASTER-PLAN.md) for complete roadmap.

## 🔒 Security

- Multi-tenant architecture with Supabase RLS
- Row-level security policies enforced
- Users can only access their own data
- See [.claude/rules/multi-tenant-safety.md](.claude/rules/multi-tenant-safety.md)

## 📈 Features

### Current
- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Supabase client setup
- ✅ Database schema & migrations

### Planned
- 📋 Google OAuth authentication
- 📋 Multi-client management
- 📋 SEO dashboard with KPIs
- 📋 Keyword ranking analysis
- 📋 Traffic analytics
- 📋 Focus keywords tracking
- 📋 CSV report export

### Future
- 🔮 AI SEO insights
- 🔮 Automated reports
- 🔮 PDF export

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Charts:** Recharts
- **Deployment:** Vercel

## 📝 License

Private project for internal use.
