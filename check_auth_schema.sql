-- Check auth.users table schema
SELECT 'Auth Users Table Schema:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  is_generated
FROM information_schema.columns
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check which columns are generated
SELECT 'Generated Columns:' as info;
SELECT 
  column_name
FROM information_schema.columns
WHERE table_schema = 'auth' 
AND table_name = 'users'
AND is_generated = 'ALWAYS'; 