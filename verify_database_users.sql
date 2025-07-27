-- Verify Database Users and Find the Missing 21
-- You expect 24 users but only see 3 in auth.users

-- 1. Show database connection info
SELECT 'Database Info:' as info;
SELECT current_database() as database_name, current_user, version();

-- 2. Count comparison
SELECT 'User Count Summary:' as summary;
SELECT 
    (SELECT COUNT(*) FROM auth.users) as auth_users_count,
    (SELECT COUNT(*) FROM profiles) as profiles_count,
    (SELECT COUNT(DISTINCT user_id) FROM user_progress) as user_progress_count;

-- 3. List ALL users from auth.users
SELECT 'All users in auth.users:' as info;
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 4. List ALL users from profiles  
SELECT 'All users in profiles:' as info;
SELECT id, email, first_name, last_name, created_at
FROM profiles
ORDER BY created_at DESC;

-- 5. Find profiles that exist but have NO auth.users entry
-- These are likely your missing 21 users!
SELECT 'MISSING USERS - Profiles without auth accounts:' as info;
SELECT 
    p.id,
    p.email,
    p.first_name || ' ' || p.last_name as full_name,
    p.created_at as profile_created,
    'Cannot login - no auth account' as status
FROM profiles p
WHERE p.id NOT IN (SELECT id FROM auth.users)
ORDER BY p.created_at DESC;

-- 6. Show which users CAN login (have both profile and auth)
SELECT 'Users who CAN login:' as info;
SELECT 
    p.email,
    p.first_name || ' ' || p.last_name as full_name,
    au.last_sign_in_at
FROM profiles p
INNER JOIN auth.users au ON au.id = p.id
ORDER BY p.created_at DESC; 