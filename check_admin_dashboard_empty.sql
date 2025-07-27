-- Diagnose why admin dashboard is empty

-- 1. Check total user counts
SELECT 'Total counts in each table:' as check;
SELECT 
    'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 
    'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 
    'user_progress' as table_name, COUNT(*) as count FROM user_progress
UNION ALL
SELECT 
    'comprehensive_assessments' as table_name, COUNT(*) as count FROM comprehensive_assessments;

-- 2. Check if all users are marked as test users
SELECT 'Test user status:' as check;
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE is_test_user = true) as test_users,
    COUNT(*) FILTER (WHERE is_test_user = false OR is_test_user IS NULL) as real_users
FROM profiles;

-- 3. List all users with their test status
SELECT 'All users and their test status:' as check;
SELECT id, email, is_test_user, is_admin, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check your admin user specifically
SELECT 'Your admin account status:' as check;
SELECT id, email, is_admin, is_test_user
FROM profiles
WHERE email = 'kevin@letstruck.com';

-- 5. Check if RLS is blocking data
SELECT 'RLS status on tables:' as check;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'comprehensive_assessments', 'assessment_responses');

-- 6. Test if the is_admin_user function exists and works
SELECT 'Admin function test:' as check;
SELECT 
    EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_admin_user'
    ) as function_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin_user')
        THEN (SELECT is_admin_user())
        ELSE NULL
    END as current_user_is_admin; 