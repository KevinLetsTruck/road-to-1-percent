-- ============================================
-- FIX KEVIN@LETSTRUCK.COM ACCOUNT
-- Run this AFTER the trigger fix
-- ============================================

-- Fix profile data
INSERT INTO profiles (id, email, first_name, last_name)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'first_name', 'Kevin'),
  COALESCE(u.raw_user_meta_data->>'last_name', 'Letstruck')
FROM auth.users u
WHERE u.email = 'kevin@letstruck.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = COALESCE(EXCLUDED.first_name, 'Kevin'),
  last_name = COALESCE(EXCLUDED.last_name, 'Letstruck');

-- Fix user_progress
INSERT INTO user_progress (user_id)
SELECT id FROM auth.users WHERE email = 'kevin@letstruck.com'
ON CONFLICT (user_id) DO NOTHING;

-- Fix AI preferences
INSERT INTO user_ai_preferences (user_id)
SELECT id FROM auth.users WHERE email = 'kevin@letstruck.com'
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT 'Kevin account status:' as info;
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.first_name,
  p.last_name,
  up.user_id IS NOT NULL as has_progress,
  uap.user_id IS NOT NULL as has_ai_prefs
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_ai_preferences uap ON u.id = uap.user_id
WHERE u.email = 'kevin@letstruck.com';

SELECT '✅ Kevin account fixed!' as result;
