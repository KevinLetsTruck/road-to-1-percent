-- Investigate user count discrepancy
-- Expected: 24 users, Seeing: 3 users in auth.users

-- 1. Count users in auth.users
SELECT 'Users in auth.users:' as table_name, COUNT(*) as count
FROM auth.users;

-- 2. Count users in profiles
SELECT 'Users in profiles:' as table_name, COUNT(*) as count
FROM profiles;

-- 3. Count unique users in user_progress
SELECT 'Users in user_progress:' as table_name, COUNT(DISTINCT user_id) as count
FROM user_progress;

-- 4. Count unique users in comprehensive_assessments
SELECT 'Users in comprehensive_assessments:' as table_name, COUNT(DISTINCT user_id) as count
FROM comprehensive_assessments;

-- 5. Show all profiles with their auth status
SELECT 'All profiles and their auth.users status:' as info;
SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.created_at,
    CASE WHEN au.id IS NULL THEN 'NO AUTH USER' ELSE 'Has auth user' END as auth_status
FROM profiles p
LEFT JOIN auth.users au ON au.id = p.id
ORDER BY p.created_at DESC;

-- 6. Show profiles WITHOUT corresponding auth.users (these are the missing ones)
SELECT 'Profiles WITHOUT auth.users (these users cannot login):' as info;
SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.created_at
FROM profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE au.id IS NULL
ORDER BY p.created_at DESC;

-- 7. Check which database/project we're connected to
SELECT current_database() as database_name; 