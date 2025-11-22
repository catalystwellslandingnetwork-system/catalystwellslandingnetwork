# Landing Page Database Setup Guide

## 🎯 Purpose

The landing page database stores **ALL payment transactions and subscription records** for audit, analytics, and compliance purposes.

**Both databases work together:**
- **Landing Page DB** = Payment logs, transaction audit trail
- **Main App DB** = Active subscription status, school data

---

## ✅ Step 1: Create Landing Page Supabase Project

### Option A: Separate Project (Recommended)
1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Name: `Catalyst Wells Landing Page`
4. Choose region closest to your users
5. Set a strong database password
6. Click **"Create new project"** (takes ~2 minutes)

### Option B: Same Project, Different Schema
- Use the same Supabase project as your main app
- All tables will be in `public` schema
- ⚠️ Make sure table names don't conflict

---

## ✅ Step 2: Run SQL Schema

1. Open your **landing page** Supabase project
2. Go to **SQL Editor** in sidebar
3. Click **"New Query"**
4. Copy the **ENTIRE contents** of `landing_page_payment_schema.sql`
5. Paste into the query editor
6. Click **"Run"** or press `Ctrl+Enter`

### Expected Result:
```
Landing page payment schema created successfully!
Tables created: subscriptions, payment_transactions, payment_verification_log, trial_activations, subscription_sync_log
RLS policies enabled for security
Service role key will have full access
```

### Verify Tables Created:
1. Go to **Table Editor** in sidebar
2. You should see these tables:
   - ✅ `subscriptions`
   - ✅ `payment_transactions`
   - ✅ `payment_verification_log`
   - ✅ `trial_activations`
   - ✅ `subscription_sync_log`

---

## ✅ Step 3: Get API Credentials

1. In your **landing page** Supabase project
2. Go to **Settings → API**
3. Copy these values:

### Project URL:
```
https://xxxxxxxxxxxxx.supabase.co
```
Copy this → Use for `NEXT_PUBLIC_SUPABASE_URL`

### Project API Keys:

#### anon public key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
Copy this → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### service_role secret key: ⚠️ KEEP SECRET
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
Copy this → Use for `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ Step 4: Update Environment Variables

Open `.env.local` in your landing page project:

```env
# ============================================
# REQUIRED: Main App Supabase
# ============================================
MAIN_APP_SUPABASE_URL=https://your-main-app.supabase.co
MAIN_APP_SUPABASE_SERVICE_KEY=eyJhbGci...main_app_service_key

# ============================================
# REQUIRED: Landing Page Supabase
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-landing.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...landing_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...landing_service_key

# ============================================
# Razorpay
# ============================================
RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy
RAZORPAY_KEY_SECRET=kSWSRi4nqmub7bMSiusGGKLx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy
```

### Critical Points:
1. ✅ **MAIN_APP_*** = Your main application's Supabase
2. ✅ **NEXT_PUBLIC_SUPABASE_* and SUPABASE_SERVICE_ROLE_KEY** = Landing page Supabase
3. ✅ Use **service_role** keys (NOT anon keys) for MAIN_APP and SUPABASE_SERVICE_ROLE_KEY
4. ✅ All URLs must start with `https://` and end with `.supabase.co`

---

## ✅ Step 5: Test Database Connection

### Test Script:

Create a test file `test-db-connection.mjs`:

```javascript
import { createClient } from '@supabase/supabase-js';

// Test Landing Page DB
const landingUrl = 'YOUR_LANDING_PAGE_URL';
const landingKey = 'YOUR_LANDING_SERVICE_KEY';
const landingDB = createClient(landingUrl, landingKey);

// Test Main App DB
const mainUrl = 'YOUR_MAIN_APP_URL';
const mainKey = 'YOUR_MAIN_APP_SERVICE_KEY';
const mainDB = createClient(mainUrl, mainKey);

console.log('Testing Landing Page DB...');
const { data: landingData, error: landingError } = await landingDB
  .from('subscriptions')
  .select('count')
  .limit(1);

if (landingError) {
  console.error('❌ Landing Page DB Error:', landingError.message);
} else {
  console.log('✅ Landing Page DB Connected!');
}

console.log('Testing Main App DB...');
const { data: mainData, error: mainError } = await mainDB
  .from('schools')
  .select('count')
  .limit(1);

if (mainError) {
  console.error('❌ Main App DB Error:', mainError.message);
} else {
  console.log('✅ Main App DB Connected!');
}
```

Run: `node test-db-connection.mjs`

