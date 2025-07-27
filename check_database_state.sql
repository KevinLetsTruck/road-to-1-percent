-- Check Database State
-- Run each section separately to see all results

-- 1. What database are we connected to?
SELECT 
    current_database() as database_name,
    pg_database_size(current_database())/1024/1024 as size_mb;

-- 2. List ALL tables in public schema
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. If no tables in public, check what schemas exist
SELECT 
    nspname as schema_name,
    count(*) as table_count
FROM pg_namespace n
LEFT JOIN pg_class c ON n.oid = c.relnamespace 
WHERE c.relkind = 'r'
GROUP BY nspname
ORDER BY table_count DESC;

-- 4. List the 3 users in auth.users
SELECT id, email, created_at 
FROM auth.users
ORDER BY created_at; 