# Google OAuth Setup Guide

**Time Required:** ~5 minutes
**Prerequisites:** Supabase project created (Phase 2.2 completed)

---

## Overview

This guide walks you through configuring Google OAuth authentication for the SEO Dashboard. After completing this setup, users will be able to sign in with their Google accounts.

---

## Step 1: Configure Google OAuth in Supabase

### 1.1 Get OAuth Callback URL from Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** provider
5. Copy the **Callback URL (for OAuth)** - it looks like:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
6. Keep this URL handy - you'll need it in the next step

---

## Step 2: Create Google OAuth Credentials

### 2.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 2.2 Create a New Project (if needed)

1. Click the project dropdown at the top
2. Click **"New Project"**
3. Enter project name: `SEO Dashboard` (or your preferred name)
4. Click **"Create"**
5. Wait for project creation, then select it

### 2.3 Enable OAuth Consent Screen

1. In the left sidebar, navigate to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **"Create"**
4. Fill in required fields:
   - **App name:** `SEO Dashboard`
   - **User support email:** Your email
   - **Developer contact email:** Your email
5. Click **"Save and Continue"**
6. Skip **Scopes** step (click "Save and Continue")
7. Skip **Test users** step (click "Save and Continue")
8. Click **"Back to Dashboard"**

### 2.4 Create OAuth Credentials

1. In the left sidebar, navigate to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Select **Application type:** `Web application`
4. Enter **Name:** `SEO Dashboard Web Client`
5. Under **Authorized redirect URIs**, click **"+ Add URI"**
6. Paste the **Callback URL** you copied from Supabase (Step 1.1)
7. Click **"Create"**
8. A dialog will appear with your credentials:
   - **Client ID** (starts with `xxx.apps.googleusercontent.com`)
   - **Client Secret**
9. **Copy both values** - you'll need them in the next step

---

## Step 3: Configure Supabase with Google OAuth Credentials

### 3.1 Add Credentials to Supabase

1. Go back to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Find **Google** provider and click the **toggle** to enable it
4. Paste your credentials:
   - **Client ID (for OAuth):** Paste the Client ID from Google Cloud
   - **Client Secret (for OAuth):** Paste the Client Secret from Google Cloud
5. Click **"Save"**

---

## Step 4: Add Authorized Domains (for Production)

⚠️ **Important for deployment:** When deploying to production (Vercel, etc.), you need to:

1. In **Google Cloud Console** → **Credentials** → Edit your OAuth client
2. Under **Authorized JavaScript origins**, add:
   ```
   https://your-domain.com
   ```
3. Under **Authorized redirect URIs**, add:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Click **"Save"**

5. In **Supabase Dashboard** → **Authentication** → **URL Configuration**:
   - **Site URL:** `https://your-domain.com`
   - **Redirect URLs:** Add `https://your-domain.com/auth/callback`

---

## Step 5: Test Authentication

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test Login Flow

1. Open browser: `http://localhost:4000/login`
2. Click **"Continue with Google"**
3. You should be redirected to Google's sign-in page
4. Select your Google account
5. Grant permissions
6. You should be redirected back to `http://localhost:4000/dashboard`
7. Verify you see your email displayed

### 5.3 Test Logout Flow

1. On the dashboard page, click **"Sign Out"**
2. You should be redirected to `/login`
3. Try accessing `/dashboard` directly - you should be redirected to `/login`

### 5.4 Test Protected Routes

1. While logged out, try to access: `http://localhost:4000/dashboard`
2. You should be automatically redirected to `/login`
3. Log in again
4. You should land on `/dashboard` successfully

---

## Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**Cause:** The callback URL doesn't match between Google Cloud and Supabase.

**Solution:**
1. Verify the callback URL in Google Cloud **exactly matches** the one from Supabase
2. Make sure there are no trailing slashes or typos
3. Wait 1-2 minutes for Google's changes to propagate

---

### Issue: "Access Denied" Error

**Cause:** OAuth consent screen not properly configured.

**Solution:**
1. Ensure OAuth consent screen is published (or in Testing mode)
2. If in Testing mode, add your Google account as a test user
3. Verify app name and required fields are filled in

---

### Issue: Login Button Does Nothing

**Cause:** Missing environment variables or invalid Supabase configuration.

**Solution:**
1. Check `.env.local` has correct values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   ```
2. Restart Next.js dev server: `npm run dev`
3. Check browser console for errors

---

### Issue: Redirect After Login Fails

**Cause:** Missing callback route or incorrect redirect logic.

**Solution:**
1. Verify file exists: `app/auth/callback/route.ts`
2. Check Supabase redirect URL is set to `http://localhost:4000/auth/callback` (development)
3. Clear browser cookies and try again

---

## Security Checklist

Before deploying to production:

- ✅ Environment variables stored securely (Vercel Environment Variables, not committed to git)
- ✅ `.env.local` added to `.gitignore`
- ✅ Google OAuth credentials not exposed in client-side code
- ✅ Authorized domains configured in Google Cloud Console
- ✅ Supabase Site URL and Redirect URLs updated for production domain
- ✅ OAuth consent screen verified status set to "Published"
- ✅ Test authentication flow in production environment

---

## Next Steps

✅ **Phase 2.3 Complete!** Authentication is now working.

**Proceed to Phase 3:** Client Management
- Create client CRUD operations
- Build client list and detail pages
- Implement client filtering and search

See [MASTER-PLAN.md](./MASTER-PLAN.md) for full roadmap.
