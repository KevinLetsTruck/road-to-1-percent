-- Clean Admin Setup - No auth.uid() calls
-- This script will work without authentication issues

-- Step 1: See all users
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- Step 2: Make the most recent user admin (uncomment the line below)
-- UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1);

-- Step 3: Verify admin users
SELECT 
  id,
  email,
  is_admin
FROM profiles 
WHERE is_admin = true; 