**Expected Output:**
```
Testing Landing Page DB...
✅ Landing Page DB Connected!
Testing Main App DB...
✅ Main App DB Connected!
```

---

## ✅ Step 6: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 🎯 Verify Everything Works

### Test Payment Flow:

1. Go to http://localhost:3004/checkout
2. Enter a valid School ID
3. Select plan and student count
4. Complete payment with test card: `4111 1111 1111 1111`
5. Check console logs:

**Expected Console Output:**
```
Supabase configured: true
Razorpay order created: order_xxx
Subscription fetched: sub_xxx School ID: school-id-here
✅ Subscription activated in MAIN APP: school-id-here
Landing page DB updated successfully
```

### Check Landing Page Database:

Go to **Table Editor** → `payment_transactions`:
- Should see a row with `status = 'paid'`
- `razorpay_payment_id` filled
- `signature_verified = true`

Go to `subscriptions`:
- Should see subscription with `status = 'active'`
- Matches your order details

### Check Main App Database:

Query your `schools` table:
```sql
SELECT 
  subscription_status,
  subscription_plan,
  student_limit,
  razorpay_subscription_id,
  monthly_fee
FROM schools 
WHERE id = 'your-school-id';
```

Should show:
- `subscription_status` = `'active'`
- `student_limit` = your selected count
- `razorpay_subscription_id` = payment ID
- `monthly_fee` = plan price

---

## 🔐 Security Checklist

- [ ] RLS enabled on all tables
- [ ] Service role keys stored in `.env.local` (NOT `.env`)
- [ ] `.env.local` is in `.gitignore`
- [ ] NEVER commit API keys to Git
- [ ] Use environment variables in production
- [ ] Landing page service key has access to all tables
- [ ] Main app service key has access to schools table

---

## 🚨 Troubleshooting

### Error: "TypeError: fetch failed"

**Cause:** Wrong Supabase credentials or project not reachable

**Fix:**
1. Verify URL format: `https://xxxxx.supabase.co`
2. Verify you're using **service_role** key (NOT anon)
3. Check you copied from correct project (landing vs main)
4. Test with curl:
   ```bash
   curl "https://your-project.supabase.co/rest/v1/subscriptions?limit=1" \
     -H "apikey: YOUR_SERVICE_KEY" \
     -H "Authorization: Bearer YOUR_SERVICE_KEY"
   ```

### Error: "relation 'subscriptions' does not exist"

**Cause:** SQL schema not run

**Fix:**
1. Go to SQL Editor in Supabase
2. Run `landing_page_payment_schema.sql`
3. Verify tables exist in Table Editor

### Error: "permission denied for table subscriptions"

**Cause:** Using anon key instead of service_role key

**Fix:**
1. Get **service_role** key from Settings → API
2. Update `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
3. Restart dev server

### Landing Page DB Works But Main App Doesn't Update

**Cause:** Main app credentials wrong or table doesn't exist

**Fix:**
1. Verify `MAIN_APP_SUPABASE_URL` points to your main app
2. Verify `MAIN_APP_SUPABASE_SERVICE_KEY` is from main app
3. Check `schools` table exists in main app
4. Run query to verify: `SELECT * FROM schools LIMIT 1;`

---

## 📊 What Gets Stored Where

### Landing Page Database:
```
payment_transactions:
  - Razorpay order/payment IDs
  - Amount, currency, status
  - Signature verification
  - IP address, user agent
  - Full audit trail

subscriptions:
  - School ID reference
  - Plan details
  - Status tracking
  - Razorpay payment ID

trial_activations:
  - Free trial records
  - Expiration dates

payment_verification_log:
  - Every verification attempt
  - Security audit
```

### Main App Database:
```
schools:
  - subscription_status (active/trial/inactive)
  - student_limit
  - plan_type
  - monthly_fee
  - razorpay_subscription_id
  - next_billing_date
  - All subscription metadata
```

---

## ✅ Success Indicators

When everything is working:

1. ✅ Console shows "Supabase configured: true"
2. ✅ Console shows "✅ Subscription activated in MAIN APP"
3. ✅ Console shows "Landing page DB updated successfully"
4. ✅ Landing page DB has payment records
5. ✅ Main app DB has updated subscription status
6. ✅ No "fetch failed" errors
7. ✅ Payment success page loads correctly

---

## 🎉 You're Done!

Your dual-database system is now operational:
- **Landing Page DB** = Complete payment audit trail
- **Main App DB** = Active subscription management
- **Razorpay** = Payment gateway (fallback data source)

All three systems work together for maximum reliability! 🚀
