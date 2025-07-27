-- Check Database Data
-- Run this in your Supabase SQL Editor

-- 1. Show current database info
SELECT current_database() as database_name, version() as postgres_version;

-- 2. Count users in auth.users
SELECT 'Auth Users:' as table_name, COUNT(*) as count 
FROM auth.users;

-- 3. Count profiles
SELECT 'Profiles:' as table_name, COUNT(*) as count 
FROM profiles;

-- 4. Count user_progress records
SELECT 'User Progress:' as table_name, COUNT(*) as count 
FROM user_progress;

-- 5. Count comprehensive assessments
SELECT 'Comprehensive Assessments:' as table_name, COUNT(*) as count 
FROM comprehensive_assessments;

-- 6. Show sample of recent users
SELECT 'Recent Users (last 5):' as info;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 7. Show sample of profiles
SELECT 'Recent Profiles (last 5):' as info;
SELECT id, email, first_name, last_name, is_admin, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- 8. Check if admin can see other users' profiles
SELECT 'Testing admin visibility:' as info;
SELECT COUNT(*) as visible_profiles_count 
FROM profiles;

-- 9. Check RLS status on tables
SELECT 'RLS Status:' as info;
SELECT 
    schemaname,
    tablename,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables
WHERE tablename IN ('profiles', 'user_progress', 'comprehensive_assessments')
AND schemaname = 'public';

-- 10. Check RLS policies on profiles
SELECT 'RLS Policies on profiles:' as info;
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' 
AND schemaname = 'public'; 