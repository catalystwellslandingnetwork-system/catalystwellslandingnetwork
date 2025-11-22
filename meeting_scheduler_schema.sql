-- Meeting Scheduler Schema for Catalyst Wells Support
-- This schema stores scheduled Google Meet appointments

-- Create meetings table
CREATE TABLE IF NOT EXISTS scheduled_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  
  -- Meeting Details
  meeting_type VARCHAR(50) NOT NULL DEFAULT 'support', -- support, demo, training, consultation
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
  duration_minutes INTEGER DEFAULT 30, -- 15, 30, 45, 60
  
  -- Additional Information
  subject VARCHAR(500),
  description TEXT,
  urgency_level VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  
  -- Scheduling Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed, no_show
  google_meet_link TEXT,
  calendar_event_id VARCHAR(255),
  
  -- Assignment
  assigned_to VARCHAR(255), -- support team member email
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  scheduled_at TIMESTAMP WITH TIME ZONE, -- confirmed meeting datetime
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  source VARCHAR(50) DEFAULT 'support_page', -- support_page, email, phone, chat
  user_agent TEXT,
  ip_address INET,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT future_meeting CHECK (preferred_date >= CURRENT_DATE)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_meetings_email ON scheduled_meetings(email);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON scheduled_meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON scheduled_meetings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON scheduled_meetings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_assigned_to ON scheduled_meetings(assigned_to);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON scheduled_meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create meeting notes table for follow-ups
CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES scheduled_meetings(id) ON DELETE CASCADE,
  
  -- Note Details
  note_type VARCHAR(50) DEFAULT 'general', -- general, follow_up, action_item, resolution
  content TEXT NOT NULL,
  
  -- Author
  created_by VARCHAR(255) NOT NULL, -- support team member email
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT valid_meeting_id CHECK (meeting_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_meeting_notes_meeting_id ON meeting_notes(meeting_id);

-- Create meeting reminders table
CREATE TABLE IF NOT EXISTS meeting_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES scheduled_meetings(id) ON DELETE CASCADE,
  
  -- Reminder Details
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_type VARCHAR(50) DEFAULT 'email', -- email, sms, both
  
  -- Status
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reminders_meeting_id ON meeting_reminders(meeting_id);
CREATE INDEX IF NOT EXISTS idx_reminders_time ON meeting_reminders(reminder_time) WHERE sent = FALSE;

-- Insert sample meeting types configuration
CREATE TABLE IF NOT EXISTS meeting_types (
  id SERIAL PRIMARY KEY,
  type_name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  default_duration INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO meeting_types (type_name, display_name, description, default_duration, sort_order) VALUES
  ('support', 'Technical Support', 'Get help with technical issues and troubleshooting', 30, 1),
  ('demo', 'Product Demo', 'Live demonstration of Catalyst Wells platform', 45, 2),
  ('training', 'Training Session', 'Comprehensive training for your team', 60, 3),
  ('consultation', 'Consultation', 'Discuss your specific requirements and solutions', 45, 4),
  ('onboarding', 'Onboarding Call', 'Get started with Catalyst Wells', 30, 5)
ON CONFLICT (type_name) DO NOTHING;

-- Create view for upcoming meetings
CREATE OR REPLACE VIEW upcoming_meetings AS
SELECT 
  m.*,
  mt.display_name as meeting_type_display,
  CASE 
    WHEN m.preferred_date = CURRENT_DATE THEN 'Today'
    WHEN m.preferred_date = CURRENT_DATE + 1 THEN 'Tomorrow'
    WHEN m.preferred_date <= CURRENT_DATE + 7 THEN 'This Week'
    ELSE 'Later'
  END as time_category
FROM scheduled_meetings m
LEFT JOIN meeting_types mt ON m.meeting_type = mt.type_name
WHERE m.status IN ('pending', 'confirmed')
  AND m.preferred_date >= CURRENT_DATE
ORDER BY m.preferred_date, m.preferred_time;

COMMENT ON TABLE scheduled_meetings IS 'Stores all scheduled Google Meet appointments from the support page';
COMMENT ON TABLE meeting_notes IS 'Stores notes and follow-ups for each meeting';
COMMENT ON TABLE meeting_reminders IS 'Automated reminders for scheduled meetings';
COMMENT ON TABLE meeting_types IS 'Configuration for different types of meetings';
