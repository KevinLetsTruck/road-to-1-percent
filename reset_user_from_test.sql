-- Reset a user from test status back to normal
-- Replace 'user@example.com' with the actual email you want to reset

-- First, show current test users
SELECT 'Current test users:' as info;
SELECT id, email, first_name, last_name, is_test_user
FROM profiles
WHERE is_test_user = true
ORDER BY email;

-- Reset specific user (replace with actual email)
UPDATE profiles 
SET is_test_user = false
WHERE email = 'user@example.com'; -- CHANGE THIS to the actual email

-- Verify the change
SELECT 'User after reset:' as info;
SELECT id, email, first_name, last_name, is_test_user
FROM profiles
WHERE email = 'user@example.com'; -- CHANGE THIS to the actual email

-- Show updated test users list
SELECT 'Updated test users:' as info;
SELECT id, email, first_name, last_name, is_test_user
FROM profiles
WHERE is_test_user = true
ORDER BY email; 