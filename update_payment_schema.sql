-- ============================================
-- MIGRATION SCRIPT FOR PAYMENT SCHEMA UPDATE
-- ============================================
-- This script updates the existing schema to handle the new requirements
-- while maintaining compatibility with existing data

-- First, drop any views that reference the old columns
DROP VIEW IF EXISTS active_subscriptions_summary;
DROP VIEW IF EXISTS failed_payments_needing_attention;

-- 1. Update subscriptions table
-- First, add the external_reference_id column if it doesn't exist
DO $$
BEGIN
    -- Add external_reference_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'subscriptions' AND column_name = 'external_reference_id') THEN
        ALTER TABLE subscriptions ADD COLUMN external_reference_id TEXT;
        
        -- Copy school_id to external_reference_id for existing records
        UPDATE subscriptions 
        SET external_reference_id = school_id::TEXT 
        WHERE external_reference_id IS NULL AND school_id IS NOT NULL;
        
        -- Make the column NOT NULL after populating
        ALTER TABLE subscriptions ALTER COLUMN external_reference_id SET NOT NULL;
        
        -- Add index for better performance
        CREATE INDEX IF NOT EXISTS idx_subscriptions_reference_id ON subscriptions(external_reference_id);
    END IF;
    
    -- Rename payment_gateway_subscription_id if it exists as razorpay_subscription_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'subscriptions' AND column_name = 'razorpay_subscription_id') THEN
        ALTER TABLE subscriptions RENAME COLUMN razorpay_subscription_id TO payment_gateway_subscription_id;
    END IF;
    
    -- Add payment_gateway column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'subscriptions' AND column_name = 'payment_gateway') THEN
        ALTER TABLE subscriptions ADD COLUMN payment_gateway TEXT DEFAULT 'razorpay';
    END IF;
END $$;

-- 2. Update payment_transactions table
DO $$
BEGIN
    -- Add external_reference_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'payment_transactions' AND column_name = 'external_reference_id') THEN
        ALTER TABLE payment_transactions ADD COLUMN external_reference_id TEXT;
        
        -- Copy school_id to external_reference_id for existing records
        UPDATE payment_transactions 
        SET external_reference_id = school_id::TEXT 
        WHERE external_reference_id IS NULL AND school_id IS NOT NULL;
        
        -- Add index for better performance
        CREATE INDEX IF NOT EXISTS idx_payment_txn_reference ON payment_transactions(external_reference_id) 
        WHERE external_reference_id IS NOT NULL;
    END IF;
    
    -- Rename Razorpay columns to be more generic
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'payment_transactions' AND column_name = 'razorpay_order_id') THEN
        ALTER TABLE payment_transactions RENAME COLUMN razorpay_order_id TO gateway_order_id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'payment_transactions' AND column_name = 'razorpay_payment_id') THEN
        ALTER TABLE payment_transactions RENAME COLUMN razorpay_payment_id TO gateway_payment_id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'payment_transactions' AND column_name = 'razorpay_signature') THEN
        ALTER TABLE payment_transactions RENAME COLUMN razorpay_signature TO gateway_signature;
    END IF;
    
    -- Add payment_gateway column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'payment_transactions' AND column_name = 'payment_gateway') THEN
        ALTER TABLE payment_transactions ADD COLUMN payment_gateway TEXT DEFAULT 'razorpay';
    END IF;
END $$;

-- 3. Update payment_verification_log table
DO $$
BEGIN
    -- Rename Razorpay columns to be more generic
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'payment_verification_log' AND column_name = 'razorpay_order_id') THEN
        ALTER TABLE payment_verification_log RENAME COLUMN razorpay_order_id TO gateway_order_id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'payment_verification_log' AND column_name = 'razorpay_payment_id') THEN
        ALTER TABLE payment_verification_log RENAME COLUMN razorpay_payment_id TO gateway_payment_id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'payment_verification_log' AND column_name = 'razorpay_signature') THEN
        ALTER TABLE payment_verification_log RENAME COLUMN razorpay_signature TO gateway_signature;
    END IF;
END $$;

-- 4. Recreate the views with the updated schema
-- View: Active subscriptions summary
CREATE OR REPLACE VIEW active_subscriptions_summary AS
SELECT 
    s.id,
    s.external_reference_id,
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
GROUP BY s.id, s.external_reference_id, s.user_email, s.plan_name, s.status, 
         s.subscription_start_date, s.next_billing_date;

-- View: Failed payments that need attention
CREATE OR REPLACE VIEW failed_payments_needing_attention AS
SELECT 
    pt.*,
    s.user_email,
    s.contact_phone as phone
FROM payment_transactions pt
JOIN subscriptions s ON pt.subscription_id = s.id
WHERE pt.status = 'failed'
    AND pt.retry_count < 3
    AND pt.failed_at > NOW() - INTERVAL '7 days'
ORDER BY pt.failed_at DESC;

-- 5. Update RLS policies if needed
-- (Add your RLS policy updates here if necessary)

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema updated successfully!';
    RAISE NOTICE 'Added external_reference_id to relevant tables';
    RAISE NOTICE 'Updated column names to be more generic';
    RAISE NOTICE 'Recreated views with the updated schema';
END $$;
