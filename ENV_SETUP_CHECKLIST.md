# Environment Setup Checklist

## ❌ Current Issue: "TypeError: fetch failed"

This error means **Supabase credentials are incorrect or unreachable**. Follow this checklist:

---

## ✅ Step 1: Verify Main App Supabase Credentials

Open your `.env.local` file and ensure these are set correctly:

```env
# Main App Supabase (REQUIRED for payment activation)
MAIN_APP_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
MAIN_APP_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Landing Page Supabase (OPTIONAL - only for payment logs)
NEXT_PUBLIC_SUPABASE_URL=https://yyyyyyyyyyyyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy
RAZORPAY_KEY_SECRET=kSWSRi4nqmub7bMSiusGGKLx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy
```

---

## 🔍 Step 2: Get Your Main App Supabase Credentials

### From Your Main App Project:

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your **main app project** (NOT the landing page project)
3. Click **Settings** → **API**
4. Copy these values:

   - **Project URL** → `MAIN_APP_SUPABASE_URL`
   - **service_role (secret)** → `MAIN_APP_SUPABASE_SERVICE_KEY`

   ⚠️ **Important:** Use the **service_role** key, NOT the anon key!

---

## 🧪 Step 3: Test Credentials

Run this test to verify your credentials work:

```bash
# Test Main App Supabase connection
curl -X GET "YOUR_MAIN_APP_SUPABASE_URL/rest/v1/schools?limit=1" \
  -H "apikey: YOUR_MAIN_APP_SERVICE_KEY" \
  -H "Authorization: Bearer YOUR_MAIN_APP_SERVICE_KEY"
```

**Expected Response:** JSON data or empty array `[]`
**Error Response:** `{"message": "Invalid API key"}` = wrong credentials

---

## 📋 Step 4: Verify Database Schema

Make sure your **main app** has the `schools` table with these fields:

```sql
-- Check if table exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'schools';
```

**Required fields:**
- `id` (uuid)
- `email` (text)
- `name` (text)
- `phone` (text)
- `subscription_status` (text)
- `subscription_plan` (text)
- `student_limit` (integer)
- `user_limit` (integer)
- `trial_end_date` (timestamp)
- `subscription_start_date` (timestamp)
- `next_billing_date` (timestamp)
- `razorpay_subscription_id` (text)
- `plan_type` (text)
- `monthly_fee` (numeric)
- `payment_status` (text)

---

## 🔐 Step 5: Enable RLS Bypass for Service Role

The service role key should **automatically bypass RLS**, but verify:

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'schools';
```

If you see policies, the **service role will bypass them automatically**. No changes needed!

---

## 🚀 Step 6: Restart Dev Server

After updating `.env.local`:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🎯 Quick Fix Checklist

- [ ] Main app Supabase URL starts with `https://` and ends with `.supabase.co`
- [ ] Service key is long (starts with `eyJhbGciOiJIUzI1NiI...`)
- [ ] Using **service_role** key, NOT anon key
- [ ] Main app database has `schools` table
- [ ] Dev server restarted after env changes
- [ ] No proxy or firewall blocking Supabase

---

## 🆘 Still Not Working?

### Option 1: Skip Landing Page DB (Recommended)

The landing page database is **optional**. Only the main app database is required.

**Comment out or remove these lines from `.env.local`:**

```env
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

The system will:
- ✅ Still verify payments
- ✅ Still update main app database
- ⚠️ Skip payment transaction logs (optional)

### Option 2: Check Network Issues

```bash
# Test if Supabase is reachable
ping your-project.supabase.co
```

If ping fails, check:
- Firewall settings
- VPN/Proxy
- Internet connection

---

## 📊 Expected Console Output (Success)

After payment verification, you should see:

```
Payment signature verified successfully
Subscription fetched: sub_xxx School ID: abc-123-def
✅ Subscription activated in MAIN APP: abc-123-def
Landing page DB updated successfully
```

If you see:
```
❌ CRITICAL: Failed to activate in main app
```

Then your **main app credentials are wrong** or the database is unreachable.

---

## 🎉 Success Criteria

1. Payment completes in Razorpay
2. Console shows "✅ Subscription activated in MAIN APP"
3. Main app database `schools` table updated:
   - `subscription_status` = 'active'
   - `student_limit` = selected count
   - `razorpay_subscription_id` = payment ID

---

## 📞 Need Help?

If still not working, share:
1. Your Supabase project URL (first 10 characters only)
2. Console error messages
3. Whether test curl command worked
4. Database schema confirmation

---

**Most Common Issues:**
1. ❌ Using anon key instead of service_role key
2. ❌ Wrong Supabase project (using landing page URL for main app)
3. ❌ Typo in environment variable names
4. ❌ Forgot to restart dev server
5. ❌ `schools` table doesn't exist in main app
