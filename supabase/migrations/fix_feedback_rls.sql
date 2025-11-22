-- =====================================================
-- FIX FEEDBACK TABLE RLS POLICIES
-- =====================================================
-- This fixes the RLS policy to allow public submissions
-- =====================================================

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.feedback;

-- Disable RLS temporarily
ALTER TABLE public.feedback DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create new policy that allows anyone to insert feedback
CREATE POLICY "Enable insert for all users" ON public.feedback
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy for authenticated users to read
CREATE POLICY "Enable read for authenticated users" ON public.feedback
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for authenticated users to update
CREATE POLICY "Enable update for authenticated users" ON public.feedback
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy for service role to have full access
CREATE POLICY "Enable all for service role" ON public.feedback
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'feedback';
