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

-- Drop existing DELETE policies first (if they exist)
DROP POLICY IF EXISTS "Users and admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Users and admins can delete progress" ON user_progress;
DROP POLICY IF EXISTS "Users and admins can delete comprehensive assessments" ON comprehensive_assessments;
DROP POLICY IF EXISTS "Users and admins can delete spi assessments" ON spi_assessments;

-- 1. Profiles table - Allow admins to delete any profile, users can delete their own
CREATE POLICY "Users and admins can delete profiles" 
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
CREATE POLICY "Users and admins can delete progress" 
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
CREATE POLICY "Users and admins can delete comprehensive assessments" 
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

-- 4. SPI Assessments table - Allow admins to delete any assessment
CREATE POLICY "Users and admins can delete spi assessments" 
ON spi_assessments FOR DELETE 
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
