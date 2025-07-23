-- Fix Row Level Security (RLS) for Admin Access
-- Run this in your Supabase SQL Editor

-- 1. First, check current RLS policies
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
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'comprehensive_assessments');

-- 2. Create admin access policies if they don't exist
-- For profiles table
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
  OR auth.uid() = id
);

-- For user_progress table
CREATE POLICY "Admins can view all user progress" 
ON user_progress FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
  OR auth.uid() = user_id
);

-- For comprehensive_assessments table
CREATE POLICY "Admins can view all assessments" 
ON comprehensive_assessments FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
  OR auth.uid() = user_id
);

-- 3. If the above fails due to existing policies, try this approach:
-- Drop existing SELECT policies and recreate with admin access
/*
-- CAUTION: Only run these if you understand the implications
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own assessments" ON comprehensive_assessments;

-- Then run the CREATE POLICY statements above
*/

-- 4. Verify your admin status and test the queries
WITH admin_check AS (
  SELECT id, email, is_admin 
  FROM profiles 
  WHERE id = auth.uid()
)
SELECT 
  'Your admin status:' as info,
  email,
  CASE WHEN is_admin THEN 'YES - You are an admin' ELSE 'NO - You are not an admin' END as admin_status
FROM admin_check;

-- 5. Test if you can see other users' data
SELECT 
  'Total profiles visible:' as info,
  COUNT(*) as count
FROM profiles;

SELECT 
  'Total user_progress visible:' as info,
  COUNT(*) as count
FROM user_progress;

SELECT 
  'Total assessments visible:' as info,
  COUNT(*) as count
FROM comprehensive_assessments; 