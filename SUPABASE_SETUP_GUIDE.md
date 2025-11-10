# 🚀 Supabase Project Setup Guide

## Status: Project EXISTS but needs configuration

Your Supabase project `tqnlhqtruatpaplsrtso` is **ACTIVE** but needs to be set up properly for authentication to work.

---

## Step 1: Run Database Migrations

Your project has 11 migration files that create all the necessary tables and security policies.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to: https://app.supabase.com/project/tqnlhqtruatpaplsrtso
2. Click: **SQL Editor** (in left sidebar)
3. Run each migration file in order (oldest to newest):

**Copy and paste each file's contents into the SQL editor and click "Run":**

```
1. supabase/migrations/20251002160614_0d7d075c-0826-40d6-b610-4974f61dee02.sql
2. supabase/migrations/20251002160758_3a33984b-f4d3-43eb-ad41-d38c18235fd2.sql
3. supabase/migrations/20251002160855_b7ed00b1-35ad-4de3-9254-3fbc109f0cab.sql
4. supabase/migrations/20251002165011_e8353a07-7509-403e-80c6-f3797c093e56.sql
5. supabase/migrations/20251002165502_45ae1f29-2026-4535-b13d-9607a9096c86.sql
6. supabase/migrations/20251002170154_9dc2a757-8ed7-4269-80a3-75a628620e71.sql
7. supabase/migrations/20251002170542_11e816a5-04d7-4bf5-85f7-ccc3d0dfc73d.sql
8. supabase/migrations/20251002174744_031ce648-bac9-4192-97ae-c8353d55d21e.sql
9. supabase/migrations/20251002192131_c7a2bea4-3730-4134-af7c-883389aa0386.sql
10. supabase/migrations/20251002192924_59723210-5e26-4414-833f-e2dd8f903d1c.sql
11. supabase/migrations/20251109000000_user_preferences.sql
```

### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref tqnlhqtruatpaplsrtso

# Push all migrations
supabase db push
```

---

## Step 2: Disable Email Confirmation (Development)

For development, you want users to sign up without needing to verify their email.

1. Go to: https://app.supabase.com/project/tqnlhqtruatpaplsrtso/auth/providers
2. Scroll to: **Email** section
3. Find: **"Enable email confirmations"**
4. **UNCHECK** this option
5. Click: **Save**

**Why?** With email confirmation enabled, users must click a verification link in their email before they can sign in. The default Supabase email service often doesn't deliver emails reliably during development.

---

## Step 3: Verify Tables Were Created

1. Go to: https://app.supabase.com/project/tqnlhqtruatpaplsrtso/editor
2. Check that these tables exist:
   - ✅ `profiles`
   - ✅ `scans`
   - ✅ `invites`
   - ✅ `user_stats`
   - ✅ `achievements`
   - ✅ `user_achievements`
   - ✅ `user_preferences`

If any tables are missing, re-run the migrations from Step 1.

---

## Step 4: Test Authentication

After completing steps 1-3:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:8080/auth

3. **Test Email Sign Up:**
   - Click: "Sign Up" tab
   - Enter: test@example.com / password123
   - Should see: ✅ "Account created! Welcome to SkinScan!"
   - Should redirect to: `/onboarding`

4. **Check the browser console:**
   ```
   [Auth] Sign up response: { user: {...}, session: {...} }
   [Auth] State changed: test@example.com
   ```

---

## Step 5: Configure Google OAuth (Optional)

If you want Google sign-in to work:

### A. Google Cloud Console

1. Go to: https://console.cloud.google.com
2. Create a new project (or select existing)
3. Navigate to: **APIs & Services** → **Credentials**
4. Click: **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   ```
   https://tqnlhqtruatpaplsrtso.supabase.co/auth/v1/callback
   http://localhost:8080/auth/callback
   ```
7. Copy your **Client ID** and **Client Secret**

### B. Supabase Dashboard

1. Go to: https://app.supabase.com/project/tqnlhqtruatpaplsrtso/auth/providers
2. Find: **Google** provider
3. Toggle: **Enable**
4. Paste: **Client ID**
5. Paste: **Client Secret**
6. Click: **Save**

---

## 🐛 Troubleshooting

### Issue: "No user" in console after sign up

**Cause**: Email confirmation is enabled

**Fix**: Follow Step 2 above to disable email confirmation

---

### Issue: "Invalid API key" or 403 errors

**Cause**: Environment variables not loaded

**Fix**:
1. Make sure `.env` file exists in project root
2. Restart dev server: `npm run dev`
3. Clear browser cache and localStorage

---

### Issue: Tables don't exist

**Cause**: Migrations not run

**Fix**: Follow Step 1 above to run all migrations

---

### Issue: "OAuth provider not enabled"

**Cause**: Google OAuth not configured

**Fix**: Follow Step 5 above OR just use email authentication

---

## ✅ Expected Behavior After Setup

### Sign Up Flow:
1. User enters email/password
2. Supabase creates user account
3. `handle_new_user()` trigger creates profile and user_stats
4. User gets session immediately (no email confirmation needed)
5. Redirects to `/onboarding`

### Sign In Flow:
1. User enters credentials
2. Supabase authenticates
3. Checks if onboarding completed (user_preferences table)
4. Redirects to `/onboarding` OR `/` based on completion status

### Google OAuth Flow:
1. User clicks "Continue with Google"
2. Redirects to Google sign-in
3. Google redirects back to app
4. Supabase creates session
5. Redirects to `/onboarding`

---

## 📊 Verify Everything Works

Run this test in browser console after signing up:

```javascript
// Check session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// Check profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .single();
console.log('Profile:', profile);

// Check stats
const { data: stats } = await supabase
  .from('user_stats')
  .select('*')
  .single();
console.log('Stats:', stats);
```

You should see valid data for all three queries.

---

## 🚨 Common Mistakes

❌ **Forgetting to save** after changing settings in Supabase Dashboard
❌ **Running migrations out of order** (always oldest to newest)
❌ **Not restarting dev server** after changing .env file
❌ **Leaving email confirmation enabled** during development
❌ **Not clearing browser cache** after making changes

---

## 🎯 Quick Checklist

- [ ] Step 1: Run all 11 database migrations in SQL Editor
- [ ] Step 2: Disable email confirmation in Auth settings
- [ ] Step 3: Verify all 7 tables exist in Table Editor
- [ ] Step 4: Test sign up with test@example.com
- [ ] Step 5: (Optional) Configure Google OAuth
- [ ] Verify console logs show successful authentication
- [ ] Verify redirect to /onboarding works

---

## 📞 Still Having Issues?

1. **Check Supabase Project Logs**:
   - Go to: https://app.supabase.com/project/tqnlhqtruatpaplsrtso/logs/explorer
   - Look for auth errors

2. **Check Browser Console**:
   - Look for `[Auth]` log messages
   - Check Network tab for failed requests

3. **Verify Environment Variables**:
   ```bash
   cat .env
   ```
   Should show:
   ```
   VITE_SUPABASE_URL="https://tqnlhqtruatpaplsrtso.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="eyJh..."
   ```

4. **Try Incognito/Private Browsing**:
   - Sometimes cached data causes issues

---

**Last Updated**: November 10, 2025
**Project**: SkinScan (tqnlhqtruatpaplsrtso)
**Status**: Active and ready for setup
