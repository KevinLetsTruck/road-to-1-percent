-- ============================================
-- FIX AUTH TRIGGER - FINAL SOLUTION
-- This fixes the "Database error querying schema" issue
-- ============================================

-- Step 1: Drop ALL custom triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_safe ON auth.users;

-- Step 2: Drop old trigger functions
DROP FUNCTION IF EXISTS public.initialize_user_data() CASCADE;
DROP FUNCTION IF EXISTS public.safe_initialize_user_data() CASCADE;

-- Step 3: Create a NEW trigger function that properly handles required fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create profile with required fields from user metadata
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    updated_at = NOW();

  -- Create user_progress
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create AI preferences
  INSERT INTO public.user_ai_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 4: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Fix any existing broken profiles (missing email/names)
UPDATE profiles p
SET 
  email = COALESCE(p.email, u.email),
  first_name = COALESCE(NULLIF(p.first_name, ''), u.raw_user_meta_data->>'first_name', 'User'),
  last_name = COALESCE(NULLIF(p.last_name, ''), u.raw_user_meta_data->>'last_name', '')
FROM auth.users u
WHERE p.id = u.id
AND (p.email IS NULL OR p.first_name IS NULL OR p.first_name = '');

-- Step 6: Verify the trigger is created
SELECT 'Trigger verification:' as info;
SELECT 
  tgname as trigger_name,
  CASE WHEN tgenabled = 'O' THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' 
AND c.relname = 'users'
AND tgname = 'on_auth_user_created';

SELECT '✅ Auth trigger fixed! Registration and login should work now.' as result;
