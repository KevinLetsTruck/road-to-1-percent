-- Check for triggers on auth.users table
SELECT 'Triggers on auth.users:' as info;
SELECT 
  tgname as trigger_name,
  tgtype,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' 
AND c.relname = 'users';

-- Check our custom trigger
SELECT 'Custom trigger on auth.users:' as info;
SELECT 
  tgname as trigger_name,
  proname as function_name,
  tgenabled as enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';

-- Check if our trigger function has errors
SELECT 'Trigger function status:' as info;
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc
WHERE proname IN ('initialize_user_data', 'initialize_user_data_safe')
LIMIT 1;

-- Temporarily disable our trigger and test
SELECT 'Disabling custom trigger:' as info;
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- Try creating a simple test user
SELECT 'Creating test user:' as info;
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  new_user_id := gen_random_uuid();
  
  -- Minimal user creation
  INSERT INTO auth.users (
    id,
    email,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'simple-test@example.com',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'User created with ID: %', new_user_id;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating user: % - %', SQLSTATE, SQLERRM;
END $$;

-- Re-enable trigger
SELECT 'Re-enabling trigger:' as info;
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Check if user was created
SELECT 'Checking for test user:' as info;
SELECT id, email, created_at FROM auth.users WHERE email = 'simple-test@example.com'; 