-- Fix for 409 Conflict Errors on profiles and user_progress tables

-- 1. First, ensure RLS is enabled on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to recreate them with proper permissions
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- 3. Create a function to safely handle profile/progress initialization
CREATE OR REPLACE FUNCTION initialize_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile entry
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
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

-- 4. Create/replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_data();

-- 5. Create permissive RLS policies
-- For profiles table
CREATE POLICY "Enable read access for users to own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for users to own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users to own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- For user_progress table
CREATE POLICY "Enable read access for users to own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users to own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users to own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Create functions for safe upsert operations
CREATE OR REPLACE FUNCTION get_or_create_profile()
RETURNS profiles AS $$
DECLARE
  v_profile profiles;
BEGIN
  -- Try to get existing profile
  SELECT * INTO v_profile
  FROM profiles
  WHERE id = auth.uid();
  
  -- If not found, create it
  IF NOT FOUND THEN
    INSERT INTO profiles (id, email, created_at, updated_at)
    SELECT 
      auth.uid(),
      email,
      NOW(),
      NOW()
    FROM auth.users
    WHERE id = auth.uid()
    ON CONFLICT (id) DO UPDATE 
    SET updated_at = NOW()
    RETURNING * INTO v_profile;
  END IF;
  
  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_or_create_user_progress()
RETURNS user_progress AS $$
DECLARE
  v_progress user_progress;
BEGIN
  -- Try to get existing progress
  SELECT * INTO v_progress
  FROM user_progress
  WHERE user_id = auth.uid();
  
  -- If not found, create it
  IF NOT FOUND THEN
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
    VALUES (
      auth.uid(),
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
    ON CONFLICT (user_id) DO UPDATE 
    SET updated_at = NOW()
    RETURNING * INTO v_progress;
  END IF;
  
  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant execute permissions
GRANT EXECUTE ON FUNCTION get_or_create_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_user_progress() TO authenticated;

-- 8. Initialize data for any existing users missing records
INSERT INTO profiles (id, email, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(created_at, NOW()),
  NOW()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

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

-- 9. Verify the fix
SELECT 'Users without profiles:' as check_type, COUNT(*) as count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
UNION ALL
SELECT 'Users without progress:' as check_type, COUNT(*) as count
FROM auth.users u
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE up.user_id IS NULL; 