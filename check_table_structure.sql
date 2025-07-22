-- Check table structures to understand the schema
SELECT 'Profiles table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'User Progress table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check existing constraints
SELECT 'Existing constraints on profiles:' as info;
SELECT conname, contype, consrc
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass;

SELECT 'Existing constraints on user_progress:' as info;
SELECT conname, contype, consrc
FROM pg_constraint
WHERE conrelid = 'user_progress'::regclass;

-- Check existing policies
SELECT 'Existing RLS policies on profiles:' as info;
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

SELECT 'Existing RLS policies on user_progress:' as info;
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_progress';

-- Check if RLS is enabled
SELECT 'RLS status:' as info;
SELECT tablename, 
       CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.tablename IN ('profiles', 'user_progress')
AND t.schemaname = 'public'; 