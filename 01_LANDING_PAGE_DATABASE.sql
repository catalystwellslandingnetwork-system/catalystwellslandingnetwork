-- ============================================
-- LANDING PAGE DATABASE - COMPLETE SETUP
-- Run this in your Landing Page Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CREATE PAYMENT & SUBSCRIPTION TABLES
-- ============================================

-- Subscriptions table
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

-- Payment transactions table
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
  
  -- Customer details
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

-- Payment webhook logs table
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
-- STEP 2: CREATE SYNC TABLES (For Main App Communication)
-- ============================================

-- Retry queue for failed syncs to main app
CREATE TABLE IF NOT EXISTS sync_retry_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL,
  data JSONB NOT NULL,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  last_error TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync audit logs
CREATE TABLE IF NOT EXISTS sync_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL,
  success BOOLEAN NOT NULL,
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

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
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

-- Sync retry queue indexes
CREATE INDEX IF NOT EXISTS idx_sync_retry_status ON sync_retry_queue(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_sync_retry_subscription ON sync_retry_queue(subscription_id);

-- Sync audit logs indexes
CREATE INDEX IF NOT EXISTS idx_sync_audit_subscription ON sync_audit_logs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sync_audit_created ON sync_audit_logs(synced_at DESC);

-- Admin alerts indexes
CREATE INDEX IF NOT EXISTS idx_admin_alerts_resolved ON admin_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_created ON admin_alerts(created_at DESC);

-- ============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_retry_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================

-- Subscriptions policies
DROP POLICY IF EXISTS "Service role full access to subscriptions" ON subscriptions;
CREATE POLICY "Service role full access to subscriptions" 
  ON subscriptions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Payment transactions policies
DROP POLICY IF EXISTS "Service role full access to transactions" ON payment_transactions;
CREATE POLICY "Service role full access to transactions" 
  ON payment_transactions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Webhook logs policies
DROP POLICY IF EXISTS "Service role full access to webhook logs" ON payment_webhook_logs;
CREATE POLICY "Service role full access to webhook logs" 
  ON payment_webhook_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Sync retry queue policies
DROP POLICY IF EXISTS "Service role full access to sync retry queue" ON sync_retry_queue;
CREATE POLICY "Service role full access to sync retry queue" 
  ON sync_retry_queue FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Sync audit logs policies
DROP POLICY IF EXISTS "Service role full access to sync audit" ON sync_audit_logs;
CREATE POLICY "Service role full access to sync audit" 
  ON sync_audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Admin alerts policies
DROP POLICY IF EXISTS "Service role full access to admin alerts" ON admin_alerts;
CREATE POLICY "Service role full access to admin alerts" 
  ON admin_alerts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- STEP 6: CREATE TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 7: CREATE VIEWS FOR ANALYTICS
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

-- Failed syncs view
CREATE OR REPLACE VIEW failed_syncs AS
SELECT 
  sq.id,
  sq.subscription_id,
  sq.retry_count,
  sq.last_error,
  sq.next_retry_at,
  s.user_email,
  s.school_name
FROM sync_retry_queue sq
LEFT JOIN subscriptions s ON sq.subscription_id = s.id
WHERE sq.status = 'pending' AND sq.retry_count > 0
ORDER BY sq.next_retry_at ASC;

-- ============================================
-- STEP 8: GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON active_subscriptions TO service_role;
GRANT SELECT ON payment_summary TO service_role;
GRANT SELECT ON failed_syncs TO service_role;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify setup:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%subscript%' OR tablename LIKE '%payment%' OR tablename LIKE '%sync%';
-- SELECT * FROM active_subscriptions;
-- SELECT * FROM payment_summary;
-- SELECT * FROM failed_syncs;

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
-- Next steps:
-- 1. Configure environment variables in .env.local
-- 2. Run npm install
-- 3. Test the payment flow
-- ============================================
