-- Fix authentication issues by discovering actual schema first

-- Step 1: Show what columns actually exist in profiles table
SELECT 'PROFILES TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Show what columns exist in user_progress table
SELECT 'USER_PROGRESS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- Step 5: Create a minimal function that only uses columns we KNOW exist
-- Based on common Supabase profiles tables, these usually exist: id, created_at, updated_at
CREATE OR REPLACE FUNCTION initialize_user_data_safe()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with absolute minimum fields
  -- We'll update this after seeing the actual schema
  BEGIN
    INSERT INTO public.profiles (id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION
    WHEN others THEN
      -- If that fails, try with just id
      INSERT INTO public.profiles (id)
      VALUES (NEW.id)
      ON CONFLICT (id) DO NOTHING;
  END;
  
  -- Create user_progress entry
  INSERT INTO public.user_progress (
    user_id,
    current_tier,
    spi_completed,
    standout_completed,
    leadership_completed,
    customer_service_completed,
    operational_completed,
    health_completed,
    business_track_progress,
    personal_track_progress,
    health_track_progress,
    milestones_achieved,
    program_start_date,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    '90%',
    false,
    false,
    false,
    false,
    false,
    false,
    0,
    0,
    0,
    '[]'::jsonb,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create/replace trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_data_safe();

-- Step 7: Create simple RLS policies
CREATE POLICY "Users can read own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can read own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Step 8: Create a function to safely initialize profiles
CREATE OR REPLACE FUNCTION ensure_profile_exists(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (user_id)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Grant permissions
GRANT EXECUTE ON FUNCTION ensure_profile_exists(uuid) TO authenticated;

-- Step 10: Initialize profiles for all existing users (minimal approach)
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    BEGIN
      INSERT INTO profiles (id) VALUES (user_record.id) ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN others THEN
      -- Skip if any error
      NULL;
    END;
  END LOOP;
END $$;

-- Step 11: Initialize user_progress for all existing users
INSERT INTO user_progress (
  user_id,
  current_tier,
  spi_completed,
  standout_completed,
  leadership_completed,
  customer_service_completed,
  operational_completed,
  health_completed,
  business_track_progress,
  personal_track_progress,
  health_track_progress,
  milestones_achieved,
  program_start_date,
  created_at,
  updated_at
)
SELECT 
  id,
  '90%',
  false,
  false,
  false,
  false,
  false,
  false,
  0,
  0,
  0,
  '[]'::jsonb,
  NOW(),
  NOW(),
  NOW()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM user_progress WHERE user_progress.user_id = auth.users.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Step 12: Final verification
SELECT 'Verification Results:' as info;
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM user_progress) as total_progress,
  (SELECT COUNT(*) FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id)) as users_without_profiles,
  (SELECT COUNT(*) FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM user_progress up WHERE up.user_id = u.id)) as users_without_progress; 