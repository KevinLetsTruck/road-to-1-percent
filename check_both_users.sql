-- Check both kevin@letstruck.com and manual-test@example.com status
SELECT '=== KEVIN@LETSTRUCK.COM STATUS ===' as check;

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
    ELSE '❌ Email NOT Confirmed'
  END as confirmation_status,
  CASE 
    WHEN encrypted_password IS NOT NULL THEN '✅ Has Password'
    ELSE '❌ No Password Set'
  END as password_status
FROM auth.users
WHERE email = 'kevin@letstruck.com';

SELECT 'Kevin profile check:' as info;
SELECT 
  CASE WHEN p.id IS NOT NULL THEN '✅ Has Profile' ELSE '❌ NO PROFILE' END as profile_status,
  CASE WHEN up.user_id IS NOT NULL THEN '✅ Has Progress' ELSE '❌ NO PROGRESS' END as progress_status,
  CASE WHEN uap.user_id IS NOT NULL THEN '✅ Has AI Prefs' ELSE '❌ NO AI PREFS' END as ai_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_ai_preferences uap ON u.id = uap.user_id
WHERE u.email = 'kevin@letstruck.com';

SELECT '=== MANUAL-TEST@EXAMPLE.COM STATUS ===' as check;

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
    ELSE '❌ Email NOT Confirmed'
  END as confirmation_status,
  CASE 
    WHEN encrypted_password IS NOT NULL THEN '✅ Has Password'
    ELSE '❌ No Password Set'
  END as password_status
FROM auth.users
WHERE email = 'manual-test@example.com';

SELECT 'Manual-test profile check:' as info;
SELECT 
  CASE WHEN p.id IS NOT NULL THEN '✅ Has Profile' ELSE '❌ NO PROFILE' END as profile_status,
  CASE WHEN up.user_id IS NOT NULL THEN '✅ Has Progress' ELSE '❌ NO PROGRESS' END as progress_status,
  CASE WHEN uap.user_id IS NOT NULL THEN '✅ Has AI Prefs' ELSE '❌ NO AI PREFS' END as ai_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_ai_preferences uap ON u.id = uap.user_id
WHERE u.email = 'manual-test@example.com';

SELECT '=== SUMMARY ===' as check;
SELECT 
  u.email,
  CASE WHEN u.email_confirmed_at IS NOT NULL THEN 'Ready' ELSE 'Needs Email Confirm' END as login_status,
  CASE WHEN p.id IS NOT NULL AND up.user_id IS NOT NULL THEN 'Complete' ELSE 'Incomplete Setup' END as account_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.email IN ('kevin@letstruck.com', 'manual-test@example.com')
ORDER BY u.email;
