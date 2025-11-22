-- ============================================
-- LANDING PAGE DATABASE - PAYMENT & SUBSCRIPTION SCHEMA
-- ============================================
-- Run this in your LANDING PAGE's Supabase database
-- This stores payment transactions and subscription records

-- ============================================
-- 1. SUBSCRIPTIONS TABLE
-- ============================================
-- Tracks subscription states and payment references

CREATE TABLE IF NOT EXISTS subscriptions (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Reference to main app (kept as school_id for compatibility)
    school_id UUID NOT NULL,
    
    -- Contact information
    user_email TEXT NOT NULL,
    phone TEXT,
    
    -- Plan details
    plan_name TEXT NOT NULL,
    plan_price NUMERIC(10,2) NOT NULL,
    billing_cycle TEXT DEFAULT 'monthly',
    
    -- Subscription status
    status TEXT NOT NULL DEFAULT 'pending',
    
    -- Date tracking
    subscription_start_date TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    
    -- Payment integration
    razorpay_subscription_id TEXT,
    
    -- Metadata for additional tracking
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'trial', 'expired', 'cancelled')),
    CONSTRAINT valid_price CHECK (plan_price >= 0),
    CONSTRAINT valid_billing_cycle CHECK (billing_cycle IN ('monthly', 'yearly'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_school_id ON subscriptions(school_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_email ON subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_id ON subscriptions(razorpay_subscription_id) 
    WHERE razorpay_subscription_id IS NOT NULL;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. PAYMENT TRANSACTIONS TABLE
-- ============================================
-- Tracks ALL payment attempts with full audit trail

CREATE TABLE IF NOT EXISTS payment_transactions (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to subscription (optional)
    subscription_id UUID,
    
    -- School reference from main app
    school_id UUID NOT NULL,
    
    -- Razorpay tracking
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    
    -- Transaction details
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created',
    
    -- Customer information
    customer_email TEXT,
    customer_phone TEXT,
    
    -- Security & Audit
    ip_address INET,
    user_agent TEXT,
    request_origin TEXT,
    
    -- Verification details
    signature_verified BOOLEAN DEFAULT FALSE,
    verification_timestamp TIMESTAMPTZ,
    verification_ip INET,
    verification_details JSONB,
    
    -- Failure tracking
    failure_reason TEXT,
    failure_code TEXT,
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMPTZ,
    
    -- Status timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT valid_txn_status CHECK (status IN ('created', 'pending', 'paid', 'failed', 'refunded', 'cancelled')),
    CONSTRAINT valid_amount CHECK (amount >= 0),
    CONSTRAINT paid_requires_payment_id CHECK (
        (status != 'paid') OR 
        (status = 'paid' AND razorpay_payment_id IS NOT NULL AND signature_verified = TRUE)
    )
);

-- Indexes for payment transactions
CREATE INDEX IF NOT EXISTS idx_payment_txn_subscription ON payment_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_txn_school_id ON payment_transactions(school_id);
CREATE INDEX IF NOT EXISTS idx_payment_txn_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_txn_created_at ON payment_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_txn_razorpay_order ON payment_transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_txn_razorpay_payment ON payment_transactions(razorpay_payment_id) 
    WHERE razorpay_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payment_txn_email ON payment_transactions(customer_email) 
    WHERE customer_email IS NOT NULL;

-- Updated at trigger
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at 
    BEFORE UPDATE ON payment_transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. PAYMENT VERIFICATION LOG
-- ============================================
-- Logs ALL verification attempts for security auditing

CREATE TABLE IF NOT EXISTS payment_verification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Transaction reference
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    
    -- Verification result
    verification_status TEXT NOT NULL,
    signature_valid BOOLEAN,
    expected_signature TEXT,
    received_signature TEXT,
    
    -- Request details
    request_ip INET,
    request_user_agent TEXT,
    request_origin TEXT,
    request_timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Error details (if failed)
    error_message TEXT,
    error_code TEXT,
    
    -- Security flags
    suspicious_activity BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    
    -- Additional context
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_verification_status CHECK (
        verification_status IN ('success', 'failed', 'invalid_signature', 'missing_data', 'error')
    )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_verification_log_order ON payment_verification_log(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_verification_log_payment ON payment_verification_log(razorpay_payment_id) 
    WHERE razorpay_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_verification_log_timestamp ON payment_verification_log(request_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_verification_log_status ON payment_verification_log(verification_status);

-- ============================================
-- 4. TRIAL ACTIVATIONS
-- ============================================
-- Tracks trial activations and conversions

CREATE TABLE IF NOT EXISTS trial_activations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- School reference from main app
    school_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    
    -- Trial details
    trial_start_date TIMESTAMPTZ NOT NULL,
    trial_end_date TIMESTAMPTZ NOT NULL,
    trial_extended BOOLEAN DEFAULT FALSE,
    
    -- Conversion tracking
    converted_to_paid BOOLEAN DEFAULT FALSE,
    converted_at TIMESTAMPTZ,
    converted_subscription_id UUID,
    
    -- Source tracking
    source TEXT,
    campaign TEXT,
    medium TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trial_school_id ON trial_activations(school_id);
CREATE INDEX IF NOT EXISTS idx_trial_email ON trial_activations(user_email);
CREATE INDEX IF NOT EXISTS idx_trial_converted ON trial_activations(converted_to_paid);
CREATE INDEX IF NOT EXISTS idx_trial_end_date ON trial_activations(trial_end_date);

-- ============================================
-- 5. SUBSCRIPTION SYNC LOG
-- ============================================
-- Tracks synchronization with external systems

CREATE TABLE IF NOT EXISTS subscription_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Reference
    subscription_id UUID,
    school_id UUID NOT NULL,
    
    -- Sync details
    sync_type TEXT NOT NULL,  -- 'create', 'update', 'cancel'
    sync_status TEXT NOT NULL, -- 'pending', 'success', 'failed'
    sync_message TEXT,
    
    -- Request/Response
    request_payload JSONB,
    response_payload JSONB,
    
    -- Error tracking
    error_message TEXT,
    error_details JSONB,
    
    -- Retry tracking
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    attempted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT fk_sync_subscription FOREIGN KEY (subscription_id) 
        REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT valid_sync_type CHECK (sync_type IN ('create', 'update', 'cancel')),
    CONSTRAINT valid_sync_status CHECK (sync_status IN ('pending', 'success', 'failed', 'retrying'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sync_log_subscription ON subscription_sync_log(subscription_id) 
    WHERE subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sync_log_school ON subscription_sync_log(school_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON subscription_sync_log(sync_status);
CREATE INDEX IF NOT EXISTS idx_sync_log_attempted_at ON subscription_sync_log(attempted_at DESC);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS for security

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_verification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_sync_log ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (bypass RLS)
-- These policies allow service_role key to access all data

CREATE POLICY "Service role can read subscriptions"
    ON subscriptions FOR SELECT
    USING (true);

CREATE POLICY "Service role can insert subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions"
    ON subscriptions FOR UPDATE
    USING (true);

CREATE POLICY "Service role can read payment_transactions"
    ON payment_transactions FOR SELECT
    USING (true);

CREATE POLICY "Service role can insert payment_transactions"
    ON payment_transactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update payment_transactions"
    ON payment_transactions FOR UPDATE
    USING (true);

CREATE POLICY "Service role can insert verification_log"
    ON payment_verification_log FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can read verification_log"
    ON payment_verification_log FOR SELECT
    USING (true);

CREATE POLICY "Service role can insert trial_activations"
    ON trial_activations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can read trial_activations"
    ON trial_activations FOR SELECT
    USING (true);

CREATE POLICY "Service role can update trial_activations"
    ON trial_activations FOR UPDATE
    USING (true);

CREATE POLICY "Service role can do anything with sync_log"
    ON subscription_sync_log FOR ALL
    USING (true);

-- ============================================
-- 6.5 ADD FOREIGN KEY CONSTRAINTS
-- ============================================
-- Add foreign keys after all tables are created

-- Add foreign key from payment_transactions to subscriptions
ALTER TABLE payment_transactions
DROP CONSTRAINT IF EXISTS fk_payment_txn_subscription;

ALTER TABLE payment_transactions
ADD CONSTRAINT fk_payment_txn_subscription 
FOREIGN KEY (subscription_id) 
REFERENCES subscriptions(id) 
ON DELETE SET NULL;

-- Add foreign key from subscription_sync_log to subscriptions
ALTER TABLE subscription_sync_log
DROP CONSTRAINT IF EXISTS fk_sync_log_subscription;

ALTER TABLE subscription_sync_log
ADD CONSTRAINT fk_sync_log_subscription 
FOREIGN KEY (subscription_id) 
REFERENCES subscriptions(id) 
ON DELETE CASCADE;

-- ============================================
-- 7. HELPER VIEWS
-- ============================================

-- View: Active subscriptions summary
CREATE OR REPLACE VIEW active_subscriptions_summary AS
SELECT 
    s.id,
    s.school_id,
    s.user_email,
    s.plan_name,
    s.status,
    s.subscription_start_date,
    s.next_billing_date,
    COUNT(pt.id) as total_payments,
    SUM(CASE WHEN pt.status = 'paid' THEN pt.amount ELSE 0 END) as total_paid,
    MAX(pt.paid_at) as last_payment_date
FROM subscriptions s
LEFT JOIN payment_transactions pt ON s.id = pt.subscription_id
WHERE s.status IN ('active', 'trial')
GROUP BY s.id, s.school_id, s.user_email, s.plan_name, s.status, s.subscription_start_date, s.next_billing_date;

-- View: Failed payments that need attention
CREATE OR REPLACE VIEW failed_payments_needing_attention AS
SELECT 
    pt.*,
    s.user_email,
    s.phone
FROM payment_transactions pt
JOIN subscriptions s ON pt.subscription_id = s.id
WHERE pt.status = 'failed'
    AND pt.retry_count < 3
    AND pt.failed_at > NOW() - INTERVAL '7 days'
ORDER BY pt.failed_at DESC;

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Grant permissions to authenticated users (optional, for dashboard)
-- GRANT SELECT ON active_subscriptions_summary TO authenticated;
-- GRANT SELECT ON failed_payments_needing_attention TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Landing page payment schema created successfully!';
    RAISE NOTICE 'Tables created: subscriptions, payment_transactions, payment_verification_log, trial_activations, subscription_sync_log';
    RAISE NOTICE 'RLS policies enabled for security';
    RAISE NOTICE 'Service role key will have full access';
END $$;
