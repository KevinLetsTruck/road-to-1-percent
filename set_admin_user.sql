-- Set current user as admin
-- Run this in your Supabase SQL Editor

-- First, let's see who you are
SELECT 
  id,
  email,
  is_admin,
  'Current user' as note
FROM profiles 
WHERE id = auth.uid();

-- Set the current user as admin
UPDATE profiles 
SET is_admin = true 
WHERE id = auth.uid();

-- Verify the change
SELECT 
  id,
  email,
  is_admin,
  'After update' as note
FROM profiles 
WHERE id = auth.uid();

-- Also show all admin users
SELECT 
  id,
  email,
  is_admin,
  created_at
FROM profiles 
WHERE is_admin = true
ORDER BY created_at DESC; 