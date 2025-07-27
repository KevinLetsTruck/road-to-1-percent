-- Check what tables exist in this database
-- This will help us understand why "profiles" table is not found

-- 1. Show current database and schema
SELECT 'Current Database Context:' as info;
SELECT 
    current_database() as database,
    current_schema() as schema,
    current_user as user;

-- 2. List all schemas
SELECT 'Available Schemas:' as info;
SELECT schema_name 
FROM information_schema.schemata
ORDER BY schema_name;

-- 3. Check for profiles table in ALL schemas
SELECT 'Looking for profiles table in all schemas:' as info;
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name = 'profiles';

-- 4. List all tables in public schema
SELECT 'Tables in public schema:' as info;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 5. List all tables that might be user-related
SELECT 'User-related tables in all schemas:' as info;
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_name LIKE '%user%' 
   OR table_name LIKE '%profile%'
   OR table_name LIKE '%auth%'
ORDER BY table_schema, table_name;

-- 6. Check auth schema specifically
SELECT 'Tables in auth schema:' as info;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 7. Count users in auth.users (this should work)
SELECT 'Users in auth.users:' as info;
SELECT COUNT(*) as user_count
FROM auth.users; 