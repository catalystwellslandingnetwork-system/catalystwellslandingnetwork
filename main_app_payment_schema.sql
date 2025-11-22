-- ============================================
-- MAIN APP DATABASE - PAYMENT COLUMNS SCHEMA
-- ============================================
-- Run this in your MAIN APP's Supabase database (NOT the landing page)
-- This adds all payment and subscription columns to the schools table

-- ============================================
-- 1. ADD PAYMENT & SUBSCRIPTION COLUMNS
-- ============================================

-- Subscription Status & Plan
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
  ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';

-- Capacity Limits
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS student_limit INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS user_limit INTEGER DEFAULT 0;

-- Date Tracking
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMPTZ;

-- Payment Information
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'inactive';

-- ============================================
-- 2. ADD CONSTRAINTS
-- ============================================

-- Subscription Status Constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_subscription_status'
  ) THEN
    ALTER TABLE schools
      ADD CONSTRAINT valid_subscription_status 
      CHECK (subscription_status IN ('inactive', 'trial', 'active', 'expired', 'cancelled'));
  END IF;
END $$;

-- Payment Status Constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_payment_status'
  ) THEN
    ALTER TABLE schools
      ADD CONSTRAINT valid_payment_status 
      CHECK (payment_status IN ('inactive', 'active', 'overdue', 'failed', 'suspended'));
  END IF;
END $$;

-- Plan Type Constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_plan_type'
  ) THEN
    ALTER TABLE schools
      ADD CONSTRAINT valid_plan_type 
      CHECK (plan_type IN ('free', 'basic', 'premium'));
  END IF;
END $$;

-- ============================================
-- 3. ADD INDEXES FOR PERFORMANCE
-- ============================================

-- Index on subscription status for access control queries
CREATE INDEX IF NOT EXISTS idx_schools_subscription_status 
  ON schools(subscription_status);

-- Index on payment status for billing queries
CREATE INDEX IF NOT EXISTS idx_schools_payment_status 
  ON schools(payment_status);

-- Index on next billing date for renewal reminders
CREATE INDEX IF NOT EXISTS idx_schools_next_billing_date 
  ON schools(next_billing_date) 
  WHERE next_billing_date IS NOT NULL;

-- Index on Razorpay ID for payment lookups
CREATE INDEX IF NOT EXISTS idx_schools_razorpay_id 
  ON schools(razorpay_subscription_id) 
  WHERE razorpay_subscription_id IS NOT NULL;

-- Index on trial end date for trial expiry checks
CREATE INDEX IF NOT EXISTS idx_schools_trial_end_date 
  ON schools(trial_end_date) 
  WHERE trial_end_date IS NOT NULL;

-- Composite index for active subscriptions
CREATE INDEX IF NOT EXISTS idx_schools_active_subscriptions 
  ON schools(subscription_status, payment_status) 
  WHERE subscription_status IN ('active', 'trial');

-- ============================================
-- 4. ADD COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN schools.subscription_status IS 'Current subscription status: inactive, trial, active, expired, cancelled';
COMMENT ON COLUMN schools.subscription_plan IS 'Name of the subscribed plan (e.g., Catalyst AI Pro)';
COMMENT ON COLUMN schools.plan_type IS 'Plan tier: free, basic, premium';
COMMENT ON COLUMN schools.student_limit IS 'Maximum number of students allowed';
COMMENT ON COLUMN schools.user_limit IS 'Maximum number of staff/users allowed';
COMMENT ON COLUMN schools.trial_end_date IS 'When the trial period ends (NULL for paid subscriptions)';
COMMENT ON COLUMN schools.subscription_start_date IS 'When the subscription started';
COMMENT ON COLUMN schools.subscription_end_date IS 'When the subscription will end';
COMMENT ON COLUMN schools.next_billing_date IS 'Date of next billing cycle';
COMMENT ON COLUMN schools.last_payment_date IS 'Date of last successful payment';
COMMENT ON COLUMN schools.payment_due_date IS 'Date when payment is due';
COMMENT ON COLUMN schools.razorpay_subscription_id IS 'Razorpay payment/subscription ID for reference';
COMMENT ON COLUMN schools.monthly_fee IS 'Monthly subscription fee in INR';
COMMENT ON COLUMN schools.payment_status IS 'Current payment status: inactive, active, overdue, failed, suspended';

-- ============================================
-- 5. CREATE HELPER VIEWS (OPTIONAL)
-- ============================================

-- View: Active paid subscriptions
CREATE OR REPLACE VIEW active_paid_schools AS
SELECT 
  id,
  name,
  email,
  subscription_plan,
  student_limit,
  monthly_fee,
  subscription_start_date,
  next_billing_date,
  last_payment_date
FROM schools
WHERE subscription_status = 'active'
  AND payment_status = 'active'
ORDER BY subscription_start_date DESC;

-- View: Subscriptions expiring soon (within 7 days)
CREATE OR REPLACE VIEW subscriptions_expiring_soon AS
SELECT 
  id,
  name,
  email,
  subscription_plan,
  next_billing_date,
  monthly_fee,
  (next_billing_date - CURRENT_DATE) as days_until_billing
