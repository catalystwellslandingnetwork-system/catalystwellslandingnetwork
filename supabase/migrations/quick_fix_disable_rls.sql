-- =====================================================
-- QUICK FIX: Disable RLS for Feedback Table
-- =====================================================
-- WARNING: This is less secure but will work immediately
-- Use this if you want a quick fix and don't need RLS
-- =====================================================

-- Simply disable RLS for the feedback table
ALTER TABLE public.feedback DISABLE ROW LEVEL SECURITY;

-- This allows anyone to:
-- ✅ INSERT (submit feedback) - what we want
-- ⚠️ SELECT (read feedback) - probably don't want public reading
-- ⚠️ UPDATE (modify feedback) - definitely don't want this
-- ⚠️ DELETE (remove feedback) - definitely don't want this

-- RECOMMENDATION: Use the proper RLS fix instead (fix_feedback_rls.sql)
-- Or add the service role key to your .env.local

-- To re-enable RLS later:
-- ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
