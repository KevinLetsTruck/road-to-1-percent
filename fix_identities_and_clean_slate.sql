-- ============================================
-- NUCLEAR OPTION: DELETE TEST USERS & START FRESH
-- The issue is users created via SQL are missing auth.identities entries
-- ============================================

-- Step 1: Delete ALL test users completely (not kevin)
DELETE FROM user_ai_preferences WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%demo%' OR email LIKE '%manual%' OR email LIKE '%example%'
);
DELETE FROM user_progress WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%demo%' OR email LIKE '%manual%' OR email LIKE '%example%'
);
DELETE FROM profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%demo%' OR email LIKE '%manual%' OR email LIKE '%example%'
);
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%demo%' OR email LIKE '%manual%' OR email LIKE '%example%'
);
DELETE FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%demo%' OR email LIKE '%manual%' OR email LIKE '%example%';

SELECT 'All test users deleted. Use the Register page to create accounts!' as result;

-- Step 2: For kevin@letstruck.com - create identity if missing
DO $$
DECLARE
  kevin_id uuid;
BEGIN
  SELECT id INTO kevin_id FROM auth.users WHERE email = 'kevin@letstruck.com';
  
  IF kevin_id IS NOT NULL THEN
    -- Check if identity exists
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = kevin_id) THEN
      -- Create identity entry (required for Supabase Auth to work)
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        kevin_id, -- use same id
        kevin_id,
        jsonb_build_object('sub', kevin_id::text, 'email', 'kevin@letstruck.com'),
        'email',
        kevin_id::text,
        NOW(),
        NOW(),
        NOW()
      );
      RAISE NOTICE 'Created identity for kevin';
    ELSE
      RAISE NOTICE 'Kevin already has identity';
    END IF;
  END IF;
END $$;

-- Step 3: Verify kevin's account is complete
SELECT 'Kevin account check:' as info;
SELECT 
  u.email,
  i.id IS NOT NULL as has_identity,
  i.provider,
  p.id IS NOT NULL as has_profile,
  up.user_id IS NOT NULL as has_progress
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.email = 'kevin@letstruck.com';

SELECT '✅ Test users cleaned. Kevin identity fixed.' as result;
SELECT '📝 For kevin: Use "Forgot Password" on login page to reset password' as next_step;
SELECT '📝 For testing: Register a NEW account via /register page' as testing_step;
