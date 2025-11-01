-- ============================================
-- Catalyst Wells - Supabase Database Schema
-- ============================================
-- This file contains all SQL commands to set up the database
-- Run this in your Supabase SQL Editor
-- ============================================

-- Drop existing tables if you want to start fresh (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS trial_subscriptions CASCADE;
-- DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;

-- ============================================
-- 1. CREATE TRIAL SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trial_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  source_page VARCHAR(100),
  metadata JSONB,
  trial_status VARCHAR(20) DEFAULT 'pending' CHECK (trial_status IN ('pending', 'active', 'expired', 'converted')),
  trial_started_at TIMESTAMP WITH TIME ZONE,
  trial_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE NEWSLETTER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  source_page VARCHAR(100),
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================
-- Indexes for trial_subscriptions
CREATE INDEX IF NOT EXISTS idx_trial_subscriptions_email 
  ON trial_subscriptions(email);

CREATE INDEX IF NOT EXISTS idx_trial_subscriptions_status 
  ON trial_subscriptions(trial_status);

CREATE INDEX IF NOT EXISTS idx_trial_subscriptions_created 
  ON trial_subscriptions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trial_subscriptions_expires 
  ON trial_subscriptions(trial_expires_at);

-- Indexes for newsletter_subscriptions
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email 
  ON newsletter_subscriptions(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_active 
  ON newsletter_subscriptions(is_active);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_created 
  ON newsletter_subscriptions(created_at DESC);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE trial_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CREATE RLS POLICIES FOR TRIAL SUBSCRIPTIONS
-- ============================================

-- Policy: Allow public inserts for trial subscriptions
CREATE POLICY "Allow public trial inserts" 
  ON trial_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated reads for trial subscriptions
CREATE POLICY "Allow authenticated trial reads" 
  ON trial_subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow service role full access for trial subscriptions
CREATE POLICY "Allow service role trial access" 
  ON trial_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 6. CREATE RLS POLICIES FOR NEWSLETTER SUBSCRIPTIONS
-- ============================================

-- Policy: Allow public inserts for newsletter subscriptions
CREATE POLICY "Allow public newsletter inserts" 
  ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated reads for newsletter subscriptions
CREATE POLICY "Allow authenticated newsletter reads" 
  ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow service role full access for newsletter subscriptions
CREATE POLICY "Allow service role newsletter access" 
  ON newsletter_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 7. CREATE FUNCTION TO UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. CREATE TRIGGERS FOR AUTO-UPDATE
-- ============================================
CREATE TRIGGER update_trial_subscriptions_updated_at
  BEFORE UPDATE ON trial_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. OPTIONAL: CREATE VIEWS FOR ANALYTICS
-- ============================================

-- Combined subscription statistics view
CREATE OR REPLACE VIEW subscription_stats AS
SELECT 
  'trial' as subscription_type,
  COUNT(*) as total_subscriptions,
  COUNT(DISTINCT email) as unique_emails,
  DATE(created_at) as subscription_date
FROM trial_subscriptions
GROUP BY DATE(created_at)
UNION ALL
SELECT 
  'newsletter' as subscription_type,
  COUNT(*) as total_subscriptions,
  COUNT(DISTINCT email) as unique_emails,
  DATE(created_at) as subscription_date
FROM newsletter_subscriptions
GROUP BY DATE(created_at)
ORDER BY subscription_date DESC;

-- Active trials view
CREATE OR REPLACE VIEW active_trials AS
SELECT 
  email,
  trial_status,
  trial_started_at,
  trial_expires_at,
  EXTRACT(DAY FROM (trial_expires_at - NOW())) as days_remaining
FROM trial_subscriptions
WHERE trial_status = 'active' AND trial_expires_at > NOW();

-- Active newsletters view
CREATE OR REPLACE VIEW active_newsletters AS
SELECT 
  email,
  source_page,
  created_at
FROM newsletter_subscriptions
WHERE is_active = true;

-- ============================================
-- 10. GRANT PERMISSIONS ON VIEWS
-- ============================================
GRANT SELECT ON subscription_stats TO authenticated;
GRANT SELECT ON active_trials TO authenticated;
GRANT SELECT ON active_newsletters TO authenticated;

-- ============================================
-- 11. VERIFICATION QUERIES
-- ============================================
-- Run these to verify your setup:

-- Check if tables were created
-- SELECT * FROM trial_subscriptions LIMIT 1;
-- SELECT * FROM newsletter_subscriptions LIMIT 1;

-- Check if policies are active
-- SELECT * FROM pg_policies WHERE tablename IN ('trial_subscriptions', 'newsletter_subscriptions');

-- View subscription statistics
-- SELECT * FROM subscription_stats;
-- SELECT * FROM active_trials;
-- SELECT * FROM active_newsletters;

-- Count subscriptions
-- SELECT 'trial' as type, COUNT(*) as count FROM trial_subscriptions
-- UNION ALL
-- SELECT 'newsletter' as type, COUNT(*) as count FROM newsletter_subscriptions;

-- ============================================
-- 12. SAMPLE INSERTS (FOR TESTING)
-- ============================================
-- Uncomment to test insertion:

-- Insert a trial subscription
-- INSERT INTO trial_subscriptions (email, source_page, trial_status)
-- VALUES ('trial@example.com', 'homepage-cta', 'pending');

-- Insert a newsletter subscription
-- INSERT INTO newsletter_subscriptions (email, source_page, is_active)
-- VALUES ('newsletter@example.com', 'footer-signup', true);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready to accept subscriptions.
-- Next steps:
-- 1. Add your Supabase credentials to .env.local
-- 2. Start your Next.js dev server: npm run dev
-- 3. Test the subscription form on your website
-- ============================================
