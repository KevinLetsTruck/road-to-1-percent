-- Fix admin update policy for profiles table
-- This allows admins to update any user's profile (needed for toggling test user status)

-- First, check existing policies
SELECT 'Existing policies on profiles table:' as info;
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles'
ORDER BY policyname;

-- Drop existing admin update policy if it exists
DROP POLICY IF EXISTS "Admin users can update all profiles" ON profiles;

-- Create policy allowing admins to update any profile
CREATE POLICY "Admin users can update all profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Verify the policy was created
SELECT 'After adding admin update policy:' as info;
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles'
  AND cmd = 'UPDATE'
ORDER BY policyname; 