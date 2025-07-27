-- Test Admin Query
-- Run this as kevin@letstruck.com

-- 1. Check current user
SELECT 
    'Current auth user:' as info,
    auth.uid() as user_id,
    current_setting('request.jwt.claims', true)::json->>'email' as email;

-- 2. Try to select your own profile
SELECT 
    'Your profile:' as info,
    id,
    email,
    is_admin,
    first_name,
    last_name
FROM profiles
WHERE id = auth.uid();

-- 3. Try to select your profile by email
SELECT 
    'Profile by email:' as info,
    id,
    email,
    is_admin,
    first_name,
    last_name
FROM profiles
WHERE email = 'kevin@letstruck.com';

-- 4. Check if you can see other profiles (admin test)
SELECT 
    'Other profiles visible:' as info,
    COUNT(*) as total_profiles
FROM profiles;

-- 5. List current policies
SELECT 
    'Current policies on profiles:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles'
AND schemaname = 'public'; 