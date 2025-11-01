-- ============================================
-- Catalyst Wells - Payment & Subscription Schema
-- ============================================
-- This file contains SQL commands for payment tracking
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  school_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  plan_price DECIMAL(10, 2) NOT NULL,
  student_count INTEGER NOT NULL,
  billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  
  -- Subscription status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'trial')),
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  
  -- Payment tracking
  razorpay_subscription_id VARCHAR(255) UNIQUE,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  
  -- Razorpay details
  razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_signature VARCHAR(500),
  
  -- Transaction details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  
  -- Customer details (encrypted/hashed in production)
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  
  -- Timestamps
  attempted_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  
  -- Security
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CREATE PAYMENT WEBHOOKS LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  razorpay_event_id VARCHAR(255),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================
-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_id ON subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created ON subscriptions(created_at DESC);

-- Payment transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON payment_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON payment_transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_id ON payment_transactions(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_email ON payment_transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON payment_transactions(created_at DESC);

-- Webhook logs indexes
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON payment_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed ON payment_webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON payment_webhook_logs(created_at DESC);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhook_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CREATE RLS POLICIES - SUBSCRIPTIONS
-- ============================================
-- Allow authenticated users to read their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (user_email = auth.jwt() ->> 'email');

-- Allow service role full access
CREATE POLICY "Service role full access to subscriptions" 
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 7. CREATE RLS POLICIES - PAYMENT TRANSACTIONS
-- ============================================
-- Allow authenticated users to read their own transactions
CREATE POLICY "Users can view own transactions" 
  ON payment_transactions
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

-- Allow service role full access
CREATE POLICY "Service role full access to transactions" 
  ON payment_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 8. CREATE RLS POLICIES - WEBHOOK LOGS
-- ============================================
-- Only service role can access webhook logs
CREATE POLICY "Service role full access to webhook logs" 
  ON payment_webhook_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 9. CREATE TRIGGERS FOR AUTO-UPDATE
-- ============================================
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. CREATE VIEWS FOR ANALYTICS
-- ============================================
-- Active subscriptions view
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT 
  s.id,
  s.user_email,
  s.school_name,
  s.plan_name,
  s.plan_price,
  s.student_count,
  s.status,
  s.subscription_start_date,
  s.subscription_end_date,
  s.next_billing_date,
  COUNT(pt.id) as total_payments,
  SUM(CASE WHEN pt.status = 'paid' THEN pt.amount ELSE 0 END) as total_revenue
FROM subscriptions s
LEFT JOIN payment_transactions pt ON s.id = pt.subscription_id
WHERE s.status IN ('active', 'trial')
GROUP BY s.id;

-- Payment summary view
CREATE OR REPLACE VIEW payment_summary AS
SELECT 
  DATE(created_at) as payment_date,
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN status = 'paid' THEN 1 END) as successful_payments,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_revenue,
  currency
FROM payment_transactions
GROUP BY DATE(created_at), currency
ORDER BY payment_date DESC;

-- ============================================
-- 11. GRANT PERMISSIONS ON VIEWS
-- ============================================
GRANT SELECT ON active_subscriptions TO authenticated;
GRANT SELECT ON payment_summary TO authenticated;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
