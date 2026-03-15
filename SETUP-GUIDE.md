# 🚀 SEO Dashboard - Setup Guide

**Time Required:** 10-15 minutes
**Prerequisites:** Node.js 18+, Web browser

---

## ✅ Phase 2.2: Supabase Connection Setup

Follow these steps **exactly in order**.

---

## Step 1: Install Dependencies (2 minutes)

### Open Terminal

**Mac:**
- Press `Cmd + Space`
- Type `Terminal`
- Press Enter

**Windows:**
- Press `Win + R`
- Type `cmd`
- Press Enter

### Run Commands

```bash
# Navigate to project
cd "/Users/baituaykitty/Desktop/MAZ/SEO Dashboard"

# Install dependencies
npm install
```

### Expected Output

```
added 234 packages in 45s

found 0 vulnerabilities
```

### ✅ Success Check

```bash
# Should show node_modules folder
ls -la | grep node_modules

# Should show installed packages
npm list --depth=0 | grep next
```

**Expected:** See `next@14.1.0`

### ❌ If Error Occurs

**Error: "npm not found"**
```bash
# Install Node.js from https://nodejs.org
# Download LTS version
# Restart Terminal after install
```

**Error: "EACCES permission denied"**
```bash
# Fix permissions
sudo chown -R $USER /usr/local/lib/node_modules
```

---

## Step 2: Create Supabase Project (5 minutes)

### 2.1 Sign Up / Login

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with GitHub (recommended) or Email

### 2.2 Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `seo-dashboard`
   - **Database Password:** Click "Generate a password" (SAVE THIS!)
   - **Region:** Select closest to you (e.g., Southeast Asia)
3. Click **"Create new project"**

### 2.3 Wait for Provisioning

⏱️ **Wait 2-3 minutes** for database setup

You'll see: "Setting up project..." → "Project is ready!"

### 2.4 Get Project Credentials

