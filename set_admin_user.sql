-- Set up an admin user
-- Run this in your Supabase SQL Editor

-- Method 1: Make an existing user an admin
-- Replace 'your-email@example.com' with the email of the user you want to make admin
UPDATE profiles 
SET is_admin = true
WHERE email = 'your-email@example.com';

-- Method 2: Check which users exist and their admin status
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.created_at
FROM profiles p
ORDER BY p.created_at DESC;

-- Method 3: If you know the user ID, you can update by ID instead
-- UPDATE profiles 
-- SET is_admin = true
-- WHERE id = 'your-user-uuid-here';

-- Verify admin status was set
SELECT email, is_admin 
FROM profiles 
WHERE is_admin = true; 