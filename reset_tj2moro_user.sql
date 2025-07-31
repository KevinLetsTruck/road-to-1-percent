-- Reset user tj2moro@gmail.com from test status back to normal
-- This will include them in statistics again

-- First, check current status
SELECT 'Current status of tj2moro@gmail.com:' as info;
SELECT id, email, first_name, last_name, is_test_user, created_at
FROM profiles
WHERE email = 'tj2moro@gmail.com';

-- Reset the user from test status
UPDATE profiles 
SET is_test_user = false
WHERE email = 'tj2moro@gmail.com';

-- Verify the change
SELECT 'User after reset:' as info;
SELECT id, email, first_name, last_name, is_test_user, created_at
FROM profiles
WHERE email = 'tj2moro@gmail.com';

-- Show updated test users count
SELECT 'Updated test users summary:' as info;
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE is_test_user = true) as test_users,
    COUNT(*) FILTER (WHERE is_test_user = false OR is_test_user IS NULL) as real_users
FROM profiles; 