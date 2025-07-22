-- Simple test user creation
-- First check if user exists
SELECT 'Checking for existing test user:' as info;
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email = 'manual-test@example.com';

-- Create user using a simpler approach
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'manual-test@example.com';
  
  IF test_user_id IS NULL THEN
    -- Generate new UUID
    test_user_id := gen_random_uuid();
    
    -- Create user with minimal required fields
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      instance_id,
      aud,
      role
    ) VALUES (
      test_user_id,
      'manual-test@example.com',
      crypt('password123', gen_salt('bf')),
      NOW(), -- Auto-confirm email
      NOW(),
      NOW(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated'
    );
    
    RAISE NOTICE 'User created successfully';
  ELSE
    RAISE NOTICE 'User already exists with ID: %', test_user_id;
  END IF;
  
  -- Ensure profile exists
  INSERT INTO profiles (id)
  VALUES (test_user_id)
  ON CONFLICT (id) DO NOTHING;
  
  -- Ensure user_progress exists
  INSERT INTO user_progress (user_id)
  VALUES (test_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
END $$;

-- Verify creation
SELECT 'Final check:' as info;
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  CASE WHEN p.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_profile,
  CASE WHEN up.user_id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_progress
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.email = 'manual-test@example.com'; 