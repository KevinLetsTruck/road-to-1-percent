-- Fix any missing profile data for both accounts
DO $$
DECLARE
  kevin_id uuid;
  test_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO kevin_id FROM auth.users WHERE email = 'kevin@letstruck.com';
  SELECT id INTO test_id FROM auth.users WHERE email = 'manual-test@example.com';
  
  -- Fix Kevin's profile if missing
  IF kevin_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, first_name, last_name)
    VALUES (kevin_id, 'kevin@letstruck.com', 'Kevin', 'Letstruck')
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO user_progress (user_id)
    VALUES (kevin_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO user_ai_preferences (user_id)
    VALUES (kevin_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Kevin account setup completed';
  END IF;
  
  -- Fix test user's profile if missing
  IF test_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, first_name, last_name)
    VALUES (test_id, 'manual-test@example.com', 'Test', 'User')
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO user_progress (user_id)
    VALUES (test_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO user_ai_preferences (user_id)
    VALUES (test_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Test account setup completed';
  END IF;
END $$;

-- Verify fixes
SELECT 'After fixes - both accounts:' as info;
SELECT 
  u.email,
  CASE WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmed' ELSE '❌ Unconfirmed' END as email_status,
  CASE WHEN p.id IS NOT NULL THEN '✅ Profile' ELSE '❌ No Profile' END as profile,
  CASE WHEN up.user_id IS NOT NULL THEN '✅ Progress' ELSE '❌ No Progress' END as progress,
  CASE WHEN uap.user_id IS NOT NULL THEN '✅ AI Ready' ELSE '❌ No AI Prefs' END as ai_ready
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_ai_preferences uap ON u.id = uap.user_id
WHERE u.email IN ('kevin@letstruck.com', 'manual-test@example.com')
ORDER BY u.email;
