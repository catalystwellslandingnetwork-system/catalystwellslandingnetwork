# Payment System Setup Guide

This guide will help you set up the secure Razorpay payment integration with Supabase for Catalyst Wells.

## 🔒 Security Features

The payment system includes the following high-security measures:

- **Server-side payment verification** - All payment verification happens on the backend
- **Razorpay signature validation** - Cryptographic verification of all payments
- **Row Level Security (RLS)** - Database-level security policies
- **Input validation** - Email, phone, student count validation
- **IP logging** - Track all payment attempts
- **Webhook signature verification** - Secure webhook handling
- **Service role key separation** - Separate keys for public and admin operations
- **SSL encryption** - All data transmitted over HTTPS

## 📋 Prerequisites

1. **Supabase Account** - [Sign up at supabase.com](https://supabase.com)
2. **Razorpay Account** - [Sign up at razorpay.com](https://razorpay.com)
3. **Node.js** - Version 18 or higher

## 🚀 Setup Steps

### Step 1: Install Dependencies

```bash
npm install razorpay
```

This has been added to your project automatically.

### Step 2: Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL schema file: `payment-schema.sql`
4. This will create all necessary tables with RLS policies:
   - `subscriptions` - Store subscription data
   - `payment_transactions` - Track all payment transactions
   - `payment_webhook_logs` - Log webhook events

### Step 3: Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **KEEP THIS SECRET!**

### Step 4: Setup Razorpay

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Generate Test/Live API Keys
4. Copy the following:
   - `Key ID` → `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET` ⚠️ **KEEP THIS SECRET!**

### Step 5: Setup Razorpay Webhooks

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Click **+ Add Webhook**
3. Set the Webhook URL to: `https://yourdomain.com/api/payment/webhook`
4. Select the following events:
   - `payment.captured`
   - `payment.failed`
   - `subscription.charged`
   - `subscription.cancelled`
5. Copy the **Webhook Secret** → `RAZORPAY_WEBHOOK_SECRET` ⚠️ **KEEP THIS SECRET!**

### Step 6: Configure Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.local.example`)
2. Add all the credentials you collected:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

⚠️ **IMPORTANT**: Never commit `.env.local` to version control!

### Step 7: Test the Integration

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3004/pricing`

3. Click any "Start Your 30-Day Free Trial" button

4. Fill in the checkout form with test data

5. Use Razorpay test card details:
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

6. Complete the payment and verify you're redirected to the success page

## 🔄 Payment Flow

### User Journey

1. **Pricing Page** (`/pricing`)
   - User views pricing plans
   - Clicks "Start Your 30-Day Free Trial"

2. **Checkout Page** (`/checkout`)
   - User fills in school information
   - Selects plan and student count
   - Chooses billing cycle (monthly/yearly)
   - Clicks "Proceed to Secure Payment"

3. **Razorpay Payment Modal**
   - Secure payment form opens
   - User enters payment details
   - Payment is processed

4. **Backend Verification** (`/api/payment/verify`)
   - Server verifies Razorpay signature
   - Creates subscription record
   - Updates payment status

5. **Success Page** (`/checkout/success`)
   - Displays subscription details
   - Shows trial information
   - Provides next steps

### Backend Flow

```
┌─────────────────┐
│ User clicks CTA │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│ /checkout page   │
│ User fills form  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ POST /api/payment/       │
│ create-order             │
│ - Validates input        │
│ - Creates Razorpay order │
│ - Creates subscription   │
│ - Creates transaction    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Razorpay Payment Modal   │
│ User completes payment   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ POST /api/payment/verify │
│ - Verifies signature     │
│ - Updates transaction    │
│ - Activates subscription │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ /checkout/success        │
│ Display confirmation     │
└──────────────────────────┘
```

## 🗄️ Database Schema

### subscriptions
Stores all subscription information including trial and billing details.

### payment_transactions
Tracks every payment transaction with full audit trail including IP addresses.

### payment_webhook_logs
Logs all webhook events from Razorpay for debugging and compliance.

## 🔐 Security Best Practices

### Environment Variables
- ✅ Keep all secrets in `.env.local`
- ✅ Never commit `.env.local` to git
- ✅ Use different keys for test and production
- ✅ Rotate keys regularly

### API Routes
- ✅ All payment routes are server-side only
- ✅ Signature verification on all Razorpay responses
- ✅ Input validation on all user data
- ✅ IP and user agent logging

### Database
- ✅ Row Level Security (RLS) enabled
- ✅ Service role key used only on backend
- ✅ Public key has limited permissions
- ✅ Webhook logs are service-role only

### Payment Processing
- ✅ No credit card data touches your server
- ✅ PCI compliance handled by Razorpay
- ✅ SSL encryption for all requests
- ✅ Webhook signature verification

## 🧪 Testing

### Test Mode
Use Razorpay test keys to test without real money:

**Test Card Numbers:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Test Webhooks
Use [ngrok](https://ngrok.com) for local webhook testing:

```bash
ngrok http 3004
```

Then update webhook URL in Razorpay to: `https://your-ngrok-url.ngrok.io/api/payment/webhook`

## 📊 Monitoring

### View Subscriptions
Query Supabase to see all subscriptions:
```sql
SELECT * FROM subscriptions ORDER BY created_at DESC;
```

### View Transactions
```sql
SELECT * FROM payment_transactions ORDER BY created_at DESC;
```

### View Active Trials
```sql
SELECT * FROM active_subscriptions WHERE status = 'trial';
```

### Check Webhook Logs
```sql
SELECT * FROM payment_webhook_logs ORDER BY created_at DESC;
```

## 🚨 Troubleshooting

### Payment Creation Fails
1. Check Razorpay API keys are correct
2. Verify Supabase service role key
3. Check console logs for validation errors

### Signature Verification Fails
1. Ensure `RAZORPAY_KEY_SECRET` is correct
2. Check order_id and payment_id match
3. Verify no data corruption in transit

### Webhooks Not Working
1. Check webhook URL is correct
2. Verify webhook secret matches
3. Check webhook logs in Supabase
4. Ensure webhook events are selected in Razorpay

### Database Errors
1. Run the schema file again
2. Check RLS policies are enabled
3. Verify service role key permissions

## 📞 Support

For issues or questions:
- Razorpay Support: [support.razorpay.com](https://support.razorpay.com)
- Supabase Support: [supabase.com/support](https://supabase.com/support)

## ✅ Production Checklist

Before going live:

- [ ] Switch to Razorpay Live API keys
- [ ] Update webhook URL to production domain
- [ ] Test payment flow end-to-end
- [ ] Enable SSL certificate on domain
- [ ] Review RLS policies
- [ ] Setup error monitoring (e.g., Sentry)
- [ ] Configure email notifications
- [ ] Test webhook delivery
- [ ] Setup database backups
- [ ] Review rate limiting
- [ ] Add payment receipts/invoices
- [ ] Setup customer support email

## 📝 Next Steps

1. Run `npm install razorpay` if not already done
2. Execute `payment-schema.sql` in Supabase SQL Editor
3. Configure environment variables in `.env.local`
4. Test the checkout flow
5. Setup webhooks in production
6. Monitor transactions in Supabase dashboard
