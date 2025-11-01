-- Check current RLS policies
SELECT 
  schemaname,
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('trial_subscriptions', 'newsletter_subscriptions')
ORDER BY tablename, policyname;

-- Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('trial_subscriptions', 'newsletter_subscriptions');
