# How to Get Your Supabase Credentials

## Step 1: Go to Supabase Dashboard
Visit: https://app.supabase.com/

## Step 2: Select/Create Your Project
- If you don't have a project, create one
- Click on your project name

## Step 3: Get Your Credentials

### Navigate to: Settings → API

You'll find three important values:

### 1. Project URL
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
```

### 2. Anon/Public Key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Service Role Key (Secret!)
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Update Your .env.local

Replace the placeholder values in your `.env.local` file:

```env
# Razorpay Test Mode Credentials
RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy
RAZORPAY_KEY_SECRET=kSWSRi4nqmub7bMSiusGGKLx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy

# Supabase Configuration - ADD YOUR REAL VALUES HERE
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

## Step 5: Create Required Tables

Run this SQL in Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  school_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_price NUMERIC NOT NULL,
  student_count INTEGER NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly',
  status TEXT DEFAULT 'pending',
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  razorpay_subscription_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id),
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created',
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
```

## Step 6: Restart Your Dev Server

```bash
npm run dev
```

## Troubleshooting

**Error: "fetch failed"**
- Make sure NEXT_PUBLIC_SUPABASE_URL starts with `https://`
- Check that all keys are copied correctly (no extra spaces)
- Verify your Supabase project is active

**Error: "relation does not exist"**
- Run the SQL queries in Step 5 to create tables
- Make sure you're connected to the correct Supabase project

**Error: "Invalid API key"**
- Double-check you copied the correct keys from Supabase dashboard
- Make sure you're using the Service Role Key (not the JWT secret)
