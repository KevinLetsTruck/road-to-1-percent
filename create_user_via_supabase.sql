-- The "Database error querying schema" is a Supabase Auth issue
-- This happens when users are created directly via SQL without proper auth metadata

-- OPTION 1: Fix existing user's auth metadata
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'manual-test@example.com';
  
  IF test_user_id IS NOT NULL THEN
    -- Update user with required auth metadata
    UPDATE auth.users
    SET 
      raw_app_meta_data = '{"provider":"email","providers":["email"]}',
      raw_user_meta_data = '{"first_name":"Test","last_name":"User"}',
      is_sso_user = false,
      email_confirmed_at = NOW(),
      confirmation_token = '',
      recovery_token = '',
      aud = 'authenticated',
      role = 'authenticated',
      instance_id = '00000000-0000-0000-0000-000000000000'
    WHERE id = test_user_id;
    
    RAISE NOTICE 'Updated auth metadata for test user';
  ELSE
    RAISE NOTICE 'Test user not found - you need to create them first';
  END IF;
  
  -- Also fix kevin@letstruck.com if needed
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'kevin@letstruck.com';
  
  IF test_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET 
      raw_app_meta_data = COALESCE(raw_app_meta_data, '{"provider":"email","providers":["email"]}'),
      is_sso_user = false
    WHERE id = test_user_id AND raw_app_meta_data IS NULL;
    
    RAISE NOTICE 'Updated auth metadata for kevin user';
  END IF;
END $$;

-- Verify the fix
SELECT 'User status after fix:' as info;
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  raw_app_meta_data IS NOT NULL as has_app_metadata,
  raw_user_meta_data IS NOT NULL as has_user_metadata,
  encrypted_password IS NOT NULL as has_password
FROM auth.users
WHERE email IN ('manual-test@example.com', 'kevin@letstruck.com');
