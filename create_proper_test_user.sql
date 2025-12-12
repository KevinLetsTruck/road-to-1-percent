-- Proper test user creation with ALL required Supabase Auth fields
-- This fixes the "Database error querying schema" issue

-- First delete any existing broken user
DELETE FROM user_ai_preferences WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'demo@test.com');
DELETE FROM user_progress WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'demo@test.com');
DELETE FROM profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'demo@test.com');
DELETE FROM auth.users WHERE email = 'demo@test.com';

-- Create user with ALL required fields
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    deleted_at
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Demo","last_name":"User"}',
    FALSE,
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    NULL
  );
  
  -- Create profile
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (new_user_id, 'demo@test.com', 'Demo', 'User');
  
  -- Create user progress
  INSERT INTO user_progress (user_id)
  VALUES (new_user_id);
  
  -- Create AI preferences
  INSERT INTO user_ai_preferences (user_id)
  VALUES (new_user_id);
  
  RAISE NOTICE 'Demo user created successfully!';
END $$;

-- Verify
SELECT 'Demo user created:' as info;
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmed,
  p.first_name,
  up.user_id IS NOT NULL as has_progress
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.email = 'demo@test.com';