FROM schools
WHERE subscription_status = 'active'
  AND next_billing_date IS NOT NULL
  AND next_billing_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY next_billing_date ASC;

-- View: Trial subscriptions
CREATE OR REPLACE VIEW trial_subscriptions AS
SELECT 
  id,
  name,
  email,
  trial_end_date,
  (trial_end_date - CURRENT_DATE) as days_remaining,
  student_limit
FROM schools
WHERE subscription_status = 'trial'
  AND trial_end_date IS NOT NULL
ORDER BY trial_end_date ASC;

-- View: Overdue payments
CREATE OR REPLACE VIEW overdue_payments AS
SELECT 
  id,
  name,
  email,
  subscription_plan,
  monthly_fee,
  next_billing_date,
  (CURRENT_DATE - next_billing_date) as days_overdue
FROM schools
WHERE payment_status IN ('overdue', 'failed')
  AND next_billing_date < CURRENT_DATE
ORDER BY next_billing_date ASC;

-- ============================================
-- 6. CREATE HELPER FUNCTIONS (OPTIONAL)
-- ============================================

-- Function: Check if school has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(school_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM schools
    WHERE id = school_uuid
      AND subscription_status IN ('active', 'trial')
      AND payment_status = 'active'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get days until billing
CREATE OR REPLACE FUNCTION days_until_billing(school_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  billing_date TIMESTAMPTZ;
BEGIN
  SELECT next_billing_date INTO billing_date
  FROM schools
  WHERE id = school_uuid;
  
  IF billing_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN (billing_date::DATE - CURRENT_DATE);
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get subscription summary
CREATE OR REPLACE FUNCTION get_subscription_summary()
RETURNS TABLE (
  total_schools BIGINT,
  active_subscriptions BIGINT,
  trial_subscriptions BIGINT,
  expired_subscriptions BIGINT,
  total_monthly_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_schools,
    COUNT(*) FILTER (WHERE subscription_status = 'active')::BIGINT as active_subscriptions,
    COUNT(*) FILTER (WHERE subscription_status = 'trial')::BIGINT as trial_subscriptions,
    COUNT(*) FILTER (WHERE subscription_status = 'expired')::BIGINT as expired_subscriptions,
    SUM(monthly_fee) FILTER (WHERE subscription_status = 'active') as total_monthly_revenue
  FROM schools;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 7. SET DEFAULT VALUES FOR EXISTING SCHOOLS
-- ============================================

-- Update existing schools with default values
UPDATE schools
SET 
  subscription_status = COALESCE(subscription_status, 'inactive'),
  plan_type = COALESCE(plan_type, 'free'),
  student_limit = COALESCE(student_limit, 0),
  user_limit = COALESCE(user_limit, 0),
  monthly_fee = COALESCE(monthly_fee, 0),
  payment_status = COALESCE(payment_status, 'inactive')
WHERE subscription_status IS NULL 
   OR plan_type IS NULL 
   OR student_limit IS NULL;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if all columns were added successfully
DO $$
DECLARE
  missing_columns TEXT[];
BEGIN
  SELECT ARRAY_AGG(column_name)
  INTO missing_columns
  FROM (
    VALUES 
      ('subscription_status'),
      ('subscription_plan'),
      ('plan_type'),
      ('student_limit'),
      ('user_limit'),
      ('trial_end_date'),
      ('subscription_start_date'),
      ('next_billing_date'),
      ('last_payment_date'),
      ('razorpay_subscription_id'),
      ('monthly_fee'),
      ('payment_status')
  ) AS expected(column_name)
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schools'
      AND column_name = expected.column_name
  );
  
  IF missing_columns IS NOT NULL THEN
    RAISE EXCEPTION 'Missing columns: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE '✅ All payment columns added successfully!';
  END IF;
END $$;

-- Display summary of changes
SELECT 
  'Payment Schema Setup Complete' as status,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'schools' AND column_name LIKE '%subscription%' OR column_name LIKE '%payment%') as payment_columns_added,
  (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'schools' AND indexname LIKE 'idx_schools_%') as indexes_created,
  (SELECT COUNT(*) FROM pg_constraint WHERE conname LIKE 'valid_%') as constraints_added;

-- Show sample data structure
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'schools'
  AND (
    column_name LIKE '%subscription%' OR 
    column_name LIKE '%payment%' OR 
    column_name LIKE '%trial%' OR
    column_name IN ('student_limit', 'user_limit', 'razorpay_subscription_id', 'monthly_fee')
  )
ORDER BY ordinal_position;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Main App Payment Schema Setup Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Added 12 payment-related columns';
  RAISE NOTICE '✅ Created 6 performance indexes';
  RAISE NOTICE '✅ Added 3 data constraints';
  RAISE NOTICE '✅ Created 4 helper views';
  RAISE NOTICE '✅ Created 3 helper functions';
  RAISE NOTICE '';
  RAISE NOTICE 'Your main app is now ready to accept payments!';
  RAISE NOTICE 'Configure your .env file with MAIN_APP_SUPABASE_* credentials.';
  RAISE NOTICE '========================================';
END $$;
