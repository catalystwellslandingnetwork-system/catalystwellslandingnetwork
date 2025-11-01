-- ============================================
-- FIX: Row Level Security Policy Issue
-- ============================================
-- Run this SQL in Supabase SQL Editor to fix the RLS policy error

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public trial inserts" ON trial_subscriptions;
DROP POLICY IF EXISTS "Allow authenticated trial reads" ON trial_subscriptions;
DROP POLICY IF EXISTS "Allow service role trial access" ON trial_subscriptions;
DROP POLICY IF EXISTS "Allow public newsletter inserts" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow authenticated newsletter reads" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow service role newsletter access" ON newsletter_subscriptions;

-- ============================================
-- FIXED RLS POLICIES FOR TRIAL SUBSCRIPTIONS
-- ============================================

-- Policy: Allow ALL anonymous users to insert (using anon key)
CREATE POLICY "Enable insert for anon users"
ON trial_subscriptions
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to read
CREATE POLICY "Enable read for authenticated users"
ON trial_subscriptions
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow service role full access
CREATE POLICY "Enable all for service role"
ON trial_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FIXED RLS POLICIES FOR NEWSLETTER SUBSCRIPTIONS
-- ============================================

-- Policy: Allow ALL anonymous users to insert (using anon key)
CREATE POLICY "Enable insert for anon users"
ON newsletter_subscriptions
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to read
CREATE POLICY "Enable read for authenticated users"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow service role full access
CREATE POLICY "Enable all for service role"
ON newsletter_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFY POLICIES
-- ============================================
-- Run this to verify policies are active:
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename IN ('trial_subscriptions', 'newsletter_subscriptions')
ORDER BY tablename, policyname;
