-- Fix for profiles and user_progress with correct schema

-- First, let's see what columns actually exist in profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- Create function to handle user initialization (using only existing columns)
CREATE OR REPLACE FUNCTION initialize_user_data_minimal()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile entry with minimal required fields
  -- We'll only use columns we know exist: id, email, and timestamps
  INSERT INTO public.profiles (
    id, 
    email,
    first_name,
    last_name,
    avatar_url,
    is_admin,
    verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    false,
    false,
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

-- Replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_data_minimal();

-- Create RLS policies
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

-- Initialize missing profiles with minimal data
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  avatar_url,
  is_admin,
  verified,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'first_name', ''),
  COALESCE(raw_user_meta_data->>'last_name', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', ''),
  false,
  false,
  COALESCE(created_at, NOW()),
  NOW()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

-- Initialize missing user_progress
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

-- Verify the fix
SELECT 'Users without profiles:' as check_type, COUNT(*) as count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
UNION ALL
SELECT 'Users without progress:' as check_type, COUNT(*) as count
FROM auth.users u
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE up.user_id IS NULL; 