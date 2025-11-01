# 🚀 Quick Start: Ultra-Secure Payment Integration

## ✅ What Has Been Created

### 1. Payment System (Razorpay)
- ✅ Checkout page with plan selection (`/checkout`)
- ✅ Payment success page (`/checkout/success`)
- ✅ Secure API routes for payment processing
- ✅ Webhook handler for Razorpay events
- ✅ Database schema for payments and subscriptions

### 2. Security Architecture (7-Layer Defense)
- ✅ IP Whitelisting
- ✅ API Key Authentication
- ✅ JWT Token Validation
- ✅ HMAC Request Signing
- ✅ AES-256-GCM Encryption
- ✅ Comprehensive Audit Logging
- ✅ Rate Limiting Ready

### 3. Database Integration
- ✅ Secure sync library for main app communication
- ✅ Retry queue for failed syncs
- ✅ Admin alert system

## 📋 Next Steps (In Order)

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- `razorpay` - Payment processing
- `jsonwebtoken` - JWT token generation
- `@types/jsonwebtoken` - TypeScript types

### Step 2: Setup Supabase Database

1. Go to your Supabase project
2. Open SQL Editor
3. Run **payment-schema.sql** (creates payment tables)
4. Optional: Run additional table for sync queue:

```sql
-- Retry queue for failed syncs
CREATE TABLE IF NOT EXISTS sync_retry_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL,
  data JSONB NOT NULL,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending',
  last_error TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync audit logs
CREATE TABLE IF NOT EXISTS sync_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL,
  success BOOLEAN,
  error TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin alerts
CREATE TABLE IF NOT EXISTS admin_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  details JSONB,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sync_retry_status ON sync_retry_queue(status, next_retry_at);
CREATE INDEX idx_sync_audit_subscription ON sync_audit_logs(subscription_id);
CREATE INDEX idx_admin_alerts_resolved ON admin_alerts(resolved);
```

### Step 3: Generate Security Secrets

Run this command to generate all required secrets:
```bash
node -e "const crypto = require('crypto'); console.log('INTER_SERVICE_API_SECRET=' + crypto.randomBytes(32).toString('hex')); console.log('INTER_SERVICE_JWT_SECRET=' + crypto.randomBytes(32).toString('hex')); console.log('REQUEST_SIGNING_SECRET=' + crypto.randomBytes(32).toString('hex')); console.log('DATA_ENCRYPTION_KEY=' + crypto.randomBytes(32).toString('hex'));"
```

### Step 4: Configure Environment Variables

Update your `.env.local` file with:

```bash
# Supabase (get from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay (get from Razorpay dashboard)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Main App URL (update when you have main app)
MAIN_APP_URL=https://app.catalystwells.com

# Security Secrets (paste from Step 3)
ALLOWED_IPS=127.0.0.1,::1
INTER_SERVICE_API_SECRET=paste_generated_secret
INTER_SERVICE_API_KEY_ID=landing_page_v1
INTER_SERVICE_JWT_SECRET=paste_generated_secret
REQUEST_SIGNING_SECRET=paste_generated_secret
DATA_ENCRYPTION_KEY=paste_generated_secret
```

### Step 5: Restart Dev Server
```bash
npm run dev
```

### Step 6: Test the Flow

1. Go to `http://localhost:3004/pricing`
2. Click "Start Your 30-Day Free Trial"
3. Fill in the checkout form
4. Use Razorpay test card: `4111 1111 1111 1111`
5. Complete payment
6. Verify redirect to success page

## 🔐 For Main Application Setup

When you're ready to connect the main app, create this API endpoint:

**File: `main-app/app/api/sync/subscription/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateSecureRequest } from '@/lib/security'; // Copy security.ts to main app

export async function POST(req: NextRequest) {
  // Validate all 7 security layers
  const validation = await validateSecureRequest(req);
  
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 401 });
  }
  
  const subscriptionData = validation.data;
  
  // Create/update school in your main database
  const school = await prisma.school.upsert({
    where: { email: subscriptionData.user_email },
    create: {
      email: subscriptionData.user_email,
      name: subscriptionData.school_name,
      phone: subscriptionData.phone,
      subscription_plan: subscriptionData.plan_name,
      student_limit: subscriptionData.student_count,
      trial_end_date: subscriptionData.trial_end_date,
    },
    update: {
      subscription_plan: subscriptionData.plan_name,
      student_limit: subscriptionData.student_count,
      trial_end_date: subscriptionData.trial_end_date,
    },
  });
  
  return NextResponse.json({ success: true, school_id: school.id });
}
```

## 📚 Important Files

- **SECURITY_ARCHITECTURE.md** - Complete security documentation
- **PAYMENT_SETUP.md** - Payment integration guide
- **payment-schema.sql** - Database schema for payments
- **lib/security.ts** - Security utilities (7 layers)
- **lib/sync-to-main-app.ts** - Sync logic with retry
- **app/checkout/page.tsx** - Checkout page
- **app/checkout/success/page.tsx** - Success page
- **app/api/payment/** - Payment API routes

## 🔒 Security Features Implemented

✅ **Network Layer**
- IP whitelisting
- DDoS protection ready

✅ **Authentication**
- API key validation
- JWT tokens (5-min expiry)
- Request signatures

✅ **Data Protection**
- AES-256-GCM encryption
- HTTPS only
- PCI compliance via Razorpay

✅ **Database Security**
- Row Level Security (RLS)
- Service role separation
- Encrypted sensitive data

✅ **Monitoring**
- Comprehensive audit logs
- Failed sync retry queue
- Admin alerts

✅ **Resilience**
- Automatic retry with exponential backoff
- Non-blocking sync
- Error recovery

## ⚠️ Current Status

**FOR TESTING WITHOUT MAIN APP:**
The payment flow works independently. Sync to main app will fail gracefully and queue for retry until you set up the main app endpoint.

**TO FULLY ACTIVATE:**
1. Set up main app API endpoint
2. Configure `MAIN_APP_URL` in `.env.local`
3. Copy same security secrets to main app
4. Deploy both applications

## 🎯 Summary

You now have:
- ✅ Complete payment system with Razorpay
- ✅ Military-grade 7-layer security
- ✅ Secure database sync architecture
- ✅ Beautiful checkout UI matching your design
- ✅ 30-day trial for 75 students
- ✅ Automatic retry on failures
- ✅ Comprehensive audit trail

**Next:** Run `npm install` and configure your environment variables!
