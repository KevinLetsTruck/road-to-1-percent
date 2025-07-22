-- Create a test user manually (Fixed version)
-- This version doesn't insert into generated columns

-- First, create the user in auth.users
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Generate a UUID for the test user
  test_user_id := gen_random_uuid();
  
  -- Insert into auth.users (only non-generated columns)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    test_user_id,
    '00000000-0000-0000-0000-000000000000',
    'manual-test@example.com',
    crypt('password123', gen_salt('bf')), -- Password: password123
    NOW(), -- This confirms the email immediately
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "Test", "last_name": "User"}',
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING;
  
  -- Get the user ID (in case it already existed)
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'manual-test@example.com';
  
  -- Create profile
  INSERT INTO profiles (id, email, first_name, last_name, created_at, updated_at)
  VALUES (
    test_user_id,
    'manual-test@example.com',
    'Test',
    'User',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW();
  
  -- Create user_progress
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
  ) VALUES (
    test_user_id,
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
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();
  
  RAISE NOTICE 'Test user created/updated with email: manual-test@example.com and password: password123';
END $$;

-- Verify the user was created
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