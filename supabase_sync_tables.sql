-- Additional tables for syncing landing page data to main app
-- Run this in your Supabase SQL Editor

-- Create sync retry queue table
CREATE TABLE IF NOT EXISTS sync_retry_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id TEXT NOT NULL,
  data JSONB NOT NULL,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'failed'
  last_error TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sync audit logs table
CREATE TABLE IF NOT EXISTS sync_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  error TEXT,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin alerts table
CREATE TABLE IF NOT EXISTS admin_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  details JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sync_retry_queue_status ON sync_retry_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_retry_queue_next_retry ON sync_retry_queue(next_retry_at);
CREATE INDEX IF NOT EXISTS idx_sync_audit_logs_subscription ON sync_audit_logs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_resolved ON admin_alerts(resolved);

-- Add Row Level Security (RLS)
ALTER TABLE sync_retry_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role can do everything on sync_retry_queue"
  ON sync_retry_queue
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on sync_audit_logs"
  ON sync_audit_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on admin_alerts"
  ON admin_alerts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for sync_retry_queue
CREATE TRIGGER update_sync_retry_queue_updated_at
    BEFORE UPDATE ON sync_retry_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
