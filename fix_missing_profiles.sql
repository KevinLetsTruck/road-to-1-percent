-- Fix the 2 missing profiles

-- First, let's see which users are missing profiles
SELECT 'Users missing profiles:' as info;
SELECT u.id, u.email, u.created_at 
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Now let's see what columns the profiles table actually has
SELECT 'Profiles table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Insert missing profiles with minimal data
-- We'll build this dynamically based on what columns exist
DO $$
DECLARE
  user_record RECORD;
  profile_columns TEXT;
  profile_values TEXT;
BEGIN
  -- Check what columns exist
  SELECT string_agg(column_name, ', ' ORDER BY ordinal_position) 
  INTO profile_columns
  FROM information_schema.columns 
  WHERE table_name = 'profiles' 
  AND table_schema = 'public'
  AND column_name IN ('id', 'email', 'created_at', 'updated_at');
  
  -- For each user without a profile
  FOR user_record IN 
    SELECT u.* 
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    BEGIN
      -- Try different combinations based on what columns exist
      
      -- Try 1: id, email, created_at, updated_at
      BEGIN
        EXECUTE format('INSERT INTO profiles (id, email, created_at, updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING')
        USING user_record.id, user_record.email, COALESCE(user_record.created_at, NOW()), NOW();
        RAISE NOTICE 'Created profile for user % with email', user_record.id;
        CONTINUE;
      EXCEPTION WHEN others THEN
        -- Try next approach
      END;
      
      -- Try 2: id, created_at, updated_at
      BEGIN
        EXECUTE format('INSERT INTO profiles (id, created_at, updated_at) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING')
        USING user_record.id, COALESCE(user_record.created_at, NOW()), NOW();
        RAISE NOTICE 'Created profile for user % without email', user_record.id;
        CONTINUE;
      EXCEPTION WHEN others THEN
        -- Try next approach
      END;
      
      -- Try 3: just id and created_at
      BEGIN
        EXECUTE format('INSERT INTO profiles (id, created_at) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING')
        USING user_record.id, COALESCE(user_record.created_at, NOW());
        RAISE NOTICE 'Created profile for user % with just created_at', user_record.id;
        CONTINUE;
      EXCEPTION WHEN others THEN
        -- Try next approach
      END;
      
      -- Try 4: just id
      BEGIN
        EXECUTE format('INSERT INTO profiles (id) VALUES ($1) ON CONFLICT (id) DO NOTHING')
        USING user_record.id;
        RAISE NOTICE 'Created profile for user % with just id', user_record.id;
        CONTINUE;
      EXCEPTION WHEN others THEN
        RAISE WARNING 'Failed to create profile for user %: %', user_record.id, SQLERRM;
      END;
      
    END;
  END LOOP;
END $$;

-- Now let's update any profiles that have NULL values in required fields
-- First check if these columns exist and update them
DO $$
BEGIN
  -- Update email if column exists and is NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'email'
    AND table_schema = 'public'
  ) THEN
    UPDATE profiles p
    SET email = u.email
    FROM auth.users u
    WHERE p.id = u.id
    AND p.email IS NULL;
  END IF;
  
  -- Update first_name if column exists and is NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'first_name'
    AND table_schema = 'public'
  ) THEN
    UPDATE profiles p
    SET first_name = COALESCE(u.raw_user_meta_data->>'first_name', '')
    FROM auth.users u
    WHERE p.id = u.id
    AND p.first_name IS NULL;
  END IF;
  
  -- Update last_name if column exists and is NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'last_name'
    AND table_schema = 'public'
  ) THEN
    UPDATE profiles p
    SET last_name = COALESCE(u.raw_user_meta_data->>'last_name', '')
    FROM auth.users u
    WHERE p.id = u.id
    AND p.last_name IS NULL;
  END IF;
  
  -- Update avatar_url if column exists and is NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'avatar_url'
    AND table_schema = 'public'
  ) THEN
    UPDATE profiles p
    SET avatar_url = COALESCE(u.raw_user_meta_data->>'avatar_url', '')
    FROM auth.users u
    WHERE p.id = u.id
    AND p.avatar_url IS NULL;
  END IF;
  
  -- Update is_admin if column exists and is NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_admin'
    AND table_schema = 'public'
  ) THEN
    UPDATE profiles
    SET is_admin = false
    WHERE is_admin IS NULL;
  END IF;
END $$;

-- Final verification
SELECT 'Final verification:' as info;
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM user_progress) as total_progress,
  (SELECT COUNT(*) FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id)) as users_without_profiles,
  (SELECT COUNT(*) FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM user_progress up WHERE up.user_id = u.id)) as users_without_progress;

-- Show all profiles to verify
SELECT 'All profiles:' as info;
SELECT * FROM profiles ORDER BY created_at; 