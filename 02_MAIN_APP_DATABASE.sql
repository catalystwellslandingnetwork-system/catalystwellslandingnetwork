-- ============================================
-- MAIN APPLICATION DATABASE - COMPLETE SETUP
-- Run this in your Main App Database SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CREATE SCHOOLS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  
  -- Subscription Information (synced from landing page)
  subscription_status VARCHAR(20) CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired', 'pending')),
  subscription_plan VARCHAR(100),
  student_limit INTEGER,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  
  -- Account Status
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_from VARCHAR(50) DEFAULT 'landing_page',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: CREATE USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- User Information
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  phone VARCHAR(20),
  
  -- Authentication
  password_hash VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE SUBSCRIPTION SYNC TABLE
-- ============================================

-- Read-only copy of subscription data from landing page
CREATE TABLE IF NOT EXISTS subscription_sync (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  landing_page_subscription_id UUID NOT NULL UNIQUE,
  
  -- Full subscription data from landing page
  data JSONB NOT NULL,
  
  -- Sync metadata
  sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sync_source VARCHAR(50) DEFAULT 'landing_page',
  
  CONSTRAINT unique_landing_subscription UNIQUE (landing_page_subscription_id)
);

-- ============================================
-- STEP 4: CREATE AUDIT LOGS TABLE
-- ============================================

-- Immutable audit trail for all operations
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Event Information
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  service VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  
  -- Actor
  user_id UUID,
  school_id UUID,
  
  -- Request Information
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_id UUID,
  
  -- Data
  payload_hash VARCHAR(64),
  changes JSONB,
  
  -- Result
  success BOOLEAN NOT NULL,
  error TEXT,
  
  -- Immutable timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 5: CREATE SECURITY LOG TABLE
-- ============================================

-- Log all security events
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Source
  ip_address VARCHAR(45),
  user_agent TEXT,
  service VARCHAR(50),
  
  -- Details
  description TEXT,
  details JSONB,
  
  -- Resolved
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 6: CREATE INDEXES
-- ============================================

-- Schools indexes
CREATE INDEX IF NOT EXISTS idx_schools_email ON schools(email);
CREATE INDEX IF NOT EXISTS idx_schools_subscription_status ON schools(subscription_status);
CREATE INDEX IF NOT EXISTS idx_schools_is_active ON schools(is_active);
CREATE INDEX IF NOT EXISTS idx_schools_created ON schools(created_at DESC);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Subscription sync indexes
CREATE INDEX IF NOT EXISTS idx_subscription_sync_school_id ON subscription_sync(school_id);
CREATE INDEX IF NOT EXISTS idx_subscription_sync_landing_id ON subscription_sync(landing_page_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_sync_timestamp ON subscription_sync(sync_timestamp DESC);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_service ON audit_logs(service);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);

-- Security logs indexes
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_resolved ON security_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_security_logs_created ON security_logs(created_at DESC);

-- ============================================
-- STEP 7: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 8: CREATE RLS POLICIES
-- ============================================

-- Schools policies
DROP POLICY IF EXISTS "Service role full access to schools" ON schools;
CREATE POLICY "Service role full access to schools" 
  ON schools FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Schools can view own data" ON schools;
CREATE POLICY "Schools can view own data" 
  ON schools FOR SELECT TO authenticated 
  USING (id IN (SELECT school_id FROM users WHERE id = auth.uid()));

-- Users policies
DROP POLICY IF EXISTS "Service role full access to users" ON users;
CREATE POLICY "Service role full access to users" 
  ON users FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own school users" ON users;
CREATE POLICY "Users can view own school users" 
  ON users FOR SELECT TO authenticated 
  USING (school_id IN (SELECT school_id FROM users WHERE id = auth.uid()));

-- Subscription sync policies (read-only for authenticated users)
DROP POLICY IF EXISTS "Service role full access to subscription sync" ON subscription_sync;
CREATE POLICY "Service role full access to subscription sync" 
  ON subscription_sync FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Schools can view own subscription sync" ON subscription_sync;
CREATE POLICY "Schools can view own subscription sync" 
  ON subscription_sync FOR SELECT TO authenticated 
  USING (school_id IN (SELECT school_id FROM users WHERE id = auth.uid()));

-- Audit logs policies (service role only, append-only)
DROP POLICY IF EXISTS "Service role read access to audit logs" ON audit_logs;
CREATE POLICY "Service role read access to audit logs" 
  ON audit_logs FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Service role insert access to audit logs" ON audit_logs;
CREATE POLICY "Service role insert access to audit logs" 
  ON audit_logs FOR INSERT TO service_role WITH CHECK (true);

-- Security logs policies (service role only)
DROP POLICY IF EXISTS "Service role full access to security logs" ON security_logs;
CREATE POLICY "Service role full access to security logs" 
  ON security_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- STEP 9: CREATE TRIGGERS
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
DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 10: CREATE VIEWS
-- ============================================

-- Active schools view
CREATE OR REPLACE VIEW active_schools AS
SELECT 
  s.id,
  s.email,
  s.name,
  s.phone,
  s.subscription_status,
  s.subscription_plan,
  s.student_limit,
  s.trial_end_date,
  s.subscription_start_date,
  s.next_billing_date,
  COUNT(DISTINCT u.id) as user_count,
  s.created_at
FROM schools s
LEFT JOIN users u ON s.id = u.school_id AND u.is_active = true
WHERE s.is_active = true AND s.subscription_status IN ('trial', 'active')
GROUP BY s.id;

-- Trial schools view (ending soon)
CREATE OR REPLACE VIEW trial_schools_ending_soon AS
SELECT 
  s.id,
  s.email,
  s.name,
  s.subscription_plan,
  s.trial_end_date,
  EXTRACT(DAY FROM (s.trial_end_date - NOW())) as days_remaining
FROM schools s
WHERE 
  s.subscription_status = 'trial' 
  AND s.trial_end_date IS NOT NULL
  AND s.trial_end_date > NOW()
  AND s.trial_end_date < NOW() + INTERVAL '7 days'
ORDER BY s.trial_end_date ASC;

-- Recent security events view
CREATE OR REPLACE VIEW recent_security_events AS
SELECT 
  event_type,
  severity,
  ip_address,
  description,
  resolved,
  created_at
FROM security_logs
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC, severity DESC;

-- ============================================
-- STEP 11: GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON active_schools TO service_role;
GRANT SELECT ON trial_schools_ending_soon TO service_role;
GRANT SELECT ON recent_security_events TO service_role;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify setup:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM active_schools;
-- SELECT * FROM trial_schools_ending_soon;
-- SELECT * FROM recent_security_events;

-- ============================================
-- SAMPLE DATA (FOR TESTING - OPTIONAL)
-- ============================================

-- Uncomment to insert test data:
/*
INSERT INTO schools (email, name, phone, subscription_status, subscription_plan, student_limit, trial_end_date)
VALUES (
  'test@school.com',
  'Test School',
  '9876543210',
  'trial',
  'Catalyst AI Pro',
  75,
  NOW() + INTERVAL '30 days'
);
*/

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
-- Next steps:
-- 1. Copy the security library (lib/security.ts) to your main app
-- 2. Create the sync API endpoint
-- 3. Configure environment variables
-- 4. Test the sync flow
-- ============================================
