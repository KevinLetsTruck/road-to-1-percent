-- Comprehensive RLS Fix for Admin Dashboard
-- Run this entire script in your Supabase SQL Editor

-- 1. First, check which user you are and confirm admin status
SELECT 
  id,
  email,
  is_admin,
  'This is your current user' as note
FROM profiles 
WHERE id = auth.uid();

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own assessments" ON comprehensive_assessments;
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to own progress" ON user_progress;

-- 3. Create new policies that allow admin access

-- Profiles table - Allow admins to see all profiles, others see only their own
CREATE POLICY "Users and admins can view profiles" 
ON profiles FOR SELECT 
TO authenticated
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- User Progress table - Allow admins to see all progress
CREATE POLICY "Users and admins can view progress" 
ON user_progress FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- Comprehensive Assessments table - Allow admins to see all assessments
CREATE POLICY "Users and admins can view assessments" 
ON comprehensive_assessments FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- 4. Keep existing INSERT and UPDATE policies for users
-- These should already exist, but let's ensure they're there
CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own assessments" 
ON comprehensive_assessments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own assessments" 
ON comprehensive_assessments FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Verify the policies were created correctly
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'comprehensive_assessments')
ORDER BY tablename, cmd;

-- 6. Test that you can now see all data as an admin
SELECT 'Test 1: All profiles visible' as test, COUNT(*) as count FROM profiles;
SELECT 'Test 2: All progress visible' as test, COUNT(*) as count FROM user_progress;
SELECT 'Test 3: All assessments visible' as test, COUNT(*) as count FROM comprehensive_assessments;

-- 7. Final check - simulate what the admin dashboard queries
SELECT 
  'Admin Dashboard Data Test' as test,
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT up.user_id) as users_with_progress,
  COUNT(DISTINCT ca.user_id) as users_with_assessments
FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
LEFT JOIN comprehensive_assessments ca ON p.id = ca.user_id; 