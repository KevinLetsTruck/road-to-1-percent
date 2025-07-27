-- Check if user bobthebuilder@letstruck.com was properly deleted
-- Run this in Supabase SQL Editor

-- 1. Check if user exists in auth.users
SELECT 'Auth Users Table:' as table_name;
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'bobthebuilder@letstruck.com';

-- 2. Check if user exists in profiles
SELECT 'Profiles Table:' as table_name;
SELECT id, email, created_at 
FROM profiles 
WHERE email = 'bobthebuilder@letstruck.com';

-- 3. Check if user has any user_progress records
SELECT 'User Progress Table:' as table_name;
SELECT up.* 
FROM user_progress up
JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'bobthebuilder@letstruck.com';

-- 4. Check if user has any comprehensive_assessments
SELECT 'Comprehensive Assessments Table:' as table_name;
SELECT ca.* 
FROM comprehensive_assessments ca
JOIN auth.users au ON au.id = ca.user_id
WHERE au.email = 'bobthebuilder@letstruck.com';

-- 5. Check if user has any assessment_responses
SELECT 'Assessment Responses Table:' as table_name;
SELECT COUNT(*) as response_count
FROM assessment_responses ar
JOIN auth.users au ON au.id = ar.user_id
WHERE au.email = 'bobthebuilder@letstruck.com'; 