# 🔧 Authentication Troubleshooting Guide

## 🐛 Issue: "No user" in console after sign up/sign in

### Root Causes

The authentication is failing because of Supabase configuration. Here are the most common issues:

---

## ✅ SOLUTION 1: Disable Email Confirmation (Development)

**Why this happens**: Supabase has email confirmation enabled by default. Users need to click a verification link in their email before they can sign in.

### Steps to Fix:

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: `tqnlhqtruatpaplsrtso`
3. **Navigate to**: Authentication → Email Templates
4. **Scroll down** to "Email Confirmation"
5. **Toggle OFF**: "Enable email confirmations"

**OR (Recommended for Development)**:

1. Go to: Authentication → Settings
2. Find: "Enable email confirmations"
3. **Uncheck** the box
4. Click "Save"

After this, users can sign up and immediately use the app without verifying email.

---

## ✅ SOLUTION 2: Configure Google OAuth

**Why this happens**: Google OAuth requires configuration in both Supabase and Google Cloud Console.

### Steps to Fix Google Sign In:

#### A. In Google Cloud Console:

1. Go to: https://console.cloud.google.com
2. Create a new project or select existing
3. Navigate to: "APIs & Services" → "Credentials"
4. Click: "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add Authorized redirect URIs:
   ```
   https://tqnlhqtruatpaplsrtso.supabase.co/auth/v1/callback
   ```
7. Copy your **Client ID** and **Client Secret**

#### B. In Supabase Dashboard:

1. Go to: Authentication → Providers
2. Find: "Google"
3. Toggle: **Enable**
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click: "Save"

---

## ✅ SOLUTION 3: Check Auth Logs

To see what's happening:

1. **Supabase Dashboard** → Authentication → Logs
2. Look for error messages
3. Common errors:
   - "Email not confirmed"
   - "Invalid login credentials"
   - "OAuth provider not configured"

---

## ✅ SOLUTION 4: Development Mode (Quick Fix)

For **development only**, you can auto-confirm users:

### Option A: Disable Email Confirmation (Recommended)
See Solution 1 above

### Option B: Use Supabase's Auto-Confirm
1. Supabase Dashboard → Authentication → Settings
2. Find: "Email Auth"
3. **Enable**: "Confirm email automatically"
4. Click: "Save"

---

## 🧪 Testing After Fix

### Test Email Sign Up:
1. Go to: http://localhost:8080/auth
2. Click: "Sign Up" tab
3. Enter: test@example.com / password123
4. Should see: "Account created! Welcome to SkinScan!"
5. Should redirect to: `/onboarding`

### Test Email Sign In:
1. Use the same email you signed up with
2. Should see: "Welcome back!"
3. Should redirect based on onboarding status

### Test Google OAuth:
1. Click: "Continue with Google"
2. Should open: Google account selection
3. After selecting account: Should redirect to `/onboarding`

---

## 📝 What The Code Does Now

### Sign Up Flow:
```
1. User enters email/password
2. Supabase creates user
3. IF email confirmation required:
   → Show: "Check your email!"
   → User clicks link in email
   → Gets redirected to /onboarding
4. IF auto-confirmed:
   → Show: "Account created!"
   → Navigate to /onboarding immediately
```

### Sign In Flow:
```
1. User enters credentials
2. Supabase authenticates
3. Check if onboarding completed
4. IF completed → Navigate to /
5. IF not completed → Navigate to /onboarding
```

### Google OAuth Flow:
```
1. User clicks "Continue with Google"
2. Redirects to Google
3. User selects account
4. Google redirects back to app
5. Supabase creates session
6. Navigate to /onboarding
```

---

## 🔍 Debug Console Logs

You should now see helpful logs:

```javascript
[Auth] Starting Google sign in...
[Auth] Google OAuth initiated: {...}
[Auth] Sign up response: {...}
[Auth] State changed: user@example.com
```

If you see errors:
```javascript
[Auth] Sign up error: Email not confirmed
[Auth] Google OAuth error: Provider not enabled
```

---

## ✅ Quick Checklist

- [ ] Disable email confirmation in Supabase (Development)
- [ ] OR: Setup email provider (SendGrid, Mailgun) for production
- [ ] Configure Google OAuth credentials (if using Google sign in)
- [ ] Test sign up with email
- [ ] Test sign in with email
- [ ] Test Google OAuth
- [ ] Check Supabase Auth logs for errors

---

## 🚨 Production Notes

**Before launching to production**:

1. **Email Confirmation**:
   - ✅ ENABLE email confirmation
   - ✅ Setup proper email provider (not default Supabase emails)
   - ✅ Customize email templates with your branding

2. **Google OAuth**:
   - ✅ Use production redirect URL
   - ✅ Add your domain to authorized origins
   - ✅ Store credentials securely

3. **Security**:
   - ✅ Enable ReCAPTCHA
   - ✅ Set rate limits
   - ✅ Review password policies

---

## 📞 Still Having Issues?

Check the browser console for:
- `[Auth]` logs showing what's happening
- Any error messages
- Network tab for failed requests

Common fixes:
- Clear browser cache and localStorage
- Try incognito/private browsing
- Check if Supabase project is paused
- Verify environment variables are loaded

---

**Updated**: November 9, 2025
**Status**: Code updated with better error handling + logging
