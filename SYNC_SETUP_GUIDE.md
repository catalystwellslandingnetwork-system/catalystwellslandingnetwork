# Landing Page → Main App Sync Guide

## 📊 Architecture Overview

```
Landing Page (Port 3004)          Main App (Port 3000)
─────────────────────            ─────────────────────
├─ Supabase DB (Landing)         ├─ Supabase DB (Main)
├─ Trial Signups                 ├─ User Accounts
├─ Payment Processing            ├─ School Management
└─ Subscription Records          └─ Full Application Data

         ↓ SYNC ↓
         
    Secure API Call
    POST /api/sync/subscription
    with JWT authentication
```

## 🔄 What Gets Synced

### 1. Free Trial Signups
When a user signs up for a free trial on the landing page:
- Trial subscription created in landing page DB
- **Immediately synced** to main app DB
- Main app creates school account
- Login credentials generated
- Welcome email sent from main app

### 2. Paid Subscriptions
When a user completes payment:
- Subscription created in landing page DB
- Payment verified with Razorpay
- **Immediately synced** to main app DB
- Main app activates paid features
- Invoice generated from main app

## 🔧 Setup Instructions

### Step 1: Configure Main App Endpoint

In your **main application**, create the sync endpoint:

```typescript
// app/api/sync/subscription/route.ts (Main App)

import { NextRequest, NextResponse } from 'next/server';
import { verifySecureRequest } from '@/lib/verify-security';
import { createSchoolAccount } from '@/lib/school-management';

export async function POST(req: NextRequest) {
  try {
    // Verify request is from landing page
    const verified = await verifySecureRequest(req);
    if (!verified) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscriptionData = await req.json();
    
    // Create or update school in main database
    const school = await createSchoolAccount({
      email: subscriptionData.user_email,
      name: subscriptionData.school_name,
      phone: subscriptionData.phone,
      planName: subscriptionData.plan_name,
      planPrice: subscriptionData.plan_price,
      studentCount: subscriptionData.student_count,
      billingCycle: subscriptionData.billing_cycle,
      status: subscriptionData.status,
      trialEndDate: subscriptionData.trial_end_date,
      subscriptionStartDate: subscriptionData.subscription_start_date,
      nextBillingDate: subscriptionData.next_billing_date,
      razorpaySubscriptionId: subscriptionData.razorpay_subscription_id,
      metadata: {
        ...subscriptionData.metadata,
        synced_from_landing: true,
        landing_subscription_id: subscriptionData.id,
      },
    });

    // Generate login credentials if new school
    if (school.isNew) {
      await sendWelcomeEmail(school);
    }

    return NextResponse.json({
      success: true,
      schoolId: school.id,
    });

  } catch (error: any) {
    console.error('Sync endpoint error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Step 2: Configure Environment Variables

**Landing Page `.env.local`:**
```env
# Main App Configuration
MAIN_APP_URL=http://localhost:3000
MAIN_APP_API_KEY=your_secure_api_key_here
MAIN_APP_SECRET=your_shared_secret_here
```

**Main App `.env.local`:**
```env
# Landing Page Configuration (for verification)
LANDING_PAGE_URL=http://localhost:3004
LANDING_PAGE_API_KEY=your_secure_api_key_here
LANDING_PAGE_SECRET=your_shared_secret_here
```

### Step 3: Set Up Sync Tables

Run this SQL in your **landing page Supabase**:

```bash
# Execute supabase_sync_tables.sql
```

This creates:
- `sync_retry_queue` - Failed syncs for retry
- `sync_audit_logs` - All sync attempts logged
- `admin_alerts` - Notifications for failed syncs

### Step 4: Test the Sync

#### Test Free Trial Sync:
```bash
# 1. Start both apps
cd landing-page && npm run dev  # Port 3004
cd main-app && npm run dev      # Port 3000

# 2. Sign up for trial
Visit: http://localhost:3004/trial
Fill form and submit

# 3. Check main app database
# Should see new school created with status='trial'
```

#### Test Paid Subscription Sync:
```bash
# 1. Complete payment on landing page
Visit: http://localhost:3004/checkout
Complete Razorpay payment

# 2. Check main app database
# Should see subscription with status='active'
```

## 🔒 Security Implementation

The sync uses 7-layer security:

### 1. **HTTPS Only**
```typescript
if (!url.startsWith('https://')) {
  throw new Error('HTTPS required');
}
```

### 2. **API Key Authentication**
```typescript
headers: {
  'x-api-key': process.env.MAIN_APP_API_KEY
}
```

### 3. **JWT Tokens**
```typescript
const token = jwt.sign(payload, SECRET, { expiresIn: '5m' });
```

### 4. **HMAC Signature**
```typescript
const signature = crypto
  .createHmac('sha256', SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');
```

### 5. **Request Timestamps**
```typescript
timestamp: Date.now()
// Reject if > 5 minutes old
```

### 6. **IP Whitelist** (Optional)
```typescript
const allowedIPs = ['YOUR_LANDING_PAGE_IP'];
```

### 7. **Rate Limiting**
```typescript
// Max 100 requests per minute
```

## 🔄 Retry Mechanism

If sync fails, it automatically retries with exponential backoff:

### Retry Schedule:
```
Attempt 1: Immediate
Attempt 2: 5 minutes later
Attempt 3: 10 minutes later
Attempt 4: 20 minutes later
Attempt 5: 40 minutes later
After 5 failures: Admin alert sent
```

### Monitor Retry Queue:
```sql
-- Check pending retries
SELECT * FROM sync_retry_queue 
WHERE status = 'pending' 
ORDER BY next_retry_at;

-- Check failed syncs
SELECT * FROM sync_retry_queue 
WHERE retry_count >= 5;
```

### Manual Retry:
```typescript
// Call this from admin panel or cron job
import { processRetryQueue } from '@/lib/sync-to-main-app';

// Process all pending retries
await processRetryQueue();
```

## 📊 Monitoring & Logging

### View Sync Audit Logs:
```sql
SELECT 
  subscription_id,
  success,
  error,
  synced_at
FROM sync_audit_logs
ORDER BY synced_at DESC
LIMIT 100;
```

### Check Sync Success Rate:
```sql
SELECT 
  COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*) as success_rate
