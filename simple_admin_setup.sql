-- Simple Admin Setup
-- This script will show you all users and help you set admin privileges

-- 1. Show all users in the system
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- 2. To make a user admin, uncomment and modify the line below:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';

-- 3. To make the most recent user admin, uncomment the line below:
-- UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1);

-- 4. After running the update, verify with this query:
-- SELECT id, email, is_admin FROM profiles WHERE is_admin = true; 