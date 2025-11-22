-- =====================================================
-- FEEDBACK SYSTEM - DATABASE SETUP
-- =====================================================
-- This script creates the feedback table for the 
-- Catalyst Wells roadmap feedback system
-- =====================================================

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('feature', 'bug', 'improvement', 'other')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'in_progress', 'completed', 'rejected')),
    source_page TEXT DEFAULT 'roadmap',
    metadata JSONB DEFAULT '{}'::jsonb,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_feedback_email ON public.feedback(email);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON public.feedback(priority);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public to insert feedback (submit form)
CREATE POLICY "Allow public insert" ON public.feedback
    FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to read all feedback (admin)
CREATE POLICY "Allow authenticated read" ON public.feedback
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to update feedback (admin)
CREATE POLICY "Allow authenticated update" ON public.feedback
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row update
CREATE TRIGGER update_feedback_updated_at 
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE COMMENT
-- =====================================================

COMMENT ON TABLE public.feedback IS 'Stores user feedback, feature requests, and bug reports from the Catalyst Wells roadmap page';

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify table was created successfully:
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'feedback';
