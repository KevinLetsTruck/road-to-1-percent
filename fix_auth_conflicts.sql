-- Comprehensive fix for authentication conflicts (409 errors)
-- This script fixes issues with both profiles and user_progress tables

-- First, let's check the current state
SELECT 'Checking for duplicate profiles...' as status;
SELECT user_id, COUNT(*) 
FROM profiles 
GROUP BY user_id 
HAVING COUNT(*) > 1;

SELECT 'Checking for duplicate user_progress...' as status;
SELECT user_id, COUNT(*) 
FROM user_progress 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- Ensure unique constraints exist
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_key;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_id_key UNIQUE (user_id);

-- Create function to handle profile creation/updates
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    false
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  -- Insert user_progress
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
    program_start_date
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
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users" 
  ON profiles FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Fix any existing users that are missing profiles or progress
INSERT INTO profiles (user_id, email, full_name, avatar_url, is_admin)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', ''),
  false
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM profiles)
ON CONFLICT (user_id) DO NOTHING;

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
  program_start_date
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
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_progress)
ON CONFLICT (user_id) DO NOTHING;

-- Create functions to safely handle profile and progress operations
CREATE OR REPLACE FUNCTION get_or_create_profile(p_user_id uuid)
RETURNS profiles AS $$
DECLARE
  v_profile profiles;
  v_user auth.users;
BEGIN
  -- Get user data
  SELECT * INTO v_user FROM auth.users WHERE id = p_user_id;
  
  -- Try to get existing profile
  SELECT * INTO v_profile FROM profiles WHERE user_id = p_user_id;
  
  -- If not found, create it
  IF NOT FOUND THEN
    INSERT INTO profiles (user_id, email, full_name, avatar_url, is_admin)
    VALUES (
      p_user_id,
      v_user.email,
      COALESCE(v_user.raw_user_meta_data->>'full_name', ''),
      COALESCE(v_user.raw_user_meta_data->>'avatar_url', ''),
      false
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      updated_at = NOW()
    RETURNING * INTO v_profile;
  END IF;
  
  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_or_create_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_user_progress(uuid) TO authenticated;

-- Final check
SELECT 'Setup complete. Checking final state...' as status;
SELECT COUNT(*) as profile_count FROM profiles;
SELECT COUNT(*) as user_progress_count FROM user_progress;
SELECT COUNT(*) as user_count FROM auth.users; 