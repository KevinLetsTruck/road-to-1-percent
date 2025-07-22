-- Check authentication configuration

-- 1. Check if authentication is enabled
SELECT 'Auth Status:' as info;
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN 'Auth schema exists and has users'
    ELSE 'Auth schema exists but no users'
  END as auth_status;

-- 2. Check email auth settings
SELECT 'Email Auth Settings:' as info;
SELECT 
  key,
  value
FROM auth.flow_state
WHERE key LIKE '%email%'
LIMIT 5;

-- 3. Check if there are any auth configurations
SELECT 'Auth Configurations:' as info;
SELECT 
  instance_id,
  aud,
  role,
  email,
  created_at,
  updated_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check if RLS is properly configured
SELECT 'RLS Status:' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress');

-- 5. Test creating a user (this will fail but show the error)
DO $$
BEGIN
  -- Try to understand what's blocking user creation
  RAISE NOTICE 'Testing user creation capabilities...';
  
  -- Check if we can insert into auth.users
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_privileges 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND privilege_type = 'INSERT'
  ) THEN
    RAISE NOTICE 'INSERT privilege exists on auth.users';
  ELSE
    RAISE NOTICE 'No INSERT privilege on auth.users';
  END IF;
END $$;

-- 6. Check authentication functions
SELECT 'Auth Functions:' as info;
SELECT 
  routine_name
FROM information_schema.routines
WHERE routine_schema = 'auth'
AND routine_name LIKE '%signup%' OR routine_name LIKE '%signin%'
LIMIT 10; 