FROM sync_audit_logs
WHERE synced_at > NOW() - INTERVAL '24 hours';
```

### View Admin Alerts:
```sql
SELECT * FROM admin_alerts 
WHERE resolved = false 
ORDER BY created_at DESC;
```

## 🚨 Troubleshooting

### Issue: Sync Not Working

**Check 1: Environment Variables**
```typescript
console.log('MAIN_APP_URL:', process.env.MAIN_APP_URL);
console.log('MAIN_APP_API_KEY:', process.env.MAIN_APP_API_KEY?.substring(0, 10) + '...');
```

**Check 2: Main App Endpoint**
```bash
# Test if main app endpoint is reachable
curl -X POST http://localhost:3000/api/sync/subscription \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{"test": true}'
```

**Check 3: Retry Queue**
```sql
-- Check if requests are being queued
SELECT * FROM sync_retry_queue 
WHERE created_at > NOW() - INTERVAL '1 hour';
```

### Issue: Authentication Failing

**Solution:** Verify API keys match on both sides:
```env
# Landing Page
MAIN_APP_API_KEY=abc123xyz

# Main App
LANDING_PAGE_API_KEY=abc123xyz  # Must match!
```

### Issue: Duplicate Schools Created

**Solution:** Add idempotency check in main app:
```typescript
// Check if school already exists
const existing = await db.schools.findUnique({
  where: { email: subscriptionData.user_email }
});

if (existing) {
  // Update instead of create
  return updateSchool(existing.id, subscriptionData);
}
```

## 🔄 Data Flow Examples

### Example 1: Free Trial Signup
```
User fills trial form on landing page
         ↓
POST /api/trial/signup
         ↓
Create subscription in landing DB (status: 'trial')
         ↓
syncSubscriptionToMainApp() called
         ↓
POST https://main-app.com/api/sync/subscription
         ↓
Main app creates school account
         ↓
Main app sends welcome email
         ↓
Response sent to user
```

### Example 2: Paid Subscription
```
User completes payment on landing page
         ↓
Razorpay payment success
         ↓
POST /api/payment/verify
         ↓
Update subscription (status: 'active')
         ↓
syncSubscriptionToMainApp() called
         ↓
POST https://main-app.com/api/sync/subscription
         ↓
Main app activates paid features
         ↓
Main app sends invoice
         ↓
Payment success page shown
```

## 📱 Production Deployment

### 1. Update Environment Variables

**Landing Page (Vercel):**
```
MAIN_APP_URL=https://app.catalystwells.com
MAIN_APP_API_KEY=prod_secure_key_here
MAIN_APP_SECRET=prod_shared_secret_here
```

**Main App (Vercel):**
```
LANDING_PAGE_URL=https://www.catalystwells.com
LANDING_PAGE_API_KEY=prod_secure_key_here
LANDING_PAGE_SECRET=prod_shared_secret_here
```

### 2. Enable HTTPS Only

In `lib/security.ts`, enforce HTTPS:
```typescript
if (!url.startsWith('https://')) {
  throw new Error('Production requires HTTPS');
}
```

### 3. Set Up Monitoring

Use a service like Sentry or LogRocket to monitor sync failures:
```typescript
import * as Sentry from '@sentry/nextjs';

if (result.error) {
  Sentry.captureException(new Error('Sync failed'), {
    extra: { subscriptionId, error: result.error }
  });
}
```

### 4. Configure Cron Job

Set up a cron job to process retry queue every 5 minutes:

**Vercel Cron:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/process-sync-queue",
    "schedule": "*/5 * * * *"
  }]
}
```

**Cron Endpoint:**
```typescript
// app/api/cron/process-sync-queue/route.ts
import { processRetryQueue } from '@/lib/sync-to-main-app';

export async function GET(req: NextRequest) {
  // Verify cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await processRetryQueue();
  return NextResponse.json({ success: true });
}
```

## ✅ Checklist

Before going live:

- [ ] Main app sync endpoint created
- [ ] Environment variables configured (both apps)
- [ ] Sync tables created in landing page DB
- [ ] Security keys generated and matched
- [ ] Test free trial sync (dev environment)
- [ ] Test paid subscription sync (dev environment)
- [ ] Cron job configured for retry processing
- [ ] Monitoring/alerting set up
- [ ] HTTPS enforced in production
- [ ] Documentation shared with team

## 📞 Support

For sync-related issues:
1. Check `sync_audit_logs` table
2. Check `admin_alerts` table
3. Review Vercel deployment logs
4. Contact dev team with subscription ID

---

**The sync system is production-ready and includes automatic retry, logging, and alerting! 🚀**
