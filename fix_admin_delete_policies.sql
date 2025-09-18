-- Fix Admin Delete Policies
-- This script adds DELETE policies for admins to be able to delete user records

-- Check current admin user
SELECT 
  id,
  email,
  is_admin,
  'This is your current admin user' as note
FROM profiles 
WHERE id = auth.uid();

-- Add DELETE policies for admins

-- 1. Profiles table - Allow admins to delete any profile, users can delete their own
CREATE POLICY IF NOT EXISTS "Users and admins can delete profiles" 
ON profiles FOR DELETE 
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

-- 2. User Progress table - Allow admins to delete any progress record
CREATE POLICY IF NOT EXISTS "Users and admins can delete progress" 
ON user_progress FOR DELETE 
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

-- 3. Comprehensive Assessments table - Allow admins to delete any assessment
CREATE POLICY IF NOT EXISTS "Users and admins can delete assessments" 
ON comprehensive_assessments FOR DELETE 
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

-- 4. Assessment Responses table - Allow admins to delete any response
CREATE POLICY IF NOT EXISTS "Users and admins can delete assessment responses" 
ON assessment_responses FOR DELETE 
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

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND cmd = 'DELETE'
ORDER BY tablename, policyname;

-- Test the delete permissions (this should show true for admin users)
SELECT 
  'Can admin delete from profiles?' as test,
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) as result;
