-- Check if migration is needed

-- 1. Check current database
SELECT 'Current database:' as info, current_database();

-- 2. Check if profiles table exists
SELECT 'Profiles table exists?' as check,
       EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'profiles') as result;

-- 3. Check if user_progress table exists  
SELECT 'User_progress table exists?' as check,
       EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'user_progress') as result;

-- 4. Current users in auth
SELECT 'Current auth.users:' as info;
SELECT email, created_at FROM auth.users ORDER BY created_at;

-- If the tables don't exist, you need to run database_migration.sql! 