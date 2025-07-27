-- Add test user flag to profiles table
-- This allows us to exclude test users from statistics without deleting them

-- Add the column to mark test users
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_test_user BOOLEAN DEFAULT false;

-- Update any obvious test users (you can modify this list)
UPDATE profiles 
SET is_test_user = true
WHERE 
    email LIKE '%test%' OR
    email LIKE '%demo%' OR
    email LIKE '%example.com' OR
    email LIKE '%temp%';

-- Show current test users
SELECT 'Users marked as test users:' as info;
SELECT id, email, first_name, last_name, is_test_user
FROM profiles
WHERE is_test_user = true
ORDER BY email;

-- Show statistics comparison
SELECT 'Statistics comparison:' as info;
SELECT 
    'Total Users' as metric,
    COUNT(*) as all_users,
    COUNT(*) FILTER (WHERE NOT is_test_user) as real_users,
    COUNT(*) FILTER (WHERE is_test_user) as test_users
FROM profiles

UNION ALL

SELECT 
    'Active Users' as metric,
    COUNT(DISTINCT user_id) as all_users,
    COUNT(DISTINCT user_id) FILTER (WHERE p.is_test_user = false) as real_users,
    COUNT(DISTINCT user_id) FILTER (WHERE p.is_test_user = true) as test_users
FROM user_progress up
LEFT JOIN profiles p ON p.id = up.user_id; 