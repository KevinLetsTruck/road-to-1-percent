-- Debug Admin Access Issues
-- Run this in your Supabase SQL Editor to diagnose why the admin button isn't showing

-- 1. Check if you're authenticated
SELECT 
  auth.uid() as current_user_id,
  auth.email() as current_user_email,
  'Authentication check' as note;

-- 2. Check if your profile exists
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  'Profile check' as note
FROM profiles 
WHERE id = auth.uid();

-- 3. If no profile exists, create one
INSERT INTO profiles (id, email, first_name, last_name, is_admin)
SELECT 
  auth.uid(),
  auth.email(),
  'Admin',
  'User',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid()
);

-- 4. Verify the profile was created/updated
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  'After profile creation/update' as note
FROM profiles 
WHERE id = auth.uid();

-- 5. Show all users and their admin status
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  'All users' as note
FROM profiles 
ORDER BY created_at DESC;

-- 6. Test the admin check query (same as the dashboard layout uses)
SELECT 
  is_admin,
  'Admin check result' as note
FROM profiles 
WHERE id = auth.uid(); 