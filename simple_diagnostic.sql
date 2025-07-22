-- Simple diagnostic script to understand the database structure

-- 1. Check profiles table columns
SELECT 'PROFILES TABLE COLUMNS:' as section;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check user_progress table columns
SELECT 'USER_PROGRESS TABLE COLUMNS:' as section;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
ORDER BY ordinal_position;

-- 3. Check if tables have any data
SELECT 'PROFILES ROW COUNT:' as section;
SELECT COUNT(*) as profile_count FROM profiles;

SELECT 'USER_PROGRESS ROW COUNT:' as section;
SELECT COUNT(*) as progress_count FROM user_progress;

-- 4. Check auth.users count
SELECT 'AUTH.USERS ROW COUNT:' as section;
SELECT COUNT(*) as user_count FROM auth.users;

-- 5. Check RLS status
SELECT 'RLS STATUS:' as section;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'user_progress');

-- 6. List all RLS policies
SELECT 'RLS POLICIES:' as section;
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('profiles', 'user_progress'); 