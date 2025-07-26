-- Set Admin by Email (Updated)
-- Replace 'your-email@example.com' with your actual email address

-- First, let's see all users
SELECT 
  id,
  email,
  is_admin,
  'All users' as note
FROM profiles 
ORDER BY created_at DESC;

-- Set admin privileges for your email (replace with your actual email)
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT 
  id,
  email,
  is_admin,
  'Admin users' as note
FROM profiles 
WHERE is_admin = true;

 