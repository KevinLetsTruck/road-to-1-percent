-- Set Admin by Email Address
-- Replace 'your-email@example.com' with your actual email address

-- First, let's see all users and their admin status
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  'All users before update' as note
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
  first_name,
  last_name,
  is_admin,
  created_at,
  'Your profile after update' as note
FROM profiles 
WHERE email = 'your-email@example.com';

-- Show all admin users
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at,
  'All admin users' as note
FROM profiles 
WHERE is_admin = true
ORDER BY created_at DESC; 