1. Go to **Settings** (gear icon) → **API**
2. Find these values:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
```

**COPY BOTH** - you'll need them next!

---

## Step 3: Configure Environment (1 minute)

### 3.1 Copy Template

```bash
# In Terminal
cd "/Users/baituaykitty/Desktop/MAZ/SEO Dashboard"
cp .env.local.example .env.local
```

### 3.2 Edit .env.local

**Open in VS Code (or any editor):**
```bash
code .env.local
```

**Or open manually:**
- Right-click `.env.local`
- Open with TextEdit/Notepad

### 3.3 Paste Your Credentials

Replace with YOUR values from Step 2.4:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save the file** (Cmd+S / Ctrl+S)

### ✅ Verify

```bash
# Should show your URL (not "your-project-url-here")
cat .env.local | grep SUPABASE_URL
```

---

## Step 4: Run Database Migrations (8 minutes)

### 4.1 Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click **"SQL Editor"** in left sidebar
3. Click **"New Query"**

### 4.2 Migration 1: clients table

1. Open file: `supabase/migrations/20260315000001_create_clients_table.sql`
2. **Copy ALL content** (Cmd+A / Ctrl+A → Cmd+C / Ctrl+C)
3. **Paste** into SQL Editor
4. Click **"Run"** (or press Cmd+Enter)
5. ✅ Should see: "Success. No rows returned"

### 4.3 Migration 2: focus_keyword_groups table

1. Open file: `supabase/migrations/20260315000002_create_focus_keyword_groups_table.sql`
2. **Copy ALL content**
3. **Paste** into SQL Editor (replace previous query)
4. Click **"Run"**
5. ✅ Success

### 4.4 Migration 3: focus_keywords table

1. Open file: `supabase/migrations/20260315000003_create_focus_keywords_table.sql`
2. **Copy ALL content**
3. **Paste** into SQL Editor
4. Click **"Run"**
5. ✅ Success

### 4.5 Migration 4: keyword_snapshots table

1. Open file: `supabase/migrations/20260315000004_create_keyword_snapshots_table.sql`
2. **Copy ALL content**
3. **Paste** into SQL Editor
4. Click **"Run"**
5. ✅ Success

### 4.6 Migration 5: traffic_snapshots table

1. Open file: `supabase/migrations/20260315000005_create_traffic_snapshots_table.sql`
2. **Copy ALL content**
3. **Paste** into SQL Editor
4. Click **"Run"**
5. ✅ Success

### ✅ Verify All Tables Created

1. Click **"Table Editor"** in left sidebar
2. Should see **5 tables:**
   - ✅ clients
   - ✅ focus_keyword_groups
   - ✅ focus_keywords
   - ✅ keyword_snapshots
   - ✅ traffic_snapshots

**Screenshot:** You should see all 5 tables listed!

---

## Step 5: Test Connection (2 minutes)

### 5.1 Start Development Server

```bash
# In Terminal
npm run dev
```

### Expected Output

```
▲ Next.js 14.1.0
- Local:        http://localhost:4000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.1s
```

### 5.2 Open Browser

1. Open Chrome/Safari/Firefox
2. Go to: **http://localhost:4000**

### ✅ Success Check

You should see:
- ✅ "SEO Dashboard" heading
- ✅ Three cards with features
- ✅ "✅ Project Structure Ready" at bottom
- ✅ No errors in browser console (press F12)

### 5.3 Test Database Connection (Optional)

Create test file:

```bash
# Create test directory
mkdir -p app/test-db
```

Create `app/test-db/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TestDB() {
  const supabase = createClient()
  const { error } = await supabase.from('clients').select('count')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      {error ? (
        <p className="text-red-600">❌ Error: {error.message}</p>
      ) : (
        <p className="text-green-600">✅ Connected! Database is ready.</p>
      )}
    </div>
  )
}
```

Visit: **http://localhost:4000/test-db**

**Expected:** ✅ "Connected! Database is ready."

---

## 🎉 Phase 2.2 Complete!

If you see:
- ✅ `npm run dev` works
- ✅ http://localhost:4000 loads
- ✅ All 5 tables in Supabase
- ✅ No console errors

**You're ready for Phase 2.3 (Authentication)!**

---

## 🐛 Troubleshooting

### "Cannot find module 'next'"
```bash
# Re-install dependencies
rm -rf node_modules package-lock.json
npm install
```

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
```bash
# Check .env.local exists
ls -la .env.local

# Check it has values (not "your-project-url-here")
cat .env.local

# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### "Failed to connect to database"
```bash
# Check credentials in .env.local are correct
# Go to Supabase Dashboard → Settings → API
# Copy URL and anon key again
# Paste into .env.local
# Save and restart server
```

### Migrations failed with "already exists"
```sql
-- In Supabase SQL Editor, drop and recreate:
DROP TABLE IF EXISTS traffic_snapshots CASCADE;
DROP TABLE IF EXISTS keyword_snapshots CASCADE;
DROP TABLE IF EXISTS focus_keywords CASCADE;
DROP TABLE IF EXISTS focus_keyword_groups CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Then run migrations 1-5 again
```

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
# Visit http://localhost:3001
```

---

## ✅ Checklist: Phase 2.2 Complete

```markdown
- [ ] npm install completed (no errors)
- [ ] Supabase project created
- [ ] .env.local configured with real credentials
- [ ] All 5 migrations run successfully
- [ ] 5 tables visible in Table Editor
- [ ] npm run dev works
- [ ] http://localhost:4000 loads
- [ ] No console errors
- [ ] (Optional) Test DB page shows "Connected"
```

**When ALL checked:** Phase 2.2 is complete! 🎉

**Next:** Phase 2.3 - Authentication Module

---

## 📞 Need Help?

If stuck:
1. Read the Troubleshooting section
2. Check error messages carefully
3. Ask AI with the exact error message

**Common mistakes:**
- ❌ Forgot to save .env.local
- ❌ Copied wrong credentials
- ❌ Didn't run all 5 migrations
- ❌ Ran migrations out of order

---

**Good luck! This should take ~10-15 minutes total.** ⏱️
