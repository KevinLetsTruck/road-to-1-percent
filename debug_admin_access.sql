-- Debug Admin Access Issues
-- Run this in your Supabase SQL Editor to diagnose why the admin button isn't showing

-- 1. Show all users in the system
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  'All users in system' as note
FROM profiles 
ORDER BY created_at DESC;

-- 2. Show all admin users
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  'Admin users only' as note
FROM profiles 
WHERE is_admin = true
ORDER BY created_at DESC;

-- 3. To make a user admin, run one of these queries:
-- Option A: Make the most recent user admin
-- UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1);

-- Option B: Make a specific user admin by email (replace with actual email)
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';

-- Option C: Make a specific user admin by ID (replace with actual ID)
-- UPDATE profiles SET is_admin = true WHERE id = 'your-user-id-here'; 