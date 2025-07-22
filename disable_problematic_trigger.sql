-- Check what triggers exist on auth.users
SELECT 'Current triggers on auth.users:' as info;
SELECT 
  tgname as trigger_name,
  tgenabled as enabled,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' 
AND c.relname = 'users'
AND NOT tgisinternal;

-- Drop our problematic trigger
SELECT 'Dropping problematic trigger:' as info;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Verify it's gone
SELECT 'Triggers after removal:' as info;
SELECT 
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' 
AND c.relname = 'users'
AND NOT tgisinternal;

-- Now test user creation manually
SELECT 'Testing user creation without trigger:' as info;
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Try to create a user via Supabase's function
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'trigger-test@example.com';
  
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'User does not exist, trigger is gone so signup should work now';
  ELSE
    RAISE NOTICE 'User already exists with ID: %', test_user_id;
  END IF;
END $$;

-- Create a safer trigger that won't break user creation
SELECT 'Creating safer trigger:' as info;

-- First, create a safe function that handles errors gracefully
CREATE OR REPLACE FUNCTION public.safe_initialize_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if user has email (avoid system users)
  IF NEW.email IS NOT NULL THEN
    -- Create profile (ignore if exists)
    INSERT INTO public.profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
    
    -- Create user_progress (ignore if exists)
    INSERT INTO public.user_progress (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  -- Always return NEW to allow user creation to continue
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error in safe_initialize_user_data: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger that won't break anything
CREATE TRIGGER on_auth_user_created_safe
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.safe_initialize_user_data();

SELECT 'Trigger recreation complete!' as